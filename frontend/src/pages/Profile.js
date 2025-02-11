"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material";
import {
  PhotoCamera,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import api from "../services/api";
import { motion } from "framer-motion";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [newName, setNewName] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileResponse = await api.get("/conta");
        setProfile(profileResponse.data);
        setNewName(profileResponse.data.nome);

        const photoResponse = await api.get("/conta/foto");
        if (photoResponse.data.foto) {
          setPhotoPreview(`data:image/jpeg;base64,${photoResponse.data.foto}`);
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        // setError("Erro ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("foto", file);

    try {
      await api.post("/conta/foto", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Foto atualizada com sucesso!");
      setPhotoPreview(URL.createObjectURL(file));
    } catch (error) {
      setError("Erro ao fazer upload da foto.");
    }
  };

  const handleUpdateName = async () => {
    try {
      await api.put("/conta", { nome: newName });
      setProfile({ ...profile, nome: newName });
      setSuccess("Nome atualizado com sucesso!");
    } catch (error) {
      setError("Erro ao atualizar nome.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/conta");
      window.location.href = "/login";
    } catch (error) {
      setError("Erro ao deletar conta.");
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
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{ p: 4, mt: 4, borderRadius: theme.shape.borderRadius }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            fontWeight="bold"
          >
            Perfil
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Avatar
              src={photoPreview}
              sx={{ width: 150, height: 150, mb: 2 }}
            />
            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCamera />}
            >
              Alterar Foto
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </Button>
          </Box>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              fullWidth
              label="Nome"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              fullWidth
              onClick={handleUpdateName}
              sx={{ mt: 2 }}
            >
              Atualizar Nome
            </Button>

            <TextField
              margin="normal"
              fullWidth
              label="Email"
              value={profile?.email || ""}
              disabled
            />
          </Box>

          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            fullWidth
            onClick={() => setOpenDeleteDialog(true)}
            sx={{ mt: 3 }}
          >
            Deletar Conta
          </Button>
        </Paper>
      </motion.div>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          Tem certeza de que deseja excluir sua conta? Essa ação não pode ser
          desfeita.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDeleteAccount} color="error">
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
