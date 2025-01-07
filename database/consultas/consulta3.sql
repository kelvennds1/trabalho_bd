SELECT 
    GuiaTuristico.Nome AS NomeGuia,
    Destino.NomeDestino,
    Atividade.NomeAtividade
FROM 
    GuiaTuristico
JOIN 
    Destino ON GuiaTuristico.CodigoDestino = Destino.CodigoDestino
JOIN 
    Atividade ON Destino.CodigoDestino = Atividade.CodigoDestino
WHERE 
    Atividade.RequisitosEspeciais IS NOT NULL;
