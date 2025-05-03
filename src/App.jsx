import React, { useState } from "react";
import { Chat } from "./components/Chat";
import FuriaLogo from '/furia.png';

export const App = () => {
    /* Variável "username" armazena o nome do usuario para que ele seja 
    utilizado posteriormente */
    const [username, setarUsername] = useState("");

    /* Variável "entrada" usada para controlar se o usuario entrou no chat ou 
    não */
    const [entrada, setarEntrada] = useState(false);

    /* Quanto o botão "Entrar no chat" é pressionado ele faz a verificação da 
    variável username e seta a entrada, renderizando o componente Chat */
    const verificarEntradaChat = () => {
        if (username.trim()) setarEntrada(true);
    };

    return (
        <div className="container">
            <header>
                <h1>  <img
                    src={FuriaLogo}
                    alt="FURIA Logo"
                    style={{
                        width: '100px',
                        height: '70px',
                        verticalAlign: 'middle',
                        marginRight: '10px'
                    }}
                /> FURIA Fã Chat</h1>
                <p>
                    Interaja ao vivo com torcedores e acompanhe a FURIA!
                </p>
            </header>

            {!entrada ? (
                <div className="input-container">
                    <input
                        type="text"
                        className="input-text"
                        placeholder="Digite seu nome de torcedor"
                        value={username}
                        onChange={(e) => setarUsername(e.target.value)}
                    />
                    <button
                        className="btn-entrar"
                        onClick={verificarEntradaChat}
                    >
                        Entrar no chat
                    </button>
                </div>
            ) : (
                /* Envio do username para o componente Chat para controle das
                mensagens */
                <Chat username={username} />
            )}
        </div>
    );
};
