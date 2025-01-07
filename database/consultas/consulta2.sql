SELECT 
    Atividade.NomeAtividade,
    Destino.NomeDestino
FROM 
    Atividade
JOIN 
    Destino ON Atividade.CodigoDestino = Destino.CodigoDestino
JOIN 
    Viagem ON Destino.CodigoViagem = Viagem.CodigoViagem
WHERE 
    Viagem.QuantidadeParticipantes > 10;
