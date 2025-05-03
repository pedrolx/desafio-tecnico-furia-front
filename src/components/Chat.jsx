import React, { useEffect, useState, useRef } from "react";

export const Chat = ({ username }) => {
    /* Array com todas as mensagens do chat (Sem DB para manter histórico) */
    const [mensagens, setarMensagens] = useState([]);

    /* Armazena o texto que o usuario no chat digita */
    const [input, setarInput] = useState("");

    /* WebSocket */
    const ws = useRef(null);

    /* Estabelece a conexão com o backend */
    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:3001");

        ws.current.onmessage = (event) => {
            const mensagemRecebida = event.data;

            /* Resolução para o problema de duplicação de mensagem que acontecia
            nos teste com o chat aberto em mais de uma aba de navegador, onde
            quem digitou a mensagem via ela duas vezes no histórico do chat */
            if (!mensagemRecebida.startsWith(`${username}:`)) {
                setarMensagens((prev) => [...prev, mensagemRecebida]);
            }
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
            const resposta = await fetch("http://localhost:3002/perguntar-ia", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: pergunta }),
            });
            const data = await resposta.json();
            setarMensagens((prev) => [...prev, `IA FURIA: ${data.answer}`]);
        } catch (error) {
            setarMensagens((prev) => [...prev, "IA FURIA: Erro ao buscar resposta."]);
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
