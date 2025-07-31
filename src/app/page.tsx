import { ConnectButton } from "@/features/wallet/components/ConnectButton";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center p-8">
			<header className="w-full max-w-5xl flex justify-between items-center">
				<h1 className="text-lg font-semibold">Prompt Fusion Swap</h1>
				<ConnectButton />
			</header>

			<div className="flex-grow flex items-center justify-center">
				<p className="text-muted-foreground">ポートフォリオを読み込むには、ウォレットを接続してください。</p>
			</div>
		</main>
	);
}
