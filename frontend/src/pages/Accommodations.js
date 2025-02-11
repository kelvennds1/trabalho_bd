"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  Paper,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Hotel,
} from "@mui/icons-material";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const Accommodations = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [trips, setTrips] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [accommodationData, setAccommodationData] = useState({
    nome: "",
    endereco: "",
    diaria: 0.0,
    dataCheckin: "",
    dataCheckout: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const theme = useTheme();

  useEffect(() => {
    fetchAccommodations();
    fetchTrips();
  }, []);

  const fetchAccommodations = async () => {
    try {
      const response = await api.get("/hospedagens");
      setAccommodations(response.data);
    } catch (error) {
      console.error("Error fetching accommodations:", error);
      setError("Falha ao carregar hospedagens.");
    }
  };

  const fetchTrips = async () => {
    try {
      const response = await api.get("/viagens");
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setError("Falha ao carregar viagens.");
    }
  };

  const handleOpenDialog = (accommodation = null) => {
    if (accommodation) {
      setEditingId(accommodation.id);
      setAccommodationData({
        nome: accommodation.nome,
        endereco: accommodation.endereco,
        diaria: accommodation.diaria,
        dataCheckin: accommodation.dataCheckin,
        dataCheckout: accommodation.dataCheckout,
      });
      setSelectedTrip(accommodation.codViagem);
      setSelectedDestination(accommodation.codDestino);
    } else {
      setEditingId(null);
      setAccommodationData({
        nome: "",
        endereco: "",
        diaria: 0.0,
        dataCheckin: "",
        dataCheckout: "",
      });
      setSelectedTrip("");
      setSelectedDestination("");
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTrip("");
    setSelectedDestination("");
    setEditingId(null);
    setAccommodationData({
      nome: "",
      endereco: "",
      diaria: 0.0,
      dataCheckin: "",
      dataCheckout: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccommodationData({ ...accommodationData, [name]: value });
  };

  const handleTripChange = (e) => {
    setSelectedTrip(e.target.value);
    setSelectedDestination("");
  };

  const handleDestinationChange = (e) => {
    setSelectedDestination(e.target.value);
  };

  const handleCreateOrUpdateAccommodation = async () => {
    try {
      const payload = {
        nome: accommodationData.nome,
        endereco: accommodationData.endereco,
        diaria: Number(accommodationData.diaria),
        dataEntrada: accommodationData.dataCheckin,
        dataSaida: accommodationData.dataCheckout,
        codDestino: selectedDestination,
        codViagem: selectedTrip,
      };

      if (editingId) {
        await api.put(`/hospedagens/${editingId}`, payload);
        setSuccess("Hospedagem atualizada com sucesso!");
      } else {
        console.log(payload);
        await api.post("/hospedagens", payload);
        setSuccess("Hospedagem criada com sucesso!");
      }

      fetchAccommodations();
      handleCloseDialog();
    } catch (error) {
      console.error("Error creating or updating accommodation:", error);
      setError("Falha ao salvar hospedagem.");
    }
  };

  const handleDeleteAccommodation = async (id) => {
    try {
      await api.delete(`/hospedagens/${id}`);
      setSuccess("Hospedagem excluída com sucesso!");
      fetchAccommodations();
    } catch (error) {
      console.error("Error deleting accommodation:", error);
      setError("Falha ao deletar hospedagem.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
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
          component="h1"
          gutterBottom
          fontWeight="bold"
          align="center"
          color="primary"
        >
          Hospedagens
        </Typography>
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={trips.length === 0}
          sx={{ mb: 2 }}
        >
          Nova Hospedagem
        </Button>
        {trips.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Você precisa ter pelo menos uma viagem para criar hospedagens.
          </Alert>
        )}
        <List>
          <AnimatePresence>
            {accommodations.map((accommodation, index) => (
              <motion.div
                key={accommodation.id}
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
                        {accommodation.nome}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Endereço: {accommodation.endereco}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Diária: R$ {accommodation.diaria}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Check-in: {accommodation.dataCheckin} | Check-out:{" "}
                          {accommodation.dataCheckout}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleOpenDialog(accommodation)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() =>
                        handleDeleteAccommodation(accommodation.id)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingId ? "Editar Hospedagem" : "Nova Hospedagem"}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Viagem</InputLabel>
            <Select value={selectedTrip} onChange={handleTripChange}>
              {trips.map((trip) => (
                <MenuItem key={trip.id} value={trip.id}>
                  {trip.nomeViagem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedTrip && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Destino</InputLabel>
              <Select
                value={selectedDestination}
                onChange={handleDestinationChange}
              >
                {trips
                  .find((trip) => trip.id === selectedTrip)
                  ?.destinos.map((destino) => (
                    <MenuItem key={destino.id} value={destino.id}>
                      {destino.nome}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
          <TextField
            autoFocus
            margin="dense"
            name="nome"
            label="Nome da Hospedagem"
            type="text"
            fullWidth
            value={accommodationData.nome}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="endereco"
            label="Endereço"
            type="text"
            fullWidth
            value={accommodationData.endereco}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="diaria"
            label="Diária (R$)"
            type="number"
            fullWidth
            value={accommodationData.diaria}
            onChange={handleInputChange}
          />
          <Box
            sx={{
              mt: 2,
              mb: 2,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <TextField
              margin="dense"
              name="dataCheckin"
              label="Data de Check-in"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={accommodationData.dataCheckin}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="dataCheckout"
              label="Data de Check-out"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={accommodationData.dataCheckout}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleCreateOrUpdateAccommodation} color="primary">
            {editingId ? "Salvar Alterações" : "Criar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Accommodations;
