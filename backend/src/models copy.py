from datetime import datetime
from sqlalchemy import Sequence, Table, Date, DateTime, Column, Integer, SmallInteger, String, DECIMAL, ForeignKey, Boolean, LargeBinary
from sqlalchemy.orm import relationship
from passlib.apps import custom_app_context as pwd_context
from .config import db  # Importando db do __init__.py

class Conta(db.Model):
    __tablename__ = 'conta'
    codConta = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    nome = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False)
    foto = db.Column(db.LargeBinary)
    viagens = db.relationship('Viagem', secondary='rel_viagem_conta', back_populates='usuarios')
    telefones = db.relationship('TelefoneConta', back_populates='conta')

    # Password Hashing
    def hash_password(self, senha_crua):
        self.senha = pwd_context.hash(senha_crua)

    def verify_password(self, senha_crua):
        return pwd_context.verify(senha_crua, self.senha)

class Destino(db.Model):
    __tablename__ = 'destino'
    CodDestino = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    nomeDestino = db.Column(db.String(255))
    idiomaLocal = db.Column(db.String(255))
    foto = db.Column(db.LargeBinary)
    viagens = db.relationship('Viagem', secondary='rel_viagem_destino', back_populates='destinos')
    hospedagens = db.relationship('Hospedagem', back_populates='destino')
    pontos_turisticos = db.relationship('PontoTuristico', back_populates='destino')

class Viagem(db.Model):
    __tablename__ = 'viagem'
    codViagem = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    nomeViagem = db.Column(db.String(255), nullable=False)
    tipoViagem = db.Column(db.String(255))
    quantParticipantes = db.Column(db.Integer)
    dataInicio = db.Column(db.Date)
    dataTermino = db.Column(db.Date)
    usuarios = db.relationship('Conta', secondary='rel_viagem_conta', back_populates='viagens')
    destinos = db.relationship('Destino', secondary='rel_viagem_destino', back_populates='viagens')
    pagamentos = db.relationship('Pagamento', back_populates='viagem')
    transportes = db.relationship('Transporte', secondary='rel_viagem_transporte', back_populates='viagens')
    atividades = db.relationship('Atividade', secondary='rel_viagem_atividade', back_populates='viagens')
    pacotes_turisticos = db.relationship('PacoteTuristico', secondary='rel_viagem_pacote_turistico', back_populates='viagens')

class Hospedagem(db.Model):
    __tablename__ = 'hospedagem'
    CodHospedagem = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    nome = db.Column(db.String(255))
    avaliacao = db.Column(db.Integer)
    localizacao = db.Column(db.String(255))
    diaria = db.Column(db.DECIMAL(10, 2))
    CodDestino = db.Column(db.Integer, db.ForeignKey('destino.CodDestino'))
    destino = db.relationship('Destino', back_populates='hospedagens')

class Pagamento(db.Model):
    __tablename__ = 'pagamento'
    CodPagamento = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    codViagem = db.Column(db.Integer, db.ForeignKey('viagem.codViagem'), nullable=False)
    pag_metodo = db.Column(db.String(255))
    pag_data = db.Column(db.Date)
    statusPagamento = db.Column(db.String(255))
    pag_valor = db.Column(db.DECIMAL(10, 2))
    viagem = db.relationship('Viagem', back_populates='pagamentos')

class Atividade(db.Model):
    __tablename__ = 'atividade'
    codAtividade = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    nomeAtividade = db.Column(db.String(255))
    data = db.Column(db.Date)
    horario = db.Column(db.DateTime)
    requisitosEspeciais = db.Column(db.String(255))
    foto = db.Column(db.LargeBinary)
    viagens = db.relationship('Viagem', secondary='rel_viagem_atividade', back_populates='atividades')

class Transporte(db.Model):
    __tablename__ = 'transporte'
    codTrasporte = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    tipo = db.Column(db.String(255))
    custo = db.Column(db.DECIMAL(10, 2))
    horarioPartida = db.Column(db.DateTime)
    companhiaTrasporte = db.Column(db.String(255))
    foto = db.Column(db.LargeBinary)
    viagens = db.relationship('Viagem', secondary='rel_viagem_transporte', back_populates='transportes')

