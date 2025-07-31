// src/features/portfolio/components/PortfolioDashboard.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssetTable } from "./AssetTable";

export function PortfolioDashboard() {
  // TODO: ここでAPIから取得したデータをAssetTableに渡す
  const dummyAssets: any[] = [];

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
        <CardDescription>
          Connect your wallet to see your asset portfolio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AssetTable assets={dummyAssets} />
      </CardContent>
    </Card>
  );
}
