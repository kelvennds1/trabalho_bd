### 1. **Consulta 1: Mostrar o nome da viagem, nome do cliente e o pagamento de cada viagem.**

A consulta vai buscar as viagens, seus respectivos clientes e os pagamentos efetuados. Para isso, vamos usar as tabelas `Viagem`, `Conta`, `Pagamento` e `Cliente`.

**Álgebra Relacional:**

```plaintext
π NomeViagem, NomeCliente, Valor (σ Viagem.CodigoViagem = Pagamento.CodigoViagem ∧ Cliente.CodigoConta = Conta.CodigoConta (Viagem ⨝ Pagamento ⨝ Conta ⨝ Cliente))
```

- **Explicação**: Esta consulta faz uma junção das tabelas `Viagem`, `Pagamento`, `Conta` e `Cliente`, usando os relacionamentos entre elas e filtra as colunas que queremos mostrar, como o nome da viagem, nome do cliente e o valor do pagamento.

### 2. **Consulta 2: Listar as atividades realizadas em destinos com mais de 10 participantes.**

Aqui, a consulta deve retornar atividades associadas a destinos onde o número de participantes na viagem for superior a 10.

**Álgebra Relacional:**

```plaintext
π NomeAtividade, NomeDestino (σ QuantidadeParticipantes > 10 (Atividade ⨝ Destino ⨝ Viagem))
```

- **Explicação**: A consulta junta as tabelas `Atividade`, `Destino` e `Viagem`, e filtra as viagens com mais de 10 participantes, retornando as atividades e os destinos correspondentes.

### 3. **Consulta 3: Exibir os guias turísticos, o destino e as atividades que possuem requisitos especiais.**

Aqui, queremos listar guias turísticos, o destino e atividades que possuem requisitos especiais (informações adicionais sobre cada atividade).

**Álgebra Relacional:**

```plaintext
π Nome, NomeDestino, NomeAtividade (σ RequisitosEspeciais IS NOT NULL (GuiaTuristico ⨝ Destino ⨝ Atividade))
```

- **Explicação**: A consulta une as tabelas `GuiaTuristico`, `Destino` e `Atividade`, filtrando as atividades que possuem requisitos especiais, e retorna o nome do guia, destino e atividade.

### 4. **Consulta 4: Mostrar o nome da viagem, o nome do pacote turístico e o preço do pacote.**

A consulta deve retornar as informações de viagens e seus pacotes turísticos, juntamente com o preço do pacote.

**Álgebra Relacional:**

```plaintext
π NomeViagem, Nome, Preco (Viagem ⨝ PacoteTuristico)
```

- **Explicação**: A consulta realiza uma junção simples entre as tabelas `Viagem` e `PacoteTuristico`, exibindo o nome da viagem, o nome do pacote e o preço.

### 5. **Consulta 5: Exibir todos os destinos que possuem transporte com custo superior a 100.**

A consulta vai mostrar destinos que têm transporte com custo superior a 100.

**Álgebra Relacional:**

```plaintext
π NomeDestino (σ Custo > 100 (Destino ⨝ Transporte))
```

- **Explicação**: A consulta junta as tabelas `Destino` e `Transporte` e filtra os destinos onde o custo do transporte é superior a 100.

---
