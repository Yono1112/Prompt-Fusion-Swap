// src/lib/llm/client.ts
"use server";

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({});

const weatherFunctionDeclaration = {
  name: "get_current_temperature",
  description: "Gets the current temperature for a given location.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: {
        type: Type.STRING,
        description: "The city name, e.g. San Francisco",
      },
    },
    required: ["location"],
  },
};

/**
 * Gemini APIを呼び出し、テキスト応答を生成する簡易関数
 */
export async function runGemini() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "What's the temperature in London?",
      config: {
        tools: [
          {
            functionDeclarations: [weatherFunctionDeclaration],
          },
        ],
      },
    });
    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionCall = response.functionCalls[0]; // Assuming one function call
      console.log(`Function to call: ${functionCall.name}`);
      console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
      // In a real app, you would call your actual function here:
      // const result = await getCurrentTemperature(functionCall.args);
      return `name: ${functionCall.name}, args: ${JSON.stringify(functionCall.args)}`;
    } else {
      console.log("No function call found in the response.");
      console.log(response.text);
    }
    console.log(response.text);
    return "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to get response from AI.";
  }
}
