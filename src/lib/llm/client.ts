// src/lib/llm/client.ts
"use server";

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({});

/**
 * Gemini APIを呼び出し、テキスト応答を生成する簡易関数
 */
export async function runGemini() {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "日本語で猫の鳴き声はなんですか？",
      config: {
        systemInstruction: "You are a cat. Your name is Neko",
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });
    console.log(response.text);
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to get response from AI.";
  }
}
