\c gestao_viagem_turismo;

-- Inserindo contas
INSERT INTO Conta (Senha, NomeUsuario, Email, DataCriacao, CodigoTipoConta) VALUES
    ('senha123', 'joaosilva', 'joao.silva@email.com', '2025-01-07', 1),
    ('senha456', 'marianarodrigues', 'maria.rod@email.com', '2025-01-07', 1),
    ('senha789', 'pedroalmeida', 'pedro.almeida@email.com', '2025-01-07', 1),
    ('senha101', 'anacosta', 'ana.costa@email.com', '2025-01-07', 1),
    ('senha202', 'lucasoliveira', 'lucas.oliveira@email.com', '2025-01-07', 1),
    ('senha303', 'Yuki Sato', 'yuki@email.com', '2025-01-07', 2),
    ('senha404', 'Jean Dupont', 'jean.dupont@email.com', '2025-01-07', 2),
    ('senha505', 'Carlos Silva', 'guia.silva@email.com', '2025-01-07', 2),
    ('senha606', 'Isabella Martínez', 'isa.m@email.com', '2025-01-07', 2),
    ('senha707', 'Pierre Dubois', 'pierre@email.com', '2025-01-07', 2);

-- Inserindo clientes
INSERT INTO Cliente (Nome, Email, Telefone, DataNascimento, CodigoConta) VALUES
    ('João Silva', 'joao.silva@email.com', '11987654321', '1990-04-15', 1),
    ('Maria Rodrigues', 'maria.rod@email.com', '11987654322', '1985-07-20', 2),
    ('Pedro Almeida', 'pedro.almeida@email.com', '11987654323', '1992-10-30', 3),
    ('Ana Costa', 'ana.costa@email.com', '11987654324', '1988-03-25', 4),
    ('Lucas Oliveira', 'lucas.oliveira@email.com', '11987654325', '1995-06-18', 5);

-- Inserindo viagens
INSERT INTO Viagem (NomeViagem, Avaliacao, TipoViagem, QuantidadeParticipantes, CodigoConta) VALUES
    ('Viagem ao Japão', 4.8, 'Cultural', 10, 1),
    ('Tour pela Europa', 4.7, 'Aventura', 12, 2),
    ('Viagem para a Amazônia', 4.9, 'Ecológica', 8, 3),
    ('Férias no Caribe', 4.5, 'Praia', 15, 4),
    ('Roteiro por Paris', 5.0, 'Romântica', 6, 5);

-- Inserindo destinos
INSERT INTO Destino (NomeDestino, DataInicio, DataTermino, IdiomaLocal, CodigoViagem) VALUES
    ('Tóquio', '2025-03-01', '2025-03-10', 'Japonês', 1),
    ('Paris', '2025-04-01', '2025-04-07', 'Francês', 2),
    ('Manaus', '2025-05-10', '2025-05-17', 'Português', 3),
    ('Punta Cana', '2025-06-15', '2025-06-25', 'Espanhol', 4),
    ('Nice', '2025-07-05', '2025-07-12', 'Francês', 5);

-- Inserindo atividades
INSERT INTO Atividade (NomeAtividade, Data, Horario, RequisitosEspeciais, CodigoDestino) VALUES
    ('Visita ao Monte Fuji', '2025-03-02', '09:00', 'Necessário calçado confortável', 1),
    ('Passeio de barco pelo Sena', '2025-04-02', '14:00', 'Nenhum', 2),
    ('Caminhada pela selva amazônica', '2025-05-12', '08:00', 'Uso de repelente', 3),
    ('Snorkeling em Punta Cana', '2025-06-17', '10:00', 'Equipamento fornecido', 4),
    ('Tour pelas vinícolas de Nice', '2025-07-06', '13:00', 'Maior de 18 anos', 5);

-- Inserindo hospedagens
INSERT INTO Hospedagem (Nome, Diaria, Avaliacao, Localizacao, CodigoDestino) VALUES
    ('Hotel Imperial', 500.00, 4.8, 'Shinjuku, Tóquio', 1),
    ('Le Meurice', 800.00, 4.7, '1er Arrondissement, Paris', 2),
    ('Amazon Jungle Lodge', 400.00, 4.9, 'Manaus, Amazonas', 3),
    ('Punta Cana Resort', 600.00, 4.5, 'Punta Cana, República Dominicana', 4),
    ('Hotel Negresco', 700.00, 5.0, 'Nice, França', 5);

-- Inserindo transportes
INSERT INTO Transporte (Tipo, Custo, HorarioPartida, CompanhiaTransporte, CodigoDestino) VALUES
    ('Avião', 1500.00, '22:00', 'ANA Airlines', 1),
    ('Trem', 100.00, '08:00', 'SNCF', 2),
    ('Barco', 250.00, '06:00', 'Amazonas Navigation', 3),
    ('Avião', 1200.00, '23:00', 'JetBlue', 4),
    ('Avião', 1100.00, '18:00', 'Air France', 5);

-- Inserindo guias turísticos
INSERT INTO GuiaTuristico (Nome, Idioma, Avaliacao, Especialidade, CodigoDestino, CodigoConta) VALUES
    ('Yuki Sato', 'Japonês', 4.9, 'Cultura Japonesa', 1, 6),
    ('Jean Dupont', 'Francês', 4.8, 'Arte e História', 2, 7),
    ('Carlos Silva', 'Português', 5.0, 'Ecoturismo', 3, 8),
    ('Isabella Martínez', 'Espanhol', 4.7, 'História Colonial', 4, 9),
    ('Pierre Dubois', 'Francês', 5.0, 'Gastronomia e Vinhos', 5, 10);

-- Inserindo pacotes turísticos
INSERT INTO PacoteTuristico (Nome, Preco, Duracao, DestinosIncluidos, CodigoViagem) VALUES
    ('Pacote Japão Completo', 5000.00, 10, 'Tóquio, Kyoto, Osaka', 1),
    ('Roteiro Histórico Europeu', 6000.00, 12, 'Paris, Londres, Roma', 2),
    ('Aventura na Amazônia', 4000.00, 8, 'Manaus, Alter do Chão', 3),
    ('Férias no Caribe Exótico', 5500.00, 10, 'Punta Cana, Havana', 4),
    ('Tour Romântico por Paris', 7000.00, 7, 'Paris, Montmartre, Champs-Élysées', 5);

-- Inserindo pagamentos
INSERT INTO Pagamento (Valor, Metodo, Data, StatusPagamento, CodigoCliente, CodigoViagem) VALUES
    (5000.00, 'Cartão de Crédito', '2025-01-08', 'Aprovado', 1, 1),
    (6000.00, 'Boleto Bancário', '2025-01-08', 'Aprovado', 2, 2),
    (4000.00, 'Cartão de Crédito', '2025-01-08', 'Aprovado', 3, 3),
    (5500.00, 'Cartão de Crédito', '2025-01-08', 'Aprovado', 4, 4),
    (7000.00, 'Boleto Bancário', '2025-01-08', 'Aprovado', 5, 5);
