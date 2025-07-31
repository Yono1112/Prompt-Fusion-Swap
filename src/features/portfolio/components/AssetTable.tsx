// src/features/portfolio/components/AssetTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUnits } from "viem";

// APIから受け取るアセットデータの型
type Asset = {
  address: string;
  balance: string;
  price: string;
  // トークンの詳細情報を追加（シンボル、小数点以下桁数など）
  tokenInfo?: {
    symbol: string;
    decimals: number;
    logoURI: string;
  };
};

type AssetTableProps = {
  assets: Asset[];
  isLoading: boolean;
};

const SkeletonRows = () => (
  <>
    {[...Array(3)].map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-8 w-48" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-24" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-8 w-24 ml-auto" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

export function AssetTable({ assets, isLoading }: AssetTableProps) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Asset</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead className="text-right">Value (USD)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SkeletonRows />
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableCaption>A list of your assets in the wallet.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[400px]">Asset</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead className="text-right">Value (USD)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.length > 0 ? (
          assets
            .filter((asset) => BigInt(asset.balance) > 0)
            .map((asset) => (
              <TableRow key={asset.address}>
                <TableCell className="font-medium">
                  {/* トークンシンボル。現状はアドレスを短縮表示 */}
                  {`${asset.address.slice(0, 6)}...${asset.address.slice(-4)}`}
                </TableCell>
                <TableCell>
                  {/* 1inch APIは最小単位で残高を返すため、ここでは仮に18桁でフォーマット */}
                  {Number(formatUnits(BigInt(asset.balance), 18)).toFixed(4)}
                </TableCell>
                <TableCell className="text-right">
                  {/* TODO: 価値の計算ロジックを実装 */}
                  $0.00
                </TableCell>
              </TableRow>
            ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              No assets found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
