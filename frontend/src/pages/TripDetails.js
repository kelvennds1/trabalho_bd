"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  CardMedia,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Grid,
  useTheme,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flight,
  Group,
  CalendarToday,
  LocationOn,
  Payment,
  Info,
} from "@mui/icons-material";
import api from "../services/api";
import DestinoForm from "../components/DestinoForm";
import PaymentMethods from "../components/PaymentMethods";
import { motion, AnimatePresence } from "framer-motion";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(
    searchParams.get("edit") === "true"
  );
  const [openNewDestino, setOpenNewDestino] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchTripDetails();
    fetchDestinos();
  }, []);

  const fetchTripDetails = async () => {
    try {
      const response = await api.get(`/viagens/${id}`);
      setTrip({
        ...response.data,
        dataInicio: response.data.dataInicio
          ? new Date(response.data.dataInicio)
          : null,
        dataTermino: response.data.dataTermino
          ? new Date(response.data.dataTermino)
          : null,
        destinos: response.data.destinos || [],
      });
      try {
        const photoResponse = await api.get(`/viagens/${id}/foto`);
        setImageUrl(`data:image/jpeg;base64,${photoResponse.data.foto}`);
      } catch (error) {
        console.warn("Viagem não possui foto.");
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes da viagem:", error);
      setError("Falha ao carregar detalhes da viagem.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinos = async () => {
    try {
      const response = await api.get("/destinos");
      setDestinos(response.data);
    } catch (error) {
      console.error("Erro ao carregar destinos:", error);
      setError("Falha ao carregar destinos.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Garante que os destinos são enviados como uma lista de IDs
      const formattedDestinos = trip.destinos.map(
        (destino) => destino.id || destino
      );

      // Cria o payload formatado corretamente
      const payload = {
        nome: trip.nome,
        tipoViagem: trip.tipoViagem,
        quantParticipantes: trip.quantParticipantes,
        descricao: trip.descricao,
        dataInicio: trip.dataInicio
          ? trip.dataInicio.toISOString().split("T")[0]
          : null,
        dataTermino: trip.dataTermino
          ? trip.dataTermino.toISOString().split("T")[0]
          : null,
        destinos: formattedDestinos,
      };

      console.log("📢 Enviando dados para atualização:", payload);

      await api.put(`/viagens/${id}`, payload);

      setSuccess("Viagem atualizada com sucesso!");
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Erro ao atualizar viagem:", error);
      if (error.response) {
        console.error("🛑 Resposta da API:", error.response.data);
        setError(`Falha ao atualizar viagem: ${error.response.data.message}`);
      } else {
        setError("Erro ao atualizar viagem.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrip((prevTrip) => ({
      ...prevTrip,
      [name]: value,
    }));
  };

  const handleDateChange = (date, field) => {
    setTrip({ ...trip, [field]: date });
  };

  const handleDestinosChange = (event) => {
    setTrip({ ...trip, destinos: event.target.value });
  };

  const handleCreateDestino = async (newDestinoData) => {
    try {
      const response = await api.post("/destinos", newDestinoData);
      const novoDestino = response.data;
      setDestinos([...destinos, novoDestino]);
      setTrip({ ...trip, destinos: [...trip.destinos, novoDestino.id] });
    } catch (error) {
      setError("Erro ao criar destino.");
    }
  };

  const handleDeleteTrip = async () => {
    try {
      await api.delete(`/viagens/${id}`);
      setSuccess("Viagem excluída com sucesso!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Erro ao excluir viagem:", error);
      setError("Erro ao excluir a viagem. Tente novamente.");
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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

  if (!trip) {
    return <Typography>Viagem não encontrada.</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{ p: 4, mt: 4, borderRadius: theme.shape.borderRadius }}
      >
        <CardMedia
          component="img"
          height="350"
          image={imageUrl || "/placeholder-image.jpg"}
          alt={trip.nome}
          sx={{
            borderRadius: theme.shape.borderRadius,
            mb: 2,
            width: "100%",
            objectFit: "cover",
          }}
        />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            {isEditing ? "Editar Viagem" : trip.nome}
          </Typography>
          {!isEditing && (
            <Box>
              <Button
                startIcon={<EditIcon />}
                onClick={handleEdit}
                variant="outlined"
                sx={{ mr: 1 }}
              >
                Editar
              </Button>
              <Button
                startIcon={<DeleteIcon />}
                onClick={() => setOpenDeleteDialog(true)}
                variant="outlined"
                color="error"
              >
                Excluir
              </Button>
            </Box>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab icon={<Info />} label="Informações" />
          <Tab icon={<Payment />} label="Pagamentos" />
        </Tabs>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 0 && (
              <Box component="form">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nome da Viagem"
                      name="nome"
                      value={trip.nome || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      InputProps={{
                        readOnly: !isEditing,
                        startAdornment: (
                          <Flight color="action" sx={{ mr: 1 }} />
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tipo de Viagem"
                      name="tipoViagem"
                      value={trip.tipo}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Número de Participantes"
                      name="quantParticipantes"
                      value={trip.quantParticipantes}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      InputProps={{
                        inputProps: { min: 1 },
                        readOnly: !isEditing,
                        startAdornment: <Group color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Data de Início"
                        value={trip.dataInicio}
                        onChange={(newValue) =>
                          handleDateChange(newValue, "dataInicio")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            disabled={!isEditing}
                            InputProps={{
                              ...params.InputProps,
                              readOnly: !isEditing,
                              startAdornment: (
                                <CalendarToday color="action" sx={{ mr: 1 }} />
                              ),
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Data de Término"
                        value={trip.dataTermino}
                        onChange={(newValue) =>
                          handleDateChange(newValue, "dataTermino")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            disabled={!isEditing}
                            InputProps={{
                              ...params.InputProps,
                              readOnly: !isEditing,
                              startAdornment: (
                                <CalendarToday color="action" sx={{ mr: 1 }} />
                              ),
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Destinos</InputLabel>
                        <Select
                          multiple
                          value={trip.destinos.map((d) => d.id) || []}
                          onChange={handleDestinosChange}
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((value) => {
                                const destinoEncontrado = destinos.find(
                                  (d) => d.id === value
                                );
                                return destinoEncontrado ? (
                                  <Chip
                                    key={value}
                                    label={destinoEncontrado.nome}
                                    icon={<LocationOn />}
                                  />
                                ) : null;
                              })}
                            </Box>
                          )}
                        >
                          {destinos.map((destino) => (
                            <MenuItem key={destino.id} value={destino.id}>
                              {destino.nome}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {isEditing && (
                        <IconButton
                          color="primary"
                          onClick={() => setOpenNewDestino(true)}
                        >
                          <AddIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Descrição"
                      name="descricao"
                      multiline
                      rows={4}
                      value={trip.descricao || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                    />
                  </Grid>
                </Grid>

                {isEditing ? (
                  <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                    <Button variant="contained" onClick={handleSave} fullWidth>
                      Salvar Alterações
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                      fullWidth
                    >
                      Cancelar
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/")}
                    fullWidth
                    sx={{ mt: 3 }}
                  >
                    Voltar para Viagens
                  </Button>
                )}
              </Box>
            )}

            {activeTab === 1 && (
              <Box sx={{ mt: 2 }}>
                <PaymentMethods tripId={id} />
              </Box>
            )}
          </motion.div>
        </AnimatePresence>
      </Paper>

      <DestinoForm
        open={openNewDestino}
        onClose={() => setOpenNewDestino(false)}
        onSubmit={handleCreateDestino}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar exclusão"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir esta viagem? Esta ação não pode ser
            desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDeleteTrip} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TripDetails;
