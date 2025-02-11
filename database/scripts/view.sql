CREATE OR REPLACE VIEW view_reservas_hospedagem AS
SELECT 
    h."CodHospedagem",
    h.nome AS nome_hospedagem,
    h.localizacao AS endereco,
    h.diaria AS preco_diaria,
    h.dataEntrada AS checkin,
    h.dataSaida AS checkout,
    d."nomeDestino",
    v."nomeViagem",
    c."nome" AS usuario
FROM hospedagem h
JOIN destino d ON h."CodDestino" = d."CodDestino"
JOIN rel_viagem_hospedagem rvh ON h."CodHospedagem" = rvh."CodHospedagem"
JOIN viagem v ON rvh."codViagem" = v."codViagem"
JOIN rel_viagem_conta rvc ON v."codViagem" = rvc."codViagem"
JOIN conta c ON rvc."codConta" = c."codConta";
