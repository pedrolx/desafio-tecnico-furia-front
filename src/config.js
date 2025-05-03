export const API_CONFIG = {
    baseURL: import.meta.env.PROD
      ? "https://desafio-tecnico-furia-back.onrender.com"
      : "http://localhost:3002",
    get WS_URL() {
      return this.baseURL.replace('http', 'ws') + this.wsPath;
    },
    wsPath: '/ws'
  };