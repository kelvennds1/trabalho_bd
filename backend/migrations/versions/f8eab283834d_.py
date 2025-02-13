"""empty message

Revision ID: f8eab283834d
Revises: 
Create Date: 2025-02-11 19:11:11.822424

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f8eab283834d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('atividade',
    sa.Column('codAtividade', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('nomeAtividade', sa.String(length=255), nullable=False),
    sa.Column('data', sa.Date(), nullable=False),
    sa.Column('horario', sa.DateTime(), nullable=True),
    sa.Column('requisitosEspeciais', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('codAtividade')
    )
    op.create_table('conta',
    sa.Column('codConta', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('nome', sa.String(length=255), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('senha', sa.String(length=255), nullable=False),
    sa.Column('foto', sa.LargeBinary(), nullable=True),
    sa.PrimaryKeyConstraint('codConta'),
    sa.UniqueConstraint('email')
    )
    op.create_table('destino',
    sa.Column('CodDestino', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('nomeDestino', sa.String(length=255), nullable=False),
    sa.Column('idiomaLocal', sa.String(length=255), nullable=False),
    sa.Column('foto', sa.LargeBinary(), nullable=True),
    sa.PrimaryKeyConstraint('CodDestino'),
    sa.UniqueConstraint('nomeDestino')
    )
    op.create_table('guia_turistico',
    sa.Column('codTuristico', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('especialidade', sa.String(length=255), nullable=True),
    sa.Column('nome', sa.String(length=255), nullable=False),
    sa.Column('idioma', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('codTuristico')
    )
    op.create_table('pacote_turistico',
    sa.Column('CodTuristico', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('preco', sa.DECIMAL(precision=10, scale=2), nullable=True),
    sa.Column('duracao', sa.Integer(), nullable=True),
    sa.Column('nome', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('CodTuristico')
    )
    op.create_table('transporte',
    sa.Column('codTrasporte', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('tipo', sa.String(length=255), nullable=False),
    sa.Column('custo', sa.DECIMAL(precision=10, scale=2), nullable=True),
    sa.Column('horarioPartida', sa.DateTime(), nullable=True),
    sa.Column('companhiaTrasporte', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('codTrasporte')
    )
    op.create_table('viagem',
    sa.Column('codViagem', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('nomeViagem', sa.String(length=255), nullable=False),
    sa.Column('tipoViagem', sa.String(length=255), nullable=False),
    sa.Column('quantParticipantes', sa.Integer(), nullable=True),
    sa.Column('dataInicio', sa.Date(), nullable=False),
    sa.Column('dataTermino', sa.Date(), nullable=False),
    sa.Column('descrição', sa.String(length=255), nullable=True),
    sa.Column('foto', sa.LargeBinary(), nullable=True),
    sa.PrimaryKeyConstraint('codViagem')
    )
    op.create_table('hospedagem',
    sa.Column('CodHospedagem', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('nome', sa.String(length=255), nullable=True),
    sa.Column('endereco', sa.String(length=255), nullable=False),
    sa.Column('diaria', sa.DECIMAL(precision=10, scale=2), nullable=False),
    sa.Column('CodDestino', sa.Integer(), nullable=False),
    sa.Column('dataCheckin', sa.Date(), nullable=False),
    sa.Column('dataCheckout', sa.Date(), nullable=False),
    sa.ForeignKeyConstraint(['CodDestino'], ['destino.CodDestino'], ),
    sa.PrimaryKeyConstraint('CodHospedagem')
    )
    op.create_table('pagamento',
    sa.Column('CodPagamento', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('metodo', sa.String(length=255), nullable=True),
    sa.Column('data', sa.Date(), nullable=True),
    sa.Column('statusPagamento', sa.String(length=255), nullable=True),
    sa.Column('valor', sa.DECIMAL(precision=10, scale=2), nullable=True),
    sa.Column('codViagem', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['codViagem'], ['viagem.codViagem'], ),
    sa.PrimaryKeyConstraint('CodPagamento')
    )
    op.create_table('ponto_turistico',
    sa.Column('CodPontTu', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('tipo', sa.String(length=255), nullable=False),
    sa.Column('descricao', sa.String(length=255), nullable=False),
    sa.Column('nome', sa.String(length=255), nullable=False),
    sa.Column('CodDestino', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['CodDestino'], ['destino.CodDestino'], ),
    sa.PrimaryKeyConstraint('CodPontTu')
    )
    op.create_table('rel_guia_pacote',
    sa.Column('CodTuristico', sa.Integer(), nullable=False),
    sa.Column('codTuristico', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['CodTuristico'], ['pacote_turistico.CodTuristico'], ),
    sa.ForeignKeyConstraint(['codTuristico'], ['guia_turistico.codTuristico'], ),
    sa.PrimaryKeyConstraint('CodTuristico', 'codTuristico')
    )
    op.create_table('rel_viagem_atividade',
    sa.Column('codViagem', sa.Integer(), nullable=False),
    sa.Column('codAtividade', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['codAtividade'], ['atividade.codAtividade'], ),
    sa.ForeignKeyConstraint(['codViagem'], ['viagem.codViagem'], ),
    sa.PrimaryKeyConstraint('codViagem', 'codAtividade')
    )
    op.create_table('rel_viagem_conta',
    sa.Column('codConta', sa.Integer(), nullable=False),
    sa.Column('codViagem', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['codConta'], ['conta.codConta'], ),
    sa.ForeignKeyConstraint(['codViagem'], ['viagem.codViagem'], ),
    sa.PrimaryKeyConstraint('codConta', 'codViagem')
    )
    op.create_table('rel_viagem_destino',
    sa.Column('codViagem', sa.Integer(), nullable=False),
    sa.Column('CodDestino', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['CodDestino'], ['destino.CodDestino'], ),
    sa.ForeignKeyConstraint(['codViagem'], ['viagem.codViagem'], ),
    sa.PrimaryKeyConstraint('codViagem', 'CodDestino')
    )
    op.create_table('rel_viagem_pacote_turistico',
    sa.Column('CodTuristico', sa.Integer(), nullable=False),
    sa.Column('codViagem', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['CodTuristico'], ['pacote_turistico.CodTuristico'], ),
    sa.ForeignKeyConstraint(['codViagem'], ['viagem.codViagem'], ),
    sa.PrimaryKeyConstraint('CodTuristico', 'codViagem')
    )
    op.create_table('rel_viagem_transporte',
    sa.Column('codTrasporte', sa.Integer(), nullable=False),
    sa.Column('codViagem', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['codTrasporte'], ['transporte.codTrasporte'], ),
    sa.ForeignKeyConstraint(['codViagem'], ['viagem.codViagem'], ),
    sa.PrimaryKeyConstraint('codTrasporte', 'codViagem')
    )
    op.create_table('rel_viagem_hospedagem',
    sa.Column('codViagem', sa.Integer(), nullable=False),
    sa.Column('CodHospedagem', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['CodHospedagem'], ['hospedagem.CodHospedagem'], ),
    sa.ForeignKeyConstraint(['codViagem'], ['viagem.codViagem'], ),
    sa.PrimaryKeyConstraint('codViagem', 'CodHospedagem')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('rel_viagem_hospedagem')
    op.drop_table('rel_viagem_transporte')
    op.drop_table('rel_viagem_pacote_turistico')
    op.drop_table('rel_viagem_destino')
    op.drop_table('rel_viagem_conta')
    op.drop_table('rel_viagem_atividade')
    op.drop_table('rel_guia_pacote')
    op.drop_table('ponto_turistico')
    op.drop_table('pagamento')
    op.drop_table('hospedagem')
    op.drop_table('viagem')
    op.drop_table('transporte')
    op.drop_table('pacote_turistico')
    op.drop_table('guia_turistico')
    op.drop_table('destino')
    op.drop_table('conta')
    op.drop_table('atividade')
    # ### end Alembic commands ###
