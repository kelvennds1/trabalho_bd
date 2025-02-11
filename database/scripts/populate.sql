INSERT INTO "destino" ("CodDestino", "nomeDestino", "idiomaLocal") VALUES
(1, 'Rio de Janeiro', 'Português'),
(2, 'São Paulo', 'Português'),
(3, 'Buenos Aires', 'Espanhol'),
(4, 'Nova York', 'Inglês'),
(5, 'Paris', 'Francês');

INSERT INTO "conta" ("codConta", "nome", "email", "senha") VALUES
(1, 'Alice Silva', 'alice@example.com', 'senha123'),
(2, 'Carlos Mendes', 'carlos@example.com', 'senha123'),
(3, 'Fernanda Costa', 'fernanda@example.com', 'senha123'),
(4, 'João Pereira', 'joao@example.com', 'senha123'),
(5, 'Mariana Souza', 'mariana@example.com', 'senha123');

INSERT INTO "viagem" ("codViagem", "nomeViagem", "tipoViagem", "quantParticipantes", "dataInicio", "dataTermino", "descrição") VALUES
(1, 'Carnaval no Rio', 'Lazer', 4, '2024-02-10', '2024-02-15', 'Uma viagem inesquecível pelo carnaval do Rio'),
(2, 'Trabalho em São Paulo', 'Negócios', 2, '2024-05-01', '2024-05-05', 'Viagem de negócios para eventos corporativos'),
(3, 'Turismo na Argentina', 'Cultura', 3, '2024-07-10', '2024-07-20', 'Explorando a cultura de Buenos Aires'),
(4, 'Férias em Nova York', 'Aventura', 5, '2024-09-01', '2024-09-10', 'Visitando Times Square e a Estátua da Liberdade'),
(5, 'Lua de Mel em Paris', 'Romance', 2, '2024-11-10', '2024-11-20', 'Passeio romântico pela cidade do amor'),
(6, 'Praias do Rio', 'Lazer', 4, '2024-12-01', '2024-12-07', 'Explorando as praias do Rio de Janeiro'),
(7, 'Turismo no Rio', 'Cultura', 3, '2024-06-15', '2024-06-22', 'Conhecendo a história do Rio');

INSERT INTO "rel_viagem_destino" ("codViagem", "CodDestino") VALUES
(1, 1), -- Carnaval no Rio
(2, 2), -- Trabalho em São Paulo
(3, 3), -- Turismo na Argentina
(4, 4), -- Férias em Nova York
(5, 5), -- Lua de Mel em Paris
(6, 1), -- Praias do Rio
(7, 1); -- Turismo no Rio

INSERT INTO "hospedagem" ("CodHospedagem", "nome", "endereco", "diaria", "CodDestino", "dataCheckin", "dataCheckout") VALUES
(1, 'Hotel Copacabana', 'Av. Atlântica, Rio de Janeiro', 450.00, 1, '2024-02-10', '2024-02-15'),
(2, 'Hotel Paulista', 'Av. Paulista, São Paulo', 300.00, 2, '2024-05-01', '2024-05-05'),
(3, 'Buenos Aires Palace', 'Centro, Buenos Aires', 380.00, 3, '2024-07-10', '2024-07-20'),
(4, 'NY Grand Hotel', '5th Avenue, Nova York', 600.00, 4, '2024-09-01', '2024-09-10'),
(5, 'Hotel Paris View', 'Champs-Élysées, Paris', 700.00, 5, '2024-11-10', '2024-11-20');

INSERT INTO "rel_viagem_conta" ("codConta", "codViagem") VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(1, 6),
(2, 7);

INSERT INTO "pagamento" ("CodPagamento", "metodo", "data", "statusPagamento", "valor", "codViagem") VALUES
(1, 'Cartão de Crédito', '2024-02-05', 'Pago', 1800.00, 1),
(2, 'Pix', '2024-04-28', 'Pago', 1200.00, 2),
(3, 'Boleto', '2024-07-05', 'Pendente', 1500.00, 3),
(4, 'Cartão de Crédito', '2024-08-25', 'Pago', 2500.00, 4),
(5, 'Cartão de Débito', '2024-10-30', 'Pago', 3500.00, 5);

INSERT INTO "transporte" ("codTrasporte", "tipo", "custo", "horarioPartida", "companhiaTrasporte") VALUES
(1, 'Avião', 1000.00, '2024-02-09 06:00:00', 'LATAM'),
(2, 'Ônibus', 200.00, '2024-05-01 08:00:00', 'Cometa'),
(3, 'Avião', 1500.00, '2024-07-09 10:00:00', 'Aerolíneas Argentinas'),
(4, 'Táxi', 50.00, '2024-09-01 15:00:00', 'Yellow Cab'),
(5, 'Trem', 800.00, '2024-11-10 09:00:00', 'Eurostar');

INSERT INTO "rel_viagem_transporte" ("codTrasporte", "codViagem") VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);
