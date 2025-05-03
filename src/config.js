export const API_CONFIG = {
    IA_URL: import.meta.env.PROD
      ? 'https://desafio-tecnico-furia-back.onrender.com/api/perguntar-ia'
      : 'http://localhost:3002/api/perguntar-ia',
    WS_URL: import.meta.env.PROD
      ? 'wss://desafio-tecnico-furia-back.onrender.com/furia-chat'
      : 'ws://localhost:3001/furia-chat'
  };