// src/api/groqClient.js
export async function getGroqAnswer(prompt) {
  const resp = await fetch("http://localhost:4000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!resp.ok) {
    throw new Error("Error llamando al backend");
  }

  const data = await resp.json();
  if (data.error) {
    throw new Error(data.error);
  }

  return data.answer;
}
