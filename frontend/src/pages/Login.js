"use client";

import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Box,
  InputAdornment,
  IconButton,
  useTheme,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";

const Login = ({ toggleDarkMode, darkMode }) => {
  const [credentials, setCredentials] = useState({ email: "", senha: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const success = await login(credentials);
      if (success) {
        navigate("/");
      } else {
        setError("Credenciais inválidas");
      }
    } catch (error) {
      setError("Ocorreu um erro durante o login");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: theme.palette.background.default,
        backgroundImage: `linear-gradient(to bottom right, ${theme.palette.background.default}, ${theme.palette.primary.light})`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            textTransform: "none",
            fontFamily:
              "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
          }}
        >
          TravelPal
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              icon={<Brightness7 />}
              checkedIcon={<Brightness4 />}
            />
          }
          label={darkMode ? "Dark" : "Light"}
        />
      </Box>

      <Container
        component="main"
        maxWidth="xs"
        sx={{ flex: 1, display: "flex", alignItems: "center" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%" }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: "100%",
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
              component="h1"
              variant="h4"
              align="center"
              gutterBottom
              fontWeight="bold"
            >
              Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={credentials.email}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="senha"
                label="Senha"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={credentials.senha}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {error && (
                <Typography color="error" align="center" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
              <Typography align="center">
                Não tem uma conta?{" "}
                <Link component={RouterLink} to="/register" color="primary">
                  Registre-se
                </Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
