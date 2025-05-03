import React, { useEffect, useState, useRef } from "react";
import { API_CONFIG } from "../config";

export const Chat = ({ username }) => {
    /* Array com todas as mensagens do chat (Sem DB para manter histórico) */
    const [mensagens, setarMensagens] = useState([]);

    /* Armazena o texto que o usuario no chat digita */
    const [input, setarInput] = useState("");

    /* WebSocket */
    const WS_URL = import.meta.env.PROD
        ? 'wss://desafio-tecnico-furia-back.onrender.com/furia-chat'
        : 'ws://localhost:3001/furia-chat';

    const ws = useRef(new WebSocket(API_CONFIG.WS_URL));

    /* Estabelece a conexão com o backend */
    useEffect(() => {
        ws.current = new WebSocket(API_CONFIG.WS_URL);

        ws.current.onmessage = (event) => {
            const mensagemRecebida = event.data;

            /* Resolução para o problema de duplicação de mensagem que acontecia
            nos teste com o chat aberto em mais de uma aba de navegador, onde
            quem digitou a mensagem via ela duas vezes no histórico do chat */
            if (!mensagemRecebida.startsWith(`${username}:`)) {
                setarMensagens((prev) => [...prev, mensagemRecebida]);
            }
        };

        ws.current.onerror = (error) => {
            console.error("Erro no WebSocket:", error);
            setarMensagens(prev => [...prev, "Erro na conexão do chat"]);
        };

        return () => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.close();
            }
        };
    }, [username]);

    /* Usa a requisição POST do backend e adiciona a mensagem ao chat */
    const perguntarParaIA = async (pergunta) => {
        try {
            if (!API_CONFIG.baseURL) {
                throw new Error('URL da API não configurada');
            }

            const resposta = await fetch(`${API_CONFIG.baseURL}/perguntar-ia`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: pergunta })
            });

            if (!resposta.ok) {
                const errorData = await resposta.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${resposta.status}`);
            }

            const data = await resposta.json();
            return `IA FURIA: ${data.answer}`;

        } catch (error) {
            console.error("Erro detalhado:", {
                error: error.message,
                urlUsed: `${API_CONFIG.baseURL}/perguntar-ia`,
                env: import.meta.env
            });
            return "IA FURIA: Estou tendo problemas técnicos. Tente novamente mais tarde!";
        }
    };

    /* Envia a mensagem digitada utilizando o WebSocket, caso seja digitado com 
    "/ia", será enviada a rota POST que esta conectada a API da OpenRouter. */
    const sendMessage = () => {
        if (input.trim() === "") return;

        if (input.startsWith("/ia ")) {
            const pergunta = input.replace("/ia", "").trim();
            setarMensagens((prev) => [...prev, `${username}: ${input}`]);
            perguntarParaIA(pergunta);
            setarInput("");
            return;
        }

        const msg = `${username}: ${input}`;
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(msg);
            setarMensagens((prev) => [...prev, msg]);
        }

        setarInput("");
    };

    return (
        <div className="chat-container">
            <h2>Chat da Torcida 🗣️</h2>

            <div className="chat-messages">
                {mensagens.map((msg, i) => {
                    let estilo = "msg-padrao";
                    if (msg.startsWith("IA FURIA:")) estilo = "msg-ia";
                    else if (msg.startsWith(`${username}:`)) estilo = "msg-usuario";

                    return (
                        <div key={i} className={estilo}>
                            {msg}
                        </div>
                    );
                })}
            </div>

            <div className="chat-input-container">
                <input
                    value={input}
                    onChange={(e) => setarInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Escreva sua mensagem..."
                />
                <button onClick={sendMessage}>Enviar</button>
            </div>
        </div>
    );
};
