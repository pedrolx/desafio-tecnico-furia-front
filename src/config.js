export const API_CONFIG = {
    baseURL: import.meta.env.PROD
      ? "https://desafio-tecnico-furia-back.onrender.com"
      : "http://localhost:3002",
    wsPath: '/ws'
  };