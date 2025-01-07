SELECT 
    Viagem.NomeViagem,
    Cliente.Nome AS NomeCliente,
    Pagamento.Valor
FROM 
    Viagem
JOIN 
    Pagamento ON Viagem.CodigoViagem = Pagamento.CodigoViagem
JOIN 
    Conta ON Pagamento.CodigoCliente = Conta.CodigoConta
JOIN 
    Cliente ON Conta.CodigoConta = Cliente.CodigoConta;