class GuiaTuristico(db.Model):
    __tablename__ = 'guia_turistico'
    codTuristico = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    avaliacao = db.Column(db.Integer)
    especialidade = db.Column(db.String(255))
    nome = db.Column(db.String(255))
    idioma = db.Column(db.String(255))
    foto = db.Column(db.LargeBinary)
    pacotes_turisticos = db.relationship('PacoteTuristico', secondary='rel_guia_pacote', back_populates='guias')

class PacoteTuristico(db.Model):
    __tablename__ = 'pacote_turistico'
    CodTuristico = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    preco = db.Column(db.DECIMAL(10, 2))
    duracao = db.Column(db.Integer)
    destinoIncluidos = db.Column(db.String(255))
    nome = db.Column(db.String(255))
    foto = db.Column(db.LargeBinary)
    viagens = db.relationship('Viagem', secondary='rel_viagem_pacote_turistico', back_populates='pacotes_turisticos')
    guias = db.relationship('GuiaTuristico', secondary='rel_guia_pacote', back_populates='pacotes_turisticos')

class PontoTuristico(db.Model):
    __tablename__ = 'ponto_turistico'
    CodPontTu = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    avaliacao = db.Column(db.Integer)
    tipo = db.Column(db.String(255))
    descricao = db.Column(db.String(255))
    nome = db.Column(db.String(255))
    CodDestino = db.Column(db.Integer, db.ForeignKey('destino.CodDestino'))
    foto = db.Column(db.LargeBinary)
    destino = db.relationship('Destino', back_populates='pontos_turisticos')

class RelViagemTransporte(db.Model):
    __tablename__ = 'rel_viagem_transporte'
    codTrasporte = db.Column(db.Integer, db.ForeignKey('transporte.codTrasporte'), primary_key=True)
    codViagem = db.Column(db.Integer, db.ForeignKey('viagem.codViagem'), primary_key=True)

class RelViagemDestino(db.Model):
    __tablename__ = 'rel_viagem_destino'
    codViagem = db.Column(db.Integer, db.ForeignKey('viagem.codViagem'), primary_key=True)
    CodDestino = db.Column(db.Integer, db.ForeignKey('destino.CodDestino'), primary_key=True)

class RelViagemConta(db.Model):
    __tablename__ = 'rel_viagem_conta'
    codConta = db.Column(db.Integer, db.ForeignKey('conta.codConta'), primary_key=True)
    codViagem = db.Column(db.Integer, db.ForeignKey('viagem.codViagem'), primary_key=True)

class RelViagemAtividade(db.Model):
    __tablename__ = 'rel_viagem_atividade'
    codViagem = db.Column(db.Integer, db.ForeignKey('viagem.codViagem'), primary_key=True)
    codAtividade = db.Column(db.Integer, db.ForeignKey('atividade.codAtividade'), primary_key=True)

class RelViagemPacoteTuristico(db.Model):
    __tablename__ = 'rel_viagem_pacote_turistico'
    CodTuristico = db.Column(db.Integer, db.ForeignKey('pacote_turistico.CodTuristico'), primary_key=True)
    codViagem = db.Column(db.Integer, db.ForeignKey('viagem.codViagem'), primary_key=True)

class RelGuiaPacote(db.Model):
    __tablename__ = 'rel_guia_pacote'
    CodTuristico = db.Column(db.Integer, db.ForeignKey('pacote_turistico.CodTuristico'), primary_key=True)
    codTuristico = db.Column(db.Integer, db.ForeignKey('guia_turistico.codTuristico'), primary_key=True)

class TelefoneConta(db.Model):
    __tablename__ = 'telefone_conta'
    conta_cod = db.Column(db.Integer, db.ForeignKey('conta.codConta'), primary_key=True)
    telefone = db.Column(db.String(15), primary_key=True)
    conta = db.relationship('Conta', back_populates='telefones')