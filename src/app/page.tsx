"use client";

import { PortfolioDashboard } from "@/features/portfolio/components/PortfolioDashboard";
import { ConnectButton } from "@/features/wallet/components/ConnectButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [prompt, setPrompt] = useState("swap 1.5 ETH for USDC");
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <header className="w-full max-w-5xl flex justify-between items-center">
        <h1 className="text-lg font-semibold">Prompt Fusion Swap</h1>
        <ConnectButton />
      </header>

      <PortfolioDashboard />
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>AI Command Test</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a command..."
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Send Command"}
            </Button>
          </form>

          {response && (
            <div className="mt-4 p-4 bg-secondary rounded-md">
              <h3 className="font-semibold">API Response:</h3>
              <pre className="mt-2 text-sm whitespace-pre-wrap">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
