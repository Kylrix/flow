'use client';

import { useSettings } from './useSettings';

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const useAI = () => {
  const { userSettings } = useSettings();

  const generate = async (prompt: string, options: { 
    history?: AIChatMessage[], 
    systemInstruction?: string 
  } = {}) => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    
    // Client-side injection of user key if they have one
    if (userSettings.customGeminiKey) {
      headers["x-user-gemini-key"] = userSettings.customGeminiKey;
    }

    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers,
      body: JSON.stringify({ 
        prompt, 
        history: options.history,
        systemInstruction: options.systemInstruction 
      }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "AI Generation failed");
    }
    
    const data = await response.json();
    return data.text as string;
  };

  return { generate };
};
