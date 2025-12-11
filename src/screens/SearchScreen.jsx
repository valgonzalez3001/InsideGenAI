// src/screens/SearchScreen.jsx
import React from "react";

export default function SearchScreen({ onNext }) {
  return (
    <div className="process-screen">
      <header className="process-header">
        <h2>Paso 2: Búsqueda en el conocimiento del LLM</h2>
        <p>
          Ahora el modelo compara tu pregunta con todo lo que ha aprendido
          durante su entrenamiento.
        </p>
      </header>

      <main className="search-main">
        <div className="knowledge-grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="knowledge-block">
              <span>Fragmento {i + 1}</span>
            </div>
          ))}
        </div>
        <div className="explanation-box">
          <p>
            Durante el entrenamiento, el LLM vio enormes cantidades de texto:
            libros, webs, código, artículos…
          </p>
          <p>
            Cuando le haces una pregunta, no “busca en internet”, sino que usa
            los <strong>patrones</strong> que aprendió para estimar qué
            palabras son más probables como respuesta.
          </p>
        </div>
      </main>

      <button className="next-arrow" onClick={onNext}>
        ➜
      </button>
    </div>
  );
}
