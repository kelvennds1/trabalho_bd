"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  useTheme,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  PhotoCamera,
  Flight,
  Group,
  CalendarToday,
  LocationOn,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import api from "../services/api";
import DestinoForm from "../components/DestinoForm";
import { motion, AnimatePresence } from "framer-motion";

const steps = ["Informações Básicas", "Destinos", "Datas", "Foto"];

const NewTrip = () => {
  const [formData, setFormData] = useState({
    nomeViagem: "",
    tipoViagem: "",
    quantParticipantes: 1,
    dataInicio: null,
    dataTermino: null,
    destinos: [],
    foto: null,
  });

  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openNewDestino, setOpenNewDestino] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchDestinos();
  }, []);

  const fetchDestinos = async () => {
    try {
      const response = await api.get("/destinos");
      setDestinos(response.data);
    } catch (error) {
      console.error("Erro ao carregar destinos:", error);
      setError("Falha ao carregar destinos.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      foto: file,
    }));

    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.nomeViagem ||
      !formData.tipoViagem ||
      !formData.dataInicio ||
      !formData.dataTermino ||
      formData.destinos.length === 0
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const payload = {
        nomeViagem: formData.nomeViagem,
        tipoViagem: formData.tipoViagem,
        quantParticipantes: formData.quantParticipantes,
        dataInicio: formData.dataInicio.toISOString().split("T")[0],
        dataTermino: formData.dataTermino.toISOString().split("T")[0],
        destinos: formData.destinos.map((destino) => destino.id),
        foto: formData.foto,
      };

      console.log("Enviando para API:", payload);
      const viagemResponse = await api.post("/viagens", payload);
      const viagemId = viagemResponse.data.id;

      if (formData.foto) {
        const formDataPhoto = new FormData();
        formDataPhoto.append("foto", formData.foto);

        await api.post(`/viagens/${viagemId}/foto`, formDataPhoto, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSuccess("Viagem criada com sucesso!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Erro ao criar viagem:", error);
      setError("Erro ao criar viagem. Verifique os dados e tente novamente.");
    }
  };

  const handleCreateDestino = async (newDestinoData) => {
    try {
      const response = await api.post("/destinos", newDestinoData);
      const novoDestino = response.data;

      setDestinos((prevDestinos) => [...prevDestinos, novoDestino]);
      setFormData((prevFormData) => ({
        ...prevFormData,
        destinos: [...prevFormData.destinos, novoDestino],
      }));
    } catch (error) {
      setError("Erro ao criar destino.");
    }
  };

  const handleNext = (e) => {
    if (e) e.preventDefault(); // Impede o envio automático do formulário
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
          Nova Viagem
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box component="form" onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeStep === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Nome da Viagem"
                      value={formData.nomeViagem}
                      onChange={(e) =>
                        setFormData({ ...formData, nomeViagem: e.target.value })
                      }
                      InputProps={{
                        startAdornment: (
                          <Flight color="action" sx={{ mr: 1 }} />
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Tipo de Viagem"
                      value={formData.tipoViagem}
                      onChange={(e) =>
                        setFormData({ ...formData, tipoViagem: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      label="Número de Participantes"
                      value={formData.quantParticipantes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantParticipantes: Number.parseInt(e.target.value),
                        })
                      }
                      InputProps={{
                        inputProps: { min: 1 },
                        startAdornment: <Group color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              {activeStep === 1 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Destinos</InputLabel>
                    <Select
                      multiple
                      value={formData.destinos.map((d) => d.id)}
                      onChange={(e) => {
                        const selectedIds = e.target.value;
                        const selectedDestinos = destinos.filter((d) =>
                          selectedIds.includes(d.id)
                        );
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          destinos: selectedDestinos,
                        }));
                      }}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((id) => {
                            const destino = destinos.find((d) => d.id === id);
                            return destino ? (
                              <Chip
                                key={id}
                                label={destino.nome}
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
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenNewDestino(true)}
                  >
                    Adicionar Novo Destino
                  </Button>
                </Box>
              )}

              {activeStep === 2 && (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Data de Início"
                        value={formData.dataInicio}
                        onChange={(newValue) =>
                          setFormData({ ...formData, dataInicio: newValue })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            required
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <CalendarToday color="action" sx={{ mr: 1 }} />
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Data de Término"
                        value={formData.dataTermino}
                        onChange={(newValue) =>
                          setFormData({ ...formData, dataTermino: newValue })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            required
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <CalendarToday color="action" sx={{ mr: 1 }} />
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              )}

              {activeStep === 3 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {photoPreview && (
                    <Box
                      sx={{
                        width: "100%",
                        height: 200,
                        backgroundImage: `url(${photoPreview})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: theme.shape.borderRadius,
                        mb: 3,
                      }}
                    />
                  )}
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCamera />}
                    onClick={(e) => e.stopPropagation()} // Evita envio automático do formulário
                  >
                    {photoPreview ? "Trocar Foto" : "Enviar Foto da Viagem"}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </Button>
                </Box>
              )}
            </motion.div>
          </AnimatePresence>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              variant="outlined"
            >
              Voltar
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button type="submit" variant="contained">
                  Criar Viagem
                </Button>
              ) : (
                <Button onClick={handleNext} variant="contained">
                  Próximo
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      <DestinoForm
        open={openNewDestino}
        onClose={() => setOpenNewDestino(false)}
        onSubmit={handleCreateDestino}
      />
    </Container>
  );
};

export default NewTrip;
