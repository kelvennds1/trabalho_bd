import base64
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import text
from werkzeug.security import generate_password_hash, check_password_hash
from src.models import (Conta, Destino, Viagem, Hospedagem, Pagamento, Atividade, Transporte,
                        GuiaTuristico, PacoteTuristico, PontoTuristico, RelViagemDestino, RelViagemHospedagem, RelViagemConta, db)

routes = Blueprint('routes', __name__)

# Registro de usuário
@routes.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    print("📢 Dados recebidos para registro:", data)

    # Validação de campos obrigatórios
    required_fields = ["nome", "email", "senha"]
    missing_fields = [field for field in required_fields if field not in data or not data[field]]

    if missing_fields:
        return jsonify({"message": "Campos obrigatórios ausentes", "missing_fields": missing_fields}), 400

    # Verifica se o e-mail já está cadastrado
    existing_user = Conta.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify({"message": "E-mail já cadastrado"}), 400

    try:
        # Criando novo usuário (sem definir `codConta`, o banco gera automaticamente)
        novo_usuario = Conta(
            nome=data["nome"],
            email=data["email"],
            senha=data["senha"],  # 🔹 Certifique-se de que está criptografada antes de salvar
            foto=data.get("foto", None),
        )

        db.session.add(novo_usuario)
        db.session.flush()  # 🔹 Garante que o ID foi gerado corretamente antes do commit
        print(f"✅ Usuário criado com ID: {novo_usuario.codConta}")

        db.session.commit()

        return jsonify({"message": "Usuário registrado com sucesso!", "id": novo_usuario.codConta}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Erro ao registrar usuário: {str(e)}"}), 500


# Login
@routes.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = Conta.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.senha, data['senha']):
        access_token = create_access_token(identity=str(user.codConta))
        return jsonify({'token': access_token, 'user_id': user.codConta}), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

# Viagens do usuário
@routes.route('/api/viagens', methods=['GET'])
@jwt_required()
def get_user_viagens():
    try:
        user_id = get_jwt_identity()
        user = Conta.query.get(user_id)
        
        viagens = []
        for viagem in user.viagens:
            destinos = [{'id': d.CodDestino, 'nome': d.nomeDestino} for d in viagem.destinos]
            
            viagens.append({
                'id': viagem.codViagem,
                'nomeViagem': viagem.nomeViagem,
                'tipoViagem': viagem.tipoViagem,
                'quantParticipantes': viagem.quantParticipantes,
                'dataInicio': viagem.dataInicio.strftime('%Y-%m-%d') if viagem.dataInicio else None,
                'dataTermino': viagem.dataTermino.strftime('%Y-%m-%d') if viagem.dataTermino else None,
                'destinos': destinos
            })

        return jsonify(viagens), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# 📌 GET: Obter detalhes de uma viagem pelo ID
@routes.route('/api/viagens/<int:viagem_id>', methods=['GET'])
@jwt_required()
def get_viagem_by_id(viagem_id):
    viagem = Viagem.query.get(viagem_id)
    if not viagem:
        return jsonify({'message': 'Viagem não encontrada'}), 404

    destinos = [{'id': d.CodDestino, 'nome': d.nomeDestino} for d in viagem.destinos]

    return jsonify({
        'id': viagem.codViagem,
        'nome': viagem.nomeViagem,
        'tipo': viagem.tipoViagem,
        'quantParticipantes': viagem.quantParticipantes,
        'dataInicio': viagem.dataInicio.strftime('%Y-%m-%d') if viagem.dataInicio else None,
        'dataTermino': viagem.dataTermino.strftime('%Y-%m-%d') if viagem.dataTermino else None,
        'destinos': destinos,
        'descricao': viagem.descrição
    }), 200


# 📌 POST: Criar uma nova viagem (com atualização da tabela `rel_viagem_destino`)
@routes.route('/api/viagens', methods=['POST'])
@jwt_required()
def create_viagem():
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        # Convertendo as datas
        data_inicio = datetime.strptime(data['dataInicio'], '%Y-%m-%d').date() if 'dataInicio' in data else None
        data_termino = datetime.strptime(data['dataTermino'], '%Y-%m-%d').date() if 'dataTermino' in data else None

        # Criando a nova viagem
        nova_viagem = Viagem(
            nomeViagem=data['nomeViagem'],
            tipoViagem=data['tipoViagem'],
            quantParticipantes=data.get('quantParticipantes', 1),
            dataInicio=data_inicio,
            dataTermino=data_termino
        )
        
        db.session.add(nova_viagem)
        db.session.flush()  # Para obter o ID antes de commit
        
        # Adicionando destinos sem duplicação
        for destino_id in data.get('destinos', []):
            existe = db.session.query(RelViagemDestino).filter_by(
                codViagem=nova_viagem.codViagem, CodDestino=destino_id
            ).first()

            if not existe:
                relacao = RelViagemDestino(codViagem=nova_viagem.codViagem, CodDestino=destino_id)
                db.session.add(relacao)

        # Adiciona o usuário à viagem
        user = Conta.query.get(user_id)
        if user:
            nova_viagem.usuarios.append(user)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Viagem criada com sucesso',
            'id': nova_viagem.codViagem
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500



