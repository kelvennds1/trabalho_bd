SELECT 
    Destino.NomeDestino
FROM 
    Destino
JOIN 
    Transporte ON Destino.CodigoDestino = Transporte.CodigoDestino
WHERE 
    Transporte.Custo > 100;
