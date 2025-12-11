// App.jsx
import React, { useState } from "react";
import "./App.css";
import { getGroqAnswer } from "./api/groqClient";

import ChatScreen from "./screens/ChatScreen";
import TokenizationScreen from "./screens/TokenizationScreen";
import SearchScreen from "./screens/SearchScreen";
import GenerationScreen from "./screens/GenerationScreen";

export const STAGES = {
  CHAT: "chat",
  TOKENIZATION: "tokenization",
  SEARCH: "search",
  GENERATION: "generation",
};

export default function App() {
  const [stage, setStage] = useState(STAGES.CHAT);
  const [userPrompt, setUserPrompt] = useState("");  
  const [lastPrompt, setLastPrompt] = useState("");  
  const [llmResponse, setLlmResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendPrompt = async () => {
    if (!userPrompt.trim()) return;

    const promptToSend = userPrompt.trim();
    setLastPrompt(promptToSend);  

    setIsLoading(true);
    try {
      const answer = await getGroqAnswer(promptToSend);
      setLlmResponse(answer);
    } catch (err) {
      console.error(err);
      setLlmResponse("Ups, algo fue mal al llamar al modelo 😅.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-root">
      {stage === STAGES.CHAT && (
        <ChatScreen
          userPrompt={userPrompt}
          setUserPrompt={setUserPrompt}
          lastPrompt={lastPrompt}      
          llmResponse={llmResponse}
          isLoading={isLoading}
          onSend={handleSendPrompt}
          onExplainClick={() => {
            if (!lastPrompt.trim() || !llmResponse.trim()) return;
            setStage(STAGES.TOKENIZATION);
          }}
        />
      )}

      {stage === STAGES.TOKENIZATION && (
        <TokenizationScreen
          prompt={lastPrompt}         
          onNext={() => setStage(STAGES.SEARCH)}
        />
      )}

      {stage === STAGES.SEARCH && (
        <SearchScreen onNext={() => setStage(STAGES.GENERATION)} />
      )}

      {stage === STAGES.GENERATION && (
        <GenerationScreen
          response={llmResponse}
          onBackToChat={() => setStage(STAGES.CHAT)}
        />
      )}
    </div>
  );
}
