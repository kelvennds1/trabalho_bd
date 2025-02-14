CREATE OR REPLACE PROCEDURE destinos_mais_visitados(IN limite INT)
LANGUAGE plpgsql
AS $$
BEGIN
    DROP TABLE IF EXISTS temp_destinos_populares;

    CREATE TEMP TABLE temp_destinos_populares AS
    SELECT d."CodDestino", d."nomeDestino", COUNT(v."codViagem") AS total_viagens
    FROM destino d
    JOIN rel_viagem_destino rvd ON d."CodDestino" = rvd."CodDestino"
    JOIN viagem v ON rvd."codViagem" = v."codViagem"
    GROUP BY d."CodDestino", d."nomeDestino"
    ORDER BY total_viagens DESC
    LIMIT limite;
END;
$$;
