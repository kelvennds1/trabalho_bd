import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const DestinoForm = ({ open, onClose, onSubmit }) => {
  const [newDestinoData, setNewDestinoData] = useState({
    nomeDestino: "",
    idiomaLocal: "",
  });
  const [error, setError] = useState("");

  const handleCreateDestino = () => {
    setError("");

    if (!newDestinoData.nomeDestino || !newDestinoData.idiomaLocal) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Chama a função onSubmit passada como prop
    onSubmit(newDestinoData);

    // Limpa o formulário e fecha o modal
    setNewDestinoData({
      nomeDestino: "",
      idiomaLocal: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Novo Destino</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome do Destino"
          fullWidth
          required
          value={newDestinoData.nomeDestino}
          onChange={(e) =>
            setNewDestinoData({
              ...newDestinoData,
              nomeDestino: e.target.value,
            })
          }
        />
        <TextField
          margin="dense"
          label="Idioma Local"
          fullWidth
          required
          value={newDestinoData.idiomaLocal}
          onChange={(e) =>
            setNewDestinoData({
              ...newDestinoData,
              idiomaLocal: e.target.value,
            })
          }
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleCreateDestino} variant="contained">
          Criar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DestinoForm;
