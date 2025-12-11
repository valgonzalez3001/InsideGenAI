// src/screens/TokenizationScreen.jsx
import React, { useEffect, useState } from "react";

const TOKEN_COLORS = [
    "#ff6b6b",
    "#feca57",
    "#48dbfb",
    "#1dd1a1",
    "#5f27cd",
    "#ff9ff3",
    "#54a0ff",
];

export default function TokenizationScreen({ prompt, onNext }) {
    const [tokens, setTokens] = useState([]);           // todos los tokens
    const [visibleCount, setVisibleCount] = useState(0); // cuántos tokens se muestran
    const [embeddings, setEmbeddings] = useState([]);   // vectores “mágicos”
    const [showEmbeddings, setShowEmbeddings] = useState(false);

    // 1) Cuando cambia el prompt, recalculamos tokens y “apagamos” embeddings
    useEffect(() => {
        if (!prompt || !prompt.trim()) {
            setTokens([]);
            setVisibleCount(0);
            setEmbeddings([]);
            setShowEmbeddings(false);
            return;
        }

        const words = prompt.match(/\S+/g) || [];
        setTokens(words);
        setVisibleCount(0);
        setShowEmbeddings(false);

        // creamos vectores de juguete para cada token
        const fakeEmbeddings = words.map(() => {
            const dims = 6; // 6 “números” por vector
            return Array.from({ length: dims }, () =>
                0.3 + Math.random() * 0.7 // valores entre 0.3 y 1
            );
        });
        setEmbeddings(fakeEmbeddings);
    }, [prompt]);

    // 2) Animación de tokens uno a uno
    useEffect(() => {
        if (tokens.length === 0) return;
        if (visibleCount >= tokens.length) {
            // cuando todos los tokens están visibles, esperamos un pelín y mostramos embeddings
            const t = setTimeout(() => setShowEmbeddings(true), 600);
            return () => clearTimeout(t);
        }

        const id = setInterval(() => {
            setVisibleCount((prev) => {
                if (prev >= tokens.length) return prev;
                return prev + 1;
            });
        }, 400);

        return () => clearInterval(id);
    }, [tokens, visibleCount]);

    const visibleTokens = tokens.slice(0, visibleCount);

    return (
        <div className="process-screen">
            <header className="process-header">
                <h2>Paso 1: Tokenización y “números mágicos”</h2>
                <p>
                    Primero el modelo rompe tu frase en piezas más pequeñas llamadas{" "}
                    <strong>tokens</strong>. Después, convierte esos tokens en{" "}
                    <strong>vectores de números</strong> que sí puede entender.
                </p>
            </header>

            <main className="token-main">
                {/* Bloque 1: De frase a tokens */}
                <div className="prompt-big">
                    {visibleTokens.length === 0 && (
                        <span className="prompt-fading">{prompt}</span>
                    )}

                    {visibleTokens.length > 0 && (
                        <div className="tokens-line">
                            {visibleTokens.map((token, idx) => (
                                <span
                                    key={`${token}-${idx}`}
                                    className="token-chip"
                                    style={{
                                        borderColor: TOKEN_COLORS[idx % TOKEN_COLORS.length],
                                        color: TOKEN_COLORS[idx % TOKEN_COLORS.length],
                                    }}
                                >
                                    {token}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="explanation-box">
                    <p>
                        <strong>¿Qué está pasando?</strong>
                    </p>
                    <p>
                        El texto se divide en unidades (tokens). Aquí simplificamos y
                        consideramos cada palabra como un token.
                    </p>
                    <p>
                        Pero ojo: el LLM tampoco “entiende” palabras directamente. Necesita
                        convertir cada token en una fila de números: eso se llama{" "}
                        <strong>embedding</strong>.
                    </p>
                </div>

                {/* Bloque 2: De tokens a vectores (embeddings) */}
                {showEmbeddings && (
                    <section className="embeddings-section">
                        <div className="embeddings-title">
                            <h3>De palabras a números mágicos ✨</h3>
                            <p>
                                Cada token se convierte en un vector: una colección de números
                                que el modelo usa para pensar. Aquí lo mostramos como barritas
                                de colores.
                            </p>
                        </div>

                        <div className="embeddings-grid">
                            {tokens.map((token, tokenIndex) => (
                                <div className="embedding-card">
                                    <div className="embedding-token-label">{token}</div>

                                    {/* Barras visuales */}
                                    <div className="embedding-bars">
                                        {embeddings[tokenIndex]?.map((value, dimIndex) => (
                                            <div
                                                key={`bar-${tokenIndex}-${dimIndex}`}
                                                className="embedding-bar"
                                                style={{
                                                    height: `${40 + value * 40}px`,
                                                }}
                                            />
                                        ))}
                                    </div>

                                    {/* Números reales del vector */}
                                    <div className="embedding-numbers">
                                        [
                                        {embeddings[tokenIndex]
                                            .map((v) => v.toFixed(2))       // redondeamos a 2 decimales → más amigable
                                            .join(", ")}
                                        ]
                                    </div>
                                </div>

                            ))}
                        </div>

                        <p className="embeddings-footnote">
                            En realidad los vectores son mucho más largos (¡cientos de
                            números!), pero esta versión mini ayuda a ver la idea.
                        </p>
                    </section>
                )}
            </main>

            <button className="next-arrow" onClick={onNext}>
                ➜
            </button>
        </div>
    );
}
