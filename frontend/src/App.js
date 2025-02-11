"use client";

import { useState, useMemo } from "react";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import NewTrip from "./pages/NewTrip";
import TripDetails from "./pages/TripDetails";
import Profile from "./pages/Profile";
import PopularDestinations from "./components/PopularDestinations";
import Accommodations from "./pages/Accommodations";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: darkMode ? "#90caf9" : "#3a86ff",
          },
          secondary: {
            main: darkMode ? "#f48fb1" : "#ff006e",
          },
          background: {
            default: darkMode ? "#181818" : "#f8f9fa",
            paper: darkMode ? "#282828" : "#ffffff",
          },
          text: {
            primary: darkMode ? "#ffffff" : "#000000",
          },
        },
        shape: {
          borderRadius: 8,
        },
        typography: {
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          h1: { fontWeight: 700 },
          h2: { fontWeight: 600 },
          h3: { fontWeight: 600 },
          h4: { fontWeight: 600 },
          h5: { fontWeight: 500 },
          h6: { fontWeight: 500 },
        },
      }),
    [darkMode]
  );

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <Login toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
              }
            />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/new-trip"
              element={
                <PrivateRoute>
                  <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
                    <NewTrip />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/accommodations"
              element={
                <PrivateRoute>
                  <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
                    <Accommodations />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/trip/:id"
              element={
                <PrivateRoute>
                  <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
                    <TripDetails />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
                    <Profile />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/populardestinations"
              element={
                <PrivateRoute>
                  <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
                    <PopularDestinations />
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
