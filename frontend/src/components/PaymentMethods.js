"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Payment,
} from "@mui/icons-material";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const PaymentMethods = ({ tripId }) => {
  const [payments, setPayments] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState({
    id: null,
    metodo: "",
    valor: "",
    data: "",
    statusPagamento: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get(`/pagamentos?codViagem=${tripId}`);
      setPayments(response.data);
    } catch (error) {
      console.error("Erro ao buscar pagamentos:", error);
    }
  };

  const handleOpen = () => {
    setCurrentPayment({
      id: null,
      metodo: "",
      valor: "",
      data: "",
      statusPagamento: "",
    });
    setIsEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPayment({ ...currentPayment, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await api.put(`/pagamentos/${currentPayment.id}`, currentPayment);
      } else {
        await api.post(`/pagamentos`, { ...currentPayment, codViagem: tripId });
      }
      fetchPayments();
      handleClose();
    } catch (error) {
      console.error("Erro ao salvar pagamento:", error);
    }
  };

  const handleEdit = (payment) => {
    setCurrentPayment(payment);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = async (paymentId) => {
    try {
      await api.delete(`/pagamentos/${paymentId}`);
      fetchPayments();
    } catch (error) {
      console.error("Erro ao deletar pagamento:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Métodos de Pagamento
      </Typography>
      <List>
        <AnimatePresence>
          {payments.map((payment, index) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItem
                sx={{
                  mb: 2,
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: theme.shape.borderRadius,
                  boxShadow: theme.shadows[1],
                }}
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEdit(payment)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(payment.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold">
                      <Payment
                        color="primary"
                        sx={{ mr: 1, verticalAlign: "middle" }}
                      />
                      {payment.metodo}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Valor: R$ {payment.valor}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Data: {new Date(payment.data).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {payment.statusPagamento}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </List>
      <Button
        startIcon={<AddIcon />}
        onClick={handleOpen}
        variant="contained"
        color="primary"
      >
        Adicionar Pagamento
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {isEditing ? "Editar" : "Adicionar"} Pagamento
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="metodo"
            label="Método de Pagamento"
            type="text"
            fullWidth
            value={currentPayment.metodo}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="valor"
            label="Valor"
            type="number"
            fullWidth
            value={currentPayment.valor}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="data"
            label="Data do Pagamento"
            type="date"
            fullWidth
            value={currentPayment.data}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="status-pagamento-label">
              Status do Pagamento
            </InputLabel>
            <Select
              labelId="status-pagamento-label"
              name="statusPagamento"
              value={currentPayment.statusPagamento}
              onChange={handleInputChange}
            >
              <MenuItem value="Pendente">Pendente</MenuItem>
              <MenuItem value="Pago">Pago</MenuItem>
              <MenuItem value="Cancelado">Cancelado</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>
            {isEditing ? "Salvar" : "Adicionar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentMethods;
