from datetime import datetime
from sqlalchemy.orm import sessionmaker
from src.models import db, Conta, Destino, Viagem, RelViagemConta, RelViagemDestino, Hospedagem, Pagamento, Atividade, Transporte, GuiaTuristico, PacoteTuristico, RelViagemAtividade, RelViagemTransporte, RelViagemPacoteTuristico
# Criando a sessão


# Criando contas
def criar():
    contas = [
        Conta(nome='Alice Silva', email='alice@email.com', senha='senha123'),
        Conta(nome='Bruno Rocha', email='bruno@email.com', senha='senha123'),
        Conta(nome='Carla Mendes', email='carla@email.com', senha='senha123'),
        Conta(nome='Daniel Souza', email='daniel@email.com', senha='senha123'),
        Conta(nome='Eduarda Lima', email='eduarda@email.com', senha='senha123')
    ]
    db.session.add_all(contas)
    db.session.commit()

    # Criando destinos
    destinos = [
        Destino(nomeDestino='Paris', idiomaLocal='Francês'),
        Destino(nomeDestino='Nova York', idiomaLocal='Inglês'),
        Destino(nomeDestino='Tóquio', idiomaLocal='Japonês'),
        Destino(nomeDestino='Rio de Janeiro', idiomaLocal='Português'),
        Destino(nomeDestino='Londres', idiomaLocal='Inglês')
    ]
    db.session.add_all(destinos)
    db.session.commit()

    # Criando viagens
    viagens = [
        Viagem(nomeViagem='Viagem Romântica a Paris', tipoViagem='Romântica', quantParticipantes=2, dataInicio=datetime(2024, 6, 10), dataTermino=datetime(2024, 6, 20)),
        Viagem(nomeViagem='Aventura em Nova York', tipoViagem='Aventura', quantParticipantes=4, dataInicio=datetime(2024, 7, 5), dataTermino=datetime(2024, 7, 15)),
        Viagem(nomeViagem='Descobrindo Tóquio', tipoViagem='Cultural', quantParticipantes=3, dataInicio=datetime(2024, 8, 1), dataTermino=datetime(2024, 8, 10)),
        Viagem(nomeViagem='Praias do Rio de Janeiro', tipoViagem='Praia', quantParticipantes=5, dataInicio=datetime(2024, 9, 12), dataTermino=datetime(2024, 9, 20)),
        Viagem(nomeViagem='Turismo Histórico em Londres', tipoViagem='Histórico', quantParticipantes=3, dataInicio=datetime(2024, 10, 5), dataTermino=datetime(2024, 10, 15))
    ]
    db.session.add_all(viagens)
    db.session.commit()

    # Relacionando viagens com contas
    for i in range(5):
        db.session.add(RelViagemConta(codConta=contas[i].codConta, codViagem=viagens[i].codViagem))
    db.session.commit()

    # Relacionando viagens com destinos
    for i in range(5):
        db.session.add(RelViagemDestino(codViagem=viagens[i].codViagem, CodDestino=destinos[i].CodDestino))
    db.session.commit()

    print("Banco de dados populado com sucesso!")
