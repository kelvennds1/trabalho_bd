"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  useTheme,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Add as AddIcon,
  Flight,
  TrendingUp,
  ArrowForward,
  Hotel,
  DateRange,
} from "@mui/icons-material";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchTrips();
    fetchReservations();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await api.get("/viagens");
      const tripsWithPhotos = await Promise.all(
        response.data.map(async (trip) => {
          try {
            const photoResponse = await api.get(`/viagens/${trip.id}/foto`);
            return {
              ...trip,
              imageUrl: `data:image/jpeg;base64,${photoResponse.data.foto}`,
            };
          } catch (error) {
            return { ...trip, imageUrl: null };
          }
        })
      );
      setTrips(tripsWithPhotos);
    } catch (error) {
      console.error("Erro ao buscar viagens:", error);
      setError(
        "Não foi possível carregar as viagens. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await api.get("/hospedagens/reservas");

      // ✅ Garante que sempre será um array
      const data = response.data || [];
      console.log("📢 Reservas recebidas:", data);

      if (!Array.isArray(data)) {
        throw new Error("Formato de resposta inesperado da API");
      }

      setReservations(data);
    } catch (error) {
      console.error("❌ Erro ao buscar reservas de hospedagem:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          fontWeight="bold"
          sx={{ fontSize: { xs: "2.5rem", md: "3.75rem" } }}
        >
          Suas Aventuras Começam Aqui
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Explore, planeje e crie memórias inesquecíveis
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate("/new-trip")}
            sx={{
              borderRadius: "50px",
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            Nova Viagem
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<TrendingUp />}
            onClick={() => navigate("/populardestinations")}
            sx={{
              borderRadius: "50px",
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              textTransform: "none",
            }}
          >
            Destinos Populares
          </Button>
        </Box>
      </Box>

      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        fontWeight="bold"
        sx={{ mb: 4, textAlign: "center" }}
      >
        Suas Viagens
      </Typography>

      <Grid container spacing={4}>
        {trips.map((trip, index) => (
          <Grid item xs={12} sm={6} md={4} key={trip.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={trip.imageUrl || "/placeholder-image.jpg"}
                  alt={trip.nomeViagem}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    fontWeight="bold"
                  >
                    {trip.nomeViagem}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Flight sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="body2" color="text.secondary">
                      {trip.tipoViagem}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {trip.destinos?.length > 0
                      ? `Destinos: ${trip.destinos
                          .map((d) => d.nome)
                          .join(", ")}`
                      : "Nenhum destino"}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                >
                  <Button
                    component={Link}
                    to={`/trip/${trip.id}`}
                    endIcon={<ArrowForward />}
                    sx={{
                      fontWeight: "bold",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    Ver Detalhes
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {trips.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Você ainda não tem viagens planejadas.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/new-trip")}
            sx={{ mt: 2 }}
          >
            Planejar Primeira Viagem
          </Button>
        </Box>
      )}

      {/* Nova seção: Relatório de Reservas de Hospedagens */}
      <Paper
        elevation={3}
        sx={{
          mt: 6,
          p: 4,
          borderRadius: theme.shape.borderRadius,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(18, 18, 18, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mb: 4, textAlign: "center" }}
        >
          Relatório de Reservas de Hospedagens
        </Typography>
        <List>
          <AnimatePresence>
            {reservations.map((reservation, index) => (
              <motion.div
                key={reservation.CodHospedagem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ListItem
                  sx={{
                    mb: 2,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    boxShadow: theme.shadows[1],
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        <Hotel
                          color="primary"
                          sx={{ mr: 1, verticalAlign: "middle" }}
                        />
                        {reservation.nome_hospedagem} -{" "}
                        {reservation.nomeDestino}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          <DateRange
                            sx={{
                              mr: 1,
                              verticalAlign: "middle",
                              fontSize: "small",
                            }}
                          />
                          Check-in:{" "}
                          {new Date(reservation.checkin).toLocaleDateString()} |
                          Check-out:{" "}
                          {new Date(reservation.checkout).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Endereço: {reservation.endereco}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Viagem: {reservation.nomeViagem}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < reservations.length - 1 && <Divider />}
              </motion.div>
            ))}
          </AnimatePresence>
        </List>
        {reservations.length === 0 && (
          <Typography variant="body1" align="center" color="text.secondary">
            Nenhuma reserva de hospedagem encontrada.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;
