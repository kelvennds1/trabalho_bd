SELECT 
    Viagem.NomeViagem,
    PacoteTuristico.Nome,
    PacoteTuristico.Preco
FROM 
    Viagem
JOIN 
    PacoteTuristico ON Viagem.CodigoViagem = PacoteTuristico.CodigoViagem;
