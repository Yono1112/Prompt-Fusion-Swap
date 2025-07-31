import { PortfolioDashboard } from "@/features/portfolio/components/PortfolioDashboard";
import { ConnectButton } from "@/features/wallet/components/ConnectButton";
import { runGemini } from "@/lib/llm/client";

export default async function Home() {
  const llmResponse = await runGemini();
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <header className="w-full max-w-5xl flex justify-between items-center">
        <h1 className="text-lg font-semibold">Prompt Fusion Swap</h1>
        <ConnectButton />
      </header>

      <PortfolioDashboard />
      <div className="w-full max-w-4xl p-4 border rounded-md bg-secondary">
        <h2 className="text-lg font-semibold mb-2">AI Response Test</h2>
        <p className="text-muted-foreground">
          &gt; "日本語で猫の鳴き声はなんですか？"
        </p>
        <p className="mt-2 p-3 bg-background rounded">{llmResponse}</p>
      </div>
    </main>
  );
}
