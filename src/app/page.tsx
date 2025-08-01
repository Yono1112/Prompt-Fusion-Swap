"use client";

import { PortfolioDashboard } from "@/features/portfolio/components/PortfolioDashboard";
import { ConnectButton } from "@/features/wallet/components/ConnectButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommandBar } from "@/features/command/components/CommandBar";
import { useCommandHandler } from "@/features/command/hooks/useCommandHandler";

export default function Home() {
  const { sendCommand, isLoading, response } = useCommandHandler();

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <header className="w-full max-w-5xl flex justify-between items-center">
        <h1 className="text-lg font-semibold">Prompt Fusion Swap</h1>
        <ConnectButton />
      </header>

      <PortfolioDashboard />
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>AI Command Bar</CardTitle>
        </CardHeader>
        <CardContent>
          <CommandBar onSubmit={sendCommand} isLoading={isLoading} />
          {response && (
            <div className="mt-4 p-4 bg-secondary rounded-md">
              <h3 className="font-semibold">Parsed Intent:</h3>
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
