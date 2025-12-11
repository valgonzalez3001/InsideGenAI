// src/screens/GenerationScreen.jsx
import React, { useEffect, useState } from "react";
import data from "../data/similar_words.json";

const SIMILAR_WORDS = data.similar_words;
const GENERIC_POOL = data.generic_pool;


function normalizeToken(token) {
    return token
        .toLowerCase()
        .replace(/[.,!?¡¿;:]+$/g, "");
}


export default function GenerationScreen({ response, onBackToChat }) {
    const targetTokens = response.trim().split(/\s+/).filter(Boolean);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [generatedTokens, setGeneratedTokens] = useState([]);
    const [rouletteOptions, setRouletteOptions] = useState([]);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (!isRunning) return;
        if (currentIndex >= targetTokens.length) {
            setIsRunning(false);
            return;
        }

        const timer = setTimeout(() => {
            const realToken = targetTokens[currentIndex];
            const options = buildRouletteOptions(realToken);
            setRouletteOptions(options);
            setGeneratedTokens((prev) => [...prev, realToken]);
            setCurrentIndex((prev) => prev + 1);
        }, 700);

        return () => clearTimeout(timer);
    }, [isRunning, currentIndex, targetTokens]);

    const handleStart = () => {
        setGeneratedTokens([]);
        setCurrentIndex(0);
        setRouletteOptions([]);
        if (targetTokens.length > 0) setIsRunning(true);
    };

    return (
        <div className="process-screen">
            <header className="process-header">
                <h2>Paso 3: Generación de la respuesta token a token</h2>
                <p>
                    Para cada posición de la respuesta, el LLM calcula la probabilidad de
                    muchos tokens posibles… y escoge uno.
                </p>
            </header>

            <main className="generation-main">
                <div className="roulette-card">
                    <h3>“Ruleta” de tokens candidatos</h3>
                    <div className={`roulette-wheel ${isRunning ? "spinning" : ""}`}>
                        {rouletteOptions.length === 0 && (
                            <div className="roulette-placeholder">
                                Pulsa <strong>Iniciar simulación</strong> para ver cómo el LLM
                                va eligiendo tokens.
                            </div>
                        )}

                        {rouletteOptions.length > 0 && (
                            <ul className="roulette-list">
                                {rouletteOptions.map((opt, idx) => (
                                    <li
                                        key={idx}
                                        className={`roulette-item ${opt.isChosen ? "winner" : ""
                                            }`}
                                    >

                                        <span className="token-label">{opt.token}</span>
                                        <span className="token-prob">
                                            {(opt.probability * 100).toFixed(1)}%
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <p className="roulette-caption">
                        En realidad, el modelo maneja miles de posibles tokens. Aquí sólo
                        mostramos algunos y marcamos el que tiene mayor probabilidad.
                    </p>
                </div>

                <div className="generated-text-card">
                    <h3>Texto generado por el LLM</h3>
                    <div className="generated-text-box">
                        {generatedTokens.length === 0 ? (
                            <span className="placeholder-text">
                                La frase se irá construyendo aquí, token a token…
                            </span>
                        ) : (
                            generatedTokens.join(" ")
                        )}
                    </div>
                    <button className="primary-btn" onClick={handleStart}>
                        {generatedTokens.length === 0 ? "Iniciar simulación" : "Reiniciar"}
                    </button>

                    <p className="small-note">
                        Cada vez que se añade un token, el modelo vuelve a calcular las
                        probabilidades del siguiente, teniendo en cuenta todo lo generado
                        hasta el momento.
                    </p>
                </div>
            </main>

            <button className="back-btn" onClick={onBackToChat}>
                ← Volver al chat
            </button>
        </div>
    );
}

function buildRouletteOptions(correctToken) {
    const base = normalizeToken(correctToken);

    // 1. Candidatas similares según el diccionario
    let similar = SIMILAR_WORDS[base] ? [...SIMILAR_WORDS[base]] : [];

    // 2. Si hay pocas, rellena con genéricas distintas
    if (similar.length < 4) {
        const extra = GENERIC_POOL.filter(
            (w) => normalizeToken(w) !== base && !similar.includes(w)
        );
        similar = [...similar, ...shuffleArray(extra)].slice(0, 4);
    } else {
        similar = similar.slice(0, 4);
    }

    // 3. Probabilidad alta para la palabra real
    const correctProb = 0.45 + Math.random() * 0.35; // 0.45–0.8
    const leftover = 1 - correctProb;

    // Repartimos el resto de probabilidad entre las similares
    const raw = similar.map(() => Math.random());
    const sum = raw.reduce((a, b) => a + b, 0) || 1;
    const similarProbs = raw.map((v) => (v / sum) * leftover);

    const options = [
        {
            token: correctToken,        // token real que está generando el LLM
            probability: correctProb,
            isChosen: true,
        },
        ...similar.map((w, idx) => ({
            token: w,
            probability: similarProbs[idx],
            isChosen: false,
        })),
    ];

    // 4. Mezclamos para que la correcta no esté siempre en la misma posición
    return shuffleArray(options);
}


function shuffleArray(arr) {
    const clone = [...arr];
    for (let i = clone.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
}