# 📌 DELETE: Deletar uma viagem (removendo também os destinos da tabela `rel_viagem_destino`)
from sqlalchemy import text

@routes.route('/api/viagens/<int:viagem_id>', methods=['DELETE'])
@jwt_required()
def delete_viagem(viagem_id):
    try:
        # Verifica se a viagem existe
        viagem = Viagem.query.get(viagem_id)
        if not viagem:
            return jsonify({'message': 'Viagem não encontrada'}), 404

        # Exclui os registros nas tabelas de relacionamento primeiro
        db.session.execute(text('DELETE FROM rel_viagem_destino WHERE "codViagem" = :viagem_id'), {'viagem_id': viagem_id})
        db.session.execute(text('DELETE FROM rel_viagem_conta WHERE "codViagem" = :viagem_id'), {'viagem_id': viagem_id})
        db.session.execute(text('DELETE FROM rel_viagem_hospedagem WHERE "codViagem" = :viagem_id'), {'viagem_id': viagem_id})
        db.session.execute(text('DELETE FROM rel_viagem_atividade WHERE "codViagem" = :viagem_id'), {'viagem_id': viagem_id})
        db.session.execute(text('DELETE FROM rel_viagem_transporte WHERE "codViagem" = :viagem_id'), {'viagem_id': viagem_id})
        db.session.execute(text('DELETE FROM rel_viagem_pacote_turistico WHERE "codViagem" = :viagem_id'), {'viagem_id': viagem_id})

        # Exclui pagamentos associados à viagem
        db.session.execute(text('DELETE FROM pagamento WHERE "codViagem" = :viagem_id'), {'viagem_id': viagem_id})

        # Exclui hospedagens associadas à viagem
        db.session.execute(text('DELETE FROM hospedagem WHERE "CodHospedagem" IN (SELECT "CodHospedagem" FROM rel_viagem_hospedagem WHERE "codViagem" = :viagem_id)'), {'viagem_id': viagem_id})
        db.session.execute(text('DELETE FROM rel_viagem_hospedagem WHERE "codViagem" = :viagem_id'), {'viagem_id': viagem_id})

        # Exclui a viagem após limpar os relacionamentos
        db.session.delete(viagem)

        db.session.commit()
        
        return jsonify({'message': 'Viagem e todos os registros associados foram excluídos com sucesso'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao deletar viagem: {str(e)}'}), 500



# 📌 PUT: Atualizar uma viagem (removendo destinos antigos e adicionando novos na tabela `rel_viagem_destino`)
@routes.route('/api/viagens/<int:viagem_id>', methods=['PUT'])
@jwt_required()
def update_viagem(viagem_id):
    data = request.json
    viagem = Viagem.query.get(viagem_id)

    if not viagem:
        return jsonify({'message': 'Viagem não encontrada'}), 404

    try:
        print("📢 Recebendo dados para atualização:", data)

        viagem.nomeViagem = data.get('nome', viagem.nomeViagem)
        viagem.tipoViagem = data.get('tipoViagem', viagem.tipoViagem)
        viagem.quantParticipantes = data.get('quantParticipantes', viagem.quantParticipantes)
        viagem.descrição = data.get('descricao', viagem.descrição)

        if 'dataInicio' in data and data['dataInicio']:
            viagem.dataInicio = datetime.strptime(data['dataInicio'], '%Y-%m-%d').date()

        if 'dataTermino' in data and data['dataTermino']:
            viagem.dataTermino = datetime.strptime(data['dataTermino'], '%Y-%m-%d').date()

        # 📌 Atualiza os destinos - Remove os antigos e adiciona os novos sem duplicação
        destinos_atualizados = set(map(int, data.get('destinos', [])))

        # 1️⃣ Busca os destinos atualmente associados
        destinos_atuais = {d.CodDestino for d in viagem.destinos}

        # 2️⃣ Remove apenas os destinos que não estão na nova lista
        destinos_para_remover = destinos_atuais - destinos_atualizados
        for destino_id in destinos_para_remover:
            destino = Destino.query.get(destino_id)
            if destino:
                viagem.destinos.remove(destino)

        # 3️⃣ Adiciona apenas os novos destinos que ainda não existem na relação
        destinos_para_adicionar = destinos_atualizados - destinos_atuais
        for destino_id in destinos_para_adicionar:
            destino = Destino.query.get(destino_id)
            if destino:
                viagem.destinos.append(destino)

        db.session.commit()

        return jsonify({'message': 'Viagem atualizada com sucesso'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao atualizar viagem: {str(e)}'}), 500


@routes.route('/api/viagens/<int:viagem_id>/foto', methods=['POST'])
@jwt_required()
def upload_viagem_foto(viagem_id):
    viagem = Viagem.query.get(viagem_id)

    if not viagem:
        return jsonify({'message': 'Viagem não encontrada'}), 404

    if 'foto' not in request.files:
        return jsonify({'message': 'Nenhuma imagem foi enviada'}), 400

    file = request.files['foto']
    viagem.foto = file.read()  # 📌 Armazena os bytes da imagem diretamente no banco

    db.session.commit()
    return jsonify({'message': 'Foto da viagem enviada com sucesso'}), 200

@routes.route('/api/viagens/<int:viagem_id>/foto', methods=['GET'])
@jwt_required()
def get_viagem_foto(viagem_id):
    viagem = Viagem.query.get(viagem_id)

    if not viagem or not viagem.foto:
        return jsonify({'message': 'Foto não encontrada'}), 404

    encoded_foto = base64.b64encode(viagem.foto).decode('utf-8')  # 📌 Converte bytes para Base64
    return jsonify({'foto': encoded_foto})



@routes.route('/api/destinos', methods=['GET'])
def get_destinos():
    destinos = Destino.query.all()
    return jsonify([{'id': d.CodDestino, 'nome': d.nomeDestino, 'idioma': d.idiomaLocal} for d in destinos])

@routes.route('/api/destinos', methods=['POST'])
def post_destinos():
    data = request.json
    if Destino.query.filter_by(nomeDestino=data['nomeDestino']).first():
        return jsonify({'message': 'Destino já existente'}), 400
    
    novo_destino = Destino(nomeDestino=data['nomeDestino'], idiomaLocal=data['idiomaLocal'])
    db.session.add(novo_destino)
    db.session.commit()

    return jsonify({'message': 'Destino criado com sucesso.', 'id': novo_destino.CodDestino}), 201




# 📌 Rota para obter os dados da conta do usuário autenticado
@routes.route('/api/conta', methods=['GET'])
@jwt_required()
def get_conta():
    user_id = get_jwt_identity()
    user = Conta.query.get(user_id)

    if not user:
        return jsonify({'message': 'Conta não encontrada'}), 404

    return jsonify({
        'id': user.codConta,
        'nome': user.nome,
        'email': user.email
    })

# 📌 Rota para atualizar o nome do usuário autenticado
@routes.route('/api/conta', methods=['PUT'])
@jwt_required()
def update_conta():
    user_id = get_jwt_identity()
    user = Conta.query.get(user_id)

    if not user:
        return jsonify({'message': 'Conta não encontrada'}), 404

    data = request.json
    new_name = data.get('nome')

    if not new_name:
        return jsonify({'message': 'O nome não pode estar vazio'}), 400

    user.nome = new_name
    db.session.commit()

    return jsonify({'message': 'Nome atualizado com sucesso'})

# 📌 Rota para deletar a conta do usuário autenticado
@routes.route('/api/conta', methods=['DELETE'])
@jwt_required()
def delete_conta():
    user_id = get_jwt_identity()
    user = Conta.query.get(user_id)

    if not user:
        return jsonify({'message': 'Conta não encontrada'}), 404

    try:
        # 📌 Remover relações associadas antes de excluir a conta
        db.session.execute(
            "DELETE FROM rel_viagem_conta WHERE codConta = :user_id",
            {"user_id": user_id}
        )
        db.session.execute(
            "DELETE FROM pagamento WHERE codViagem IN "
            "(SELECT codViagem FROM viagem WHERE codViagem IN "
            "(SELECT codViagem FROM rel_viagem_conta WHERE codConta = :user_id))",
            {"user_id": user_id}
        )
        db.session.execute(
            "DELETE FROM viagem WHERE codViagem IN "
            "(SELECT codViagem FROM rel_viagem_conta WHERE codConta = :user_id)",
            {"user_id": user_id}
        )
        db.session.execute(
            "DELETE FROM telefone_conta WHERE conta_cod = :user_id",
            {"user_id": user_id}
        )

        # 📌 Excluir a conta do usuário
        db.session.delete(user)
        db.session.commit()

        return jsonify({'message': 'Conta e todas as informações associadas foram deletadas com sucesso'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao deletar conta: {str(e)}'}), 500


# 📌 Rota para upload de foto de perfil
@routes.route('/api/conta/foto', methods=['POST'])
@jwt_required()
def upload_foto():
    user_id = get_jwt_identity()
    user = Conta.query.get(user_id)

    if 'foto' not in request.files:
        return jsonify({'message': 'Nenhum arquivo foi enviado'}), 400

    file = request.files['foto']
    user.foto = file.read()  # Armazena os bytes da imagem diretamente no banco de dados

    db.session.commit()
    
    return jsonify({'message': 'Foto enviada com sucesso'})

# 📌 Rota para obter a foto do perfil do usuário autenticado
@routes.route('/api/conta/foto', methods=['GET'])
@jwt_required()
def get_foto():
    user_id = get_jwt_identity()
    user = Conta.query.get(user_id)

    if not user or not user.foto:
        return jsonify({'message': 'Foto não encontrada'}), 404

    encoded_foto = base64.b64encode(user.foto).decode('utf-8')  # Converte os bytes para Base64
    return jsonify({'foto': encoded_foto})

# Pagamentos
@routes.route('/api/pagamentos', methods=['GET'])
def get_pagamentos():
    cod_viagem = request.args.get('codViagem', type=int)  # Obtém o parâmetro da URL

    if not cod_viagem:
        return jsonify({'message': 'O parâmetro codViagem é obrigatório'}), 400

    pagamentos = Pagamento.query.filter_by(codViagem=cod_viagem).all()
    
    return jsonify([
        {
            'id': p.CodPagamento,
            'valor': str(p.valor),
            'statusPagamento': p.statusPagamento,
            'metodo': p.metodo
        } for p in pagamentos
    ])

@routes.route('/api/pagamentos', methods=['POST'])
@jwt_required()
def post_pagamentos():    
    data = request.json
    novo_pagamento = Pagamento(
        codViagem=data['codViagem'],
        metodo=data['metodo'],
        data=datetime.strptime(data['data'], '%Y-%m-%d').date(),
        statusPagamento=data['statusPagamento'],
        valor=data['valor']
    )

    db.session.add(novo_pagamento)
    db.session.commit()

    return jsonify({'message': 'Pagamento registrado com sucesso', 'id': novo_pagamento.CodPagamento}), 201

@routes.route('/api/pagamentos/<int:pagamento_id>', methods=['PUT'])
@jwt_required()
def update_pagamento(pagamento_id):
    data = request.json
    pagamento = Pagamento.query.get(pagamento_id)

    if not pagamento:
        return jsonify({'message': 'Pagamento não encontrado'}), 404

    pagamento.metodo = data.get('metodo', pagamento.metodo)
    pagamento.statusPagamento = data.get('statusPagamento', pagamento.statusPagamento)
    
    if 'data' in data:
        pagamento.data = datetime.strptime(data['data'], '%Y-%m-%d').date()
    
    if 'valor' in data:
        pagamento.valor = data['valor']

    db.session.commit()
    
    return jsonify({'message': 'Pagamento atualizado com sucesso'}), 200

@routes.route('/api/pagamentos/<int:pagamento_id>', methods=['DELETE'])
@jwt_required()
def delete_pagamento(pagamento_id):
    pagamento = Pagamento.query.get(pagamento_id)
    if not pagamento:
        return jsonify({'message': 'Pagamento não encontrado'}), 404

    db.session.delete(pagamento)
    db.session.commit()

    return jsonify({'message': 'Pagamento deletado com sucesso'}), 200


from sqlalchemy import text

@routes.route('/api/destinos/populares', methods=['GET'])
def get_destinos_populares():
    try:
        limite = request.args.get("limite", 10, type=int)  # Define um valor padrão de 10

        db.session.execute(text("DROP TABLE IF EXISTS temp_destinos_populares"))

        db.session.execute(text("""
            CREATE TEMP TABLE temp_destinos_populares AS
            SELECT d."CodDestino", d."nomeDestino", COUNT(v."codViagem") AS total_viagens
            FROM destino d
            JOIN rel_viagem_destino rvd ON d."CodDestino" = rvd."CodDestino"
            JOIN viagem v ON rvd."codViagem" = v."codViagem"
            GROUP BY d."CodDestino", d."nomeDestino"
            ORDER BY total_viagens DESC
            LIMIT :limite;
        """), {"limite": limite})

        db.session.commit()  # Confirma a criação da tabela temporária

        result = db.session.execute(text("SELECT * FROM temp_destinos_populares"))
        destinos = [{"CodDestino": row[0], "nomeDestino": row[1], "total_viagens": row[2]} for row in result]
        
        return jsonify(destinos), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Erro ao buscar destinos mais populares", "error": str(e)}), 500

# Atividades

@routes.route('/api/atividades', methods=['GET'])
def get_atividades():
    atividades = Atividade.query.all()
    return jsonify([{'id': a.codAtividade, 'nome': a.nomeAtividade} for a in atividades])

# Transporte
@routes.route('/api/transportes', methods=['GET'])
def get_transportes():
    transportes = Transporte.query.all()
    return jsonify([{'id': t.codTrasporte, 'tipo': t.tipo} for t in transportes])

# Guias Turísticos
@routes.route('/api/guias', methods=['GET'])
def get_guias():
    guias = GuiaTuristico.query.all()
    return jsonify([{'id': g.codTuristico, 'nome': g.nome} for g in guias])

# Pacotes Turísticos
@routes.route('/api/pacotes', methods=['GET'])
def get_pacotes():
    pacotes = PacoteTuristico.query.all()
    return jsonify([{'id': p.CodTuristico, 'nome': p.nome} for p in pacotes])


@routes.route('/api/hospedagens', methods=['GET'])
@jwt_required()
def get_hospedagens():
    user_id = get_jwt_identity()

    # Obtém todas as viagens do usuário autenticado
    viagens_usuario = db.session.query(RelViagemConta.codViagem).filter_by(codConta=user_id).all()
    viagens_ids = [viagem.codViagem for viagem in viagens_usuario]

    if not viagens_ids:
        return jsonify([])  # Retorna lista vazia se o usuário não tiver viagens

    # Filtra as hospedagens associadas às viagens do usuário
    hospedagens = db.session.query(Hospedagem).join(RelViagemHospedagem).filter(
        RelViagemHospedagem.codViagem.in_(viagens_ids)
    ).all()

    return jsonify([
        {
            'id': h.CodHospedagem,
            'nome': h.nome,
            'endereco': h.endereco,
            'diaria': str(h.diaria),
            'dataCheckin': h.dataCheckin.strftime('%Y-%m-%d'),
            'dataCheckout': h.dataCheckout.strftime('%Y-%m-%d'),
            'codDestino': h.CodDestino,
            'codViagem': rel.codViagem  # Obtendo a viagem associada
        }
        for h in hospedagens for rel in h.viagens  # Iterando sobre os relacionamentos
    ])


# 📌 Rota para criar uma hospedagem
from flask import request, jsonify
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from src.models import db, Hospedagem, Destino, Viagem, RelViagemHospedagem
from src.routes import routes

@routes.route('/api/hospedagens', methods=['POST'])
def create_hospedagem():
    data = request.json
    print("📢 Dados recebidos:", data)

    # Validação dos campos obrigatórios
    required_fields = ["nome", "endereco", "diaria", "dataEntrada", "dataSaida", "codDestino", "codViagem"]
    missing_fields = [field for field in required_fields if field not in data or not data[field]]

    if missing_fields:
        return jsonify({'message': 'Campos obrigatórios ausentes', 'missing_fields': missing_fields}), 400

    # Verifica se o destino existe
    destino = Destino.query.get(data['codDestino'])
    if not destino:
        return jsonify({'message': 'Destino não encontrado'}), 404

    # Verifica se a viagem existe
    viagem = Viagem.query.get(data['codViagem'])
    if not viagem:
        return jsonify({'message': 'Viagem não encontrada'}), 404

    try:
        # Criando a hospedagem (sem definir `CodHospedagem`)
        nova_hospedagem = Hospedagem(
            nome=data['nome'],
            endereco=data['endereco'],
            diaria=data['diaria'],
            dataCheckin=datetime.strptime(data['dataEntrada'], '%Y-%m-%d'),
            dataCheckout=datetime.strptime(data['dataSaida'], '%Y-%m-%d'),
            CodDestino=data['codDestino']
        )

        db.session.add(nova_hospedagem)
        db.session.flush()  # 🔹 Garante que o ID foi gerado corretamente antes do commit
        print(f"✅ Hospedagem criada com ID: {nova_hospedagem.CodHospedagem}")

        # Criando a relação na tabela RelViagemHospedagem
        relacao = RelViagemHospedagem(
            codViagem=data['codViagem'],
            CodHospedagem=nova_hospedagem.CodHospedagem
        )
        db.session.add(relacao)

        db.session.commit()

        return jsonify({'message': 'Hospedagem criada e associada à viagem com sucesso!', 'id': nova_hospedagem.CodHospedagem}), 201

    except IntegrityError as e:
        db.session.rollback()
        return jsonify({'message': 'Erro de integridade: possível duplicação de chave primária.', 'error': str(e)}), 500

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao criar hospedagem: {str(e)}'}), 500


# 📌 Rota para atualizar uma hospedagem
@routes.route('/api/hospedagens/<int:hospedagem_id>', methods=['PUT'])
def update_hospedagem(hospedagem_id):
    data = request.json
    hospedagem = Hospedagem.query.get(hospedagem_id)

    if not hospedagem:
        return jsonify({'message': 'Hospedagem não encontrada'}), 404

    try:
        hospedagem.nome = data.get('nome', hospedagem.nome)
        hospedagem.endereco = data.get('endereco', hospedagem.endereco)
        hospedagem.diaria = data.get('diaria', hospedagem.diaria)

        if 'dataCheckin' in data and data['dataCheckin']:
            hospedagem.dataCheckin = datetime.strptime(data['dataCheckin'], '%Y-%m-%d')

        if 'dataCheckout' in data and data['dataCheckout']:
            hospedagem.dataCheckout = datetime.strptime(data['dataCheckout'], '%Y-%m-%d')

        db.session.commit()
        return jsonify({'message': 'Hospedagem atualizada com sucesso!'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao atualizar hospedagem: {str(e)}'}), 500

# 📌 Rota para deletar uma hospedagem
@routes.route('/api/hospedagens/<int:hospedagem_id>', methods=['DELETE'])
def delete_hospedagem(hospedagem_id):
    hospedagem = Hospedagem.query.get(hospedagem_id)

    if not hospedagem:
        return jsonify({'message': 'Hospedagem não encontrada'}), 404

    try:
        db.session.delete(hospedagem)
        db.session.commit()
        return jsonify({'message': 'Hospedagem deletada com sucesso!'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao deletar hospedagem: {str(e)}'}), 500
    
@routes.route("/api/hospedagens/reservas", methods=["GET"])
@jwt_required()
def get_reservas_hospedagem():
    user_id = get_jwt_identity()  # Obtém o ID do usuário logado

    try:
        # Buscar o nome do usuário pelo ID
        user_name_query = db.session.execute(
            text('SELECT nome FROM conta WHERE "codConta" = :user_id'),
            {"user_id": user_id}
        ).fetchone()

        if not user_name_query or user_name_query[0] is None:
            return jsonify({"message": "Usuário não encontrado"}), 404

        user_name = user_name_query[0].strip()  # Garante que não há espaços extras

        # Log de depuração para verificar o nome
        print(f"🔍 Buscando reservas para o usuário: '{user_name}'")

        # Tenta buscar as reservas com `ILIKE` para evitar erros de case-sensitive
        result = db.session.execute(
            text("SELECT * FROM view_reservas_hospedagem WHERE usuario ILIKE :user_name"),
            {"user_name": user_name}
        ).fetchall()

        if not result:
            print(f"⚠️ Nenhuma reserva encontrada para '{user_name}'")
            return jsonify({"message": "Nenhuma reserva encontrada"}), 200  # Retorna 200 com lista vazia

        reservas = [
            {
                "CodHospedagem": row[0],
                "nome_hospedagem": row[1],
                "preco_diaria": row[2],
                "checkin": row[3],
                "checkout": row[4],
                "nomeDestino": row[5],
                "nomeViagem": row[6],
                "usuario": row[7],
            }
            for row in result
        ]

        return jsonify(reservas if reservas else [])

    except Exception as e:
        return jsonify({"message": "Erro ao buscar reservas de hospedagem", "error": str(e)}), 500
