\c gestao_viagem_turismo;

-- Tabela: TipoConta
CREATE TABLE TipoConta (
    CodigoTipoConta SERIAL PRIMARY KEY,
    Tipo VARCHAR(50) NOT NULL
);

-- Tabela: Conta
CREATE TABLE Conta (
    CodigoConta SERIAL PRIMARY KEY,
    Senha VARCHAR(255) NOT NULL,
    NomeUsuario VARCHAR(100) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    DataCriacao DATE NOT NULL,
    CodigoTipoConta INT NOT NULL,  
    CONSTRAINT fk_tipo_conta FOREIGN KEY (CodigoTipoConta) REFERENCES TipoConta(CodigoTipoConta)
);


-- Inserindo tipos de conta
INSERT INTO TipoConta (Tipo) VALUES ('Cliente'), ('Guia');

-- Tabela: Cliente
CREATE TABLE Cliente (
    CodigoCliente SERIAL PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Telefone VARCHAR(15),
    DataNascimento DATE NOT NULL,
    CodigoConta INT,
    FOREIGN KEY (CodigoConta) REFERENCES Conta(CodigoConta)
);

-- Tabela: Viagem
CREATE TABLE Viagem (
    CodigoViagem SERIAL PRIMARY KEY,
    NomeViagem VARCHAR(100) NOT NULL,
    Avaliacao DECIMAL(3, 2),
    TipoViagem VARCHAR(50),
    QuantidadeParticipantes INT,
    CodigoConta INT,
    FOREIGN KEY (CodigoConta) REFERENCES Conta(CodigoConta)
);

-- Tabela: Destino
CREATE TABLE Destino (
    CodigoDestino SERIAL PRIMARY KEY,
    NomeDestino VARCHAR(100) NOT NULL,
    DataInicio DATE NOT NULL,
    DataTermino DATE NOT NULL,
    IdiomaLocal VARCHAR(50),
    CodigoViagem INT,
    FOREIGN KEY (CodigoViagem) REFERENCES Viagem(CodigoViagem)
);

-- Tabela: Atividade
CREATE TABLE Atividade (
    CodigoAtividade SERIAL PRIMARY KEY,
    NomeAtividade VARCHAR(100) NOT NULL,
    Data DATE NOT NULL,
    Horario TIME NOT NULL,
    RequisitosEspeciais TEXT,
    CodigoDestino INT,
    FOREIGN KEY (CodigoDestino) REFERENCES Destino(CodigoDestino)
);

-- Tabela: Hospedagem
CREATE TABLE Hospedagem (
    CodigoHospedagem SERIAL PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Diaria DECIMAL(10, 2) NOT NULL,
    Avaliacao DECIMAL(3, 2),
    Localizacao VARCHAR(255) NOT NULL,
    CodigoDestino INT,
    FOREIGN KEY (CodigoDestino) REFERENCES Destino(CodigoDestino)
);

-- Tabela: Transporte
CREATE TABLE Transporte (
    CodigoTransporte SERIAL PRIMARY KEY,
    Tipo VARCHAR(50) NOT NULL,
    Custo DECIMAL(10, 2) NOT NULL,
    HorarioPartida TIME NOT NULL,
    CompanhiaTransporte VARCHAR(100),
    CodigoDestino INT,
    FOREIGN KEY (CodigoDestino) REFERENCES Destino(CodigoDestino)
);

-- Tabela: GuiaTuristico
CREATE TABLE GuiaTuristico (
    CodigoTuristico SERIAL PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Idioma VARCHAR(50),
    Avaliacao DECIMAL(3, 2),
    Especialidade VARCHAR(100),
    CodigoDestino INT,
    CodigoConta INT,
    FOREIGN KEY (CodigoDestino) REFERENCES Destino(CodigoDestino),
    FOREIGN KEY (CodigoConta) REFERENCES Conta(CodigoConta) -- Relacionamento com Conta
);

-- Tabela: PacoteTuristico
CREATE TABLE PacoteTuristico (
    CodigoPacote SERIAL PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Preco DECIMAL(10, 2) NOT NULL,
    Duracao INT NOT NULL,
    DestinosIncluidos TEXT,
    CodigoViagem INT,
    FOREIGN KEY (CodigoViagem) REFERENCES Viagem(CodigoViagem)
);

-- Tabela: Pagamento
CREATE TABLE Pagamento (
    CodigoPagamento SERIAL PRIMARY KEY,
    Valor DECIMAL(10, 2) NOT NULL,
    Metodo VARCHAR(50) NOT NULL,
    Data DATE NOT NULL,
    StatusPagamento VARCHAR(50),
    CodigoCliente INT,
    CodigoViagem INT,
    FOREIGN KEY (CodigoCliente) REFERENCES Cliente(CodigoCliente),
    FOREIGN KEY (CodigoViagem) REFERENCES Viagem(CodigoViagem)
);
