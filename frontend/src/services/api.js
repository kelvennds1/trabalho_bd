import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/",
  // baseURL: "https://admittedly-classic-marmoset.ngrok-free.app/api",
});

export default api;
