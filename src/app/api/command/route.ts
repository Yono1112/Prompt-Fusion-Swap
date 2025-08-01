// src/app/api/command/route.ts

import { NextResponse } from "next/server";
import { getAiFunctionCall } from "@/lib/llm/client";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const functionCall = await getAiFunctionCall(prompt);

    if (functionCall) {
      return NextResponse.json({
        type: "function_call",
        functionCall,
      });
    } else {
      return NextResponse.json({
        type: "no_action",
        message: "Could not determine an action from your command.",
      });
    }
  } catch (error) {
    console.error("Error in /api/command:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
