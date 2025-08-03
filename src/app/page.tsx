"use client";

import { PortfolioDashboard } from "@/features/portfolio/components/PortfolioDashboard";
import { ConnectButton } from "@/features/wallet/components/ConnectButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommandBar } from "@/features/command/components/CommandBar";
import { useCommandHandler } from "@/features/command/hooks/useCommandHandler";
import { ConfirmationDialog } from "@/features/command/components/ConfirmationDialog";

export default function Home() {
  const {
    sendCommand,
    isLoading,
    statusMessage,
    quoteState,
    isDialogOpen,
    setIsDialogOpen,
    handleConfirmSwap,
  } = useCommandHandler();

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pt-8 md:px-24 md:pt-12">
      <header className="w-full max-w-5xl flex justify-between items-center">
        <h1 className="text-lg font-semibold">Prompt Fusion Swap</h1>
        <ConnectButton />
      </header>

      <div className="w-full max-w-4xl flex flex-col gap-8 mt-12">
        <PortfolioDashboard />

        <Card>
          <CardHeader>
            <CardTitle>AI Command Bar</CardTitle>
          </CardHeader>
          <CardContent>
            <CommandBar onSubmit={sendCommand} isLoading={isLoading} />
            {isLoading && statusMessage && (
              <div className="mt-4 text-center text-muted-foreground animate-pulse">
                <p>{statusMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        quoteState={quoteState}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleConfirmSwap}
      />
    </main>
  );
}
