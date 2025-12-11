/// src/screens/ChatScreen.jsx
import React from "react";

export default function ChatScreen({
  userPrompt,
  setUserPrompt,
  lastPrompt,
  llmResponse,
  isLoading,
  onSend,
  onExplainClick,
}) {
  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>LLM Chatbot</h1>
      </header>

      <div className="chat-window">
        {!lastPrompt && !llmResponse && (
          <div className="chat-placeholder">
            <p>
              Escribe cualquier pregunta o instrucción y observa cómo el LLM la
              responde. Luego podrás ver lo que pasa “por dentro”.
            </p>
          </div>
        )}

        {lastPrompt && (
          <div className="chat-bubble user">
            <div className="avatar user-avatar">Tú</div>
            <div className="bubble-content">{lastPrompt}</div>
          </div>
        )}

        {llmResponse && (
          <div className="chat-bubble assistant">
            <div className="avatar assistant-avatar">LLM</div>
            <div className="bubble-content">{llmResponse}</div>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <textarea
          placeholder="Escribe tu prompt aquí..."
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
        />
        <div className="chat-actions">
          <button
            className="primary-btn"
            onClick={onSend}
            disabled={isLoading || !userPrompt.trim()}
          >
            {isLoading ? "Pensando..." : "Enviar"}
          </button>
        </div>
      </div>

      {llmResponse && (
        <div className="explain-section">
          <button className="secondary-btn" onClick={onExplainClick}>
            ¿Qué ocurre desde que el LLM analiza tu pregunta hasta que la
            responde?
          </button>
        </div>
      )}
    </div>
  );
}
