// src/features/command/hooks/useCommandHandler.ts
"use client";

import { useState } from "react";

export function useCommandHandler() {
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 入力されたプロンプトをバックエンドAPIに送信する関数
   * @param prompt ユーザーが入力したコマンド文字列
   */
  const sendCommand = async (prompt: string) => {
    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Failed to fetch from /api/command", error);
      setResponse({ error: "An error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return { sendCommand, isLoading, response };
}
