import './styles.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

/* Importação de dependências e do CSS global. */
/* Renderização do componente App */

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);