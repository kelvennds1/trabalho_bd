"use client";

import { useState } from "react";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Paper,
  Box,
  useTheme,
  Snackbar,
} from "@mui/material";
import {
  TrendingUp,
  LocationOn,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
} from "@mui/icons-material";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const PopularDestinations = () => {
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const theme = useTheme();

  const fetchPopularDestinations = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.get(`/destinos/populares`);
      setDestinos(response.data);
      setSuccess("Destinos populares carregados com sucesso!");
    } catch (error) {
      console.error("Erro ao buscar destinos populares:", error);
      setError("Falha ao buscar destinos mais visitados.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess("");
  };

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 4,
          borderRadius: theme.shape.borderRadius,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(18, 18, 18, 0.6)"
              : "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(10px)",
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          fontWeight="bold"
          sx={{
            mb: 4,
            textAlign: "center",
            fontSize: { xs: "2.5rem", md: "3.75rem" },
            fontFamily:
              "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
          }}
        >
          Destinos Mais Visitados
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchPopularDestinations}
            startIcon={<TrendingUp />}
            disabled={loading}
            sx={{
              borderRadius: "50px",
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              textTransform: "none",
              fontFamily:
                "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
            }}
          >
            {loading ? "Carregando..." : "Mostrar Destinos Populares"}
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <List>
                {destinos.map((destino, index) => (
                  <motion.div
                    key={destino.CodDestino}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ListItem
                      sx={{
                        mb: 2,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(18, 18, 18, 0.8)"
                            : "rgba(255, 255, 255, 0.8)",
                        borderRadius: 2,
                        boxShadow: theme.shadows[1],
                        transition:
                          "background-color 0.3s ease-in-out, transform 0.3s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: theme.shadows[3],
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily:
                                "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
                            }}
                          >
                            <LocationOn
                              color="primary"
                              sx={{ mr: 1, verticalAlign: "middle" }}
                            />
                            {destino.nomeDestino}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontFamily:
                                "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
                            }}
                          >
                            Total de viagens: {destino.total_viagens}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </motion.div>
          </AnimatePresence>
        )}
      </Paper>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Paper
          elevation={3}
          sx={{
            padding: "6px 16px",
            backgroundColor: error
              ? theme.palette.error.main
              : theme.palette.success.main,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            borderRadius: "4px",
          }}
        >
          {error ? (
            <ErrorIcon sx={{ mr: 1 }} />
          ) : (
            <SuccessIcon sx={{ mr: 1 }} />
          )}
          <Typography variant="body2">{error || success}</Typography>
        </Paper>
      </Snackbar>
    </Container>
  );
};

export default PopularDestinations;
