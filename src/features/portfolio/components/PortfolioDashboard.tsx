// src/features/portfolio/components/PortfolioDashboard.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssetTable } from "./AssetTable";
import { usePortfolio } from "../hooks/usePortfolio";
import { useAccount } from "wagmi";

export function PortfolioDashboard() {
  const { isConnected } = useAccount();
  const { data: assets, isLoading } = usePortfolio();
  console.log("PortfolioDashboard, ", assets);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
        <CardDescription>
          {isConnected
            ? "A list of your assets in the connected wallet."
            : "Connect your wallet to see your asset portfolio."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AssetTable assets={assets || []} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}
