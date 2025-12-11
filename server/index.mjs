// server/index.mjs
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Groq from "groq-sdk";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // asegúrate de exportarla en tu entorno
});

// Endpoint para el chat
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt vacío" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const content =
      completion.choices?.[0]?.message?.content ?? "No se pudo generar respuesta.";

    res.json({ answer: content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error llamando a Groq" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
