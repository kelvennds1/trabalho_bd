import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api/",
  // baseURL: "https://admittedly-classic-marmoset.ngrok-free.app/api",
});

export default api;
