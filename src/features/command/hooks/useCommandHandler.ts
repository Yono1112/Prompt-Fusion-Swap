// src/features/command/hooks/useCommandHandler.ts
"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

export type QuoteState = {
  quote: any; // 1inchからの見積もりレスポンス全体
  fromAmount: string; // ユーザーが入力したスワップ元の数量
  originalPrompt: string; // ユーザーが入力した元のコマンド
};

export function useCommandHandler() {
  const { address, chainId } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [quoteState, setQuoteState] = useState<QuoteState | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sendCommand = async (prompt: string) => {
    if (!address || !chainId) {
      alert("Please connect your wallet first.");
      return;
    }

    setIsLoading(true);
    setQuoteState(null);

    try {
      const res = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, chainId, walletAddress: address }),
      });
      const data = await res.json();

      console.log("useCommandHandler");
      if (data.type === "quote_received" && data.quote && !data.quote.error) {
        console.log("success", data);
        setQuoteState({
          quote: data.quote,
          fromAmount: data.fromAmount,
          originalPrompt: data.originalPrompt,
        });
        setIsDialogOpen(true);
      } else {
        console.log("error");
        // 見積もり以外のレスポンス（エラーなど）
        const errorMessage =
          data.quote?.description ||
          data.message ||
          "An unknown error occurred.";
        // TODO: alertをshadcn/uiのToastに置き換える
        alert(`Error: ${errorMessage}`);
        console.log("API Response:", data);
      }
    } catch (error) {
      console.error("Failed to fetch from /api/command", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSwap = () => {
    // TODO: Sprint 4の後半で、実際のswapトランザクション実行ロジックを実装
    console.log("Swap confirmed!", quoteState);
    setIsDialogOpen(false);
  };

  return {
    sendCommand,
    isLoading,
    quoteState,
    isDialogOpen,
    setIsDialogOpen,
    handleConfirmSwap,
  };
}
