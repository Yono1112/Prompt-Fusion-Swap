// src/features/wallet/components/ConnectButton.tsx
"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "@/components/ui/button";

export function ConnectButton() {
	const { address, isConnected } = useAccount();
	const { connect } = useConnect();
	const { disconnect } = useDisconnect();

	if (isConnected) {
		return (
			<div>
				<Button onClick={() => disconnect()}>
					{`${address?.slice(0, 6)}...${address?.slice(-4)}`}
				</Button>
			</div>
		);
	}

	return (
		<Button onClick={() => connect({ connector: injected() })}>
			ウォレットを接続
		</Button>
	);
}
