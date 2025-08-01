// src/app/api/command/route.ts

import { NextResponse } from "next/server";
import { getAiFunctionCall } from "@/lib/llm/client";
import { getSwapQuote } from "@/lib/1inch/sdk";
import { getTokenAddress } from "@/lib/tokens";

type GetSwapQuoteArgs = {
  fromToken: string;
  toToken: string;
  amount: string;
};

type GetTokenBalanceArgs = {
  tokenSymbol: string;
};

export async function POST(request: Request) {
  try {
    const { prompt, chainId, walletAddress } = await request.json();

    if (!prompt || !chainId || !walletAddress) {
      return NextResponse.json(
        { error: "Prompt, chainId, and walletAddress are required" },
        { status: 400 },
      );
    }

    const functionCall = await getAiFunctionCall(prompt);

    if (functionCall) {
      if (functionCall.name === "get_swap_quote") {
        const args = functionCall.args as GetSwapQuoteArgs;
        const { fromToken, toToken, amount } = args;

        const fromTokenAddress = getTokenAddress(fromToken, chainId);
        const toTokenAddress = getTokenAddress(toToken, chainId);

        if (!fromTokenAddress || !toTokenAddress) {
          return NextResponse.json(
            { type: "error", message: "Unsupported token specified." },
            { status: 400 },
          );
        }

        console.log(`Getting quote for ${amount} ${fromToken} -> ${toToken}`);

        const quote = await getSwapQuote(
          chainId,
          fromTokenAddress,
          toTokenAddress,
          amount,
        );

        return NextResponse.json({
          type: "quote_received",
          quote,
          originalPrompt: prompt,
        });
      }

      if (functionCall.name === "get_token_balance") {
        const args = functionCall.args as GetTokenBalanceArgs;
        return NextResponse.json({
          type: "info",
          message: `Balance check for ${args.tokenSymbol} is not implemented yet.`,
        });
      }
    }

    return NextResponse.json({
      type: "no_action",
      message: "Could not determine an action from your command.",
    });
  } catch (error) {
    console.error("Error in /api/command:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
