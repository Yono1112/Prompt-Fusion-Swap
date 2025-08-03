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
import Image from "next/image";

export type Asset = {
  address: string;
  balance: string;
  price: string;
  tokenInfo: {
    symbol: string;
    name: string;
    decimals: number;
    logoURI: string;
  } | null;
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
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Skeleton className="h-5 w-24" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-5 w-24 ml-auto" />
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
            .filter((asset) => BigInt(asset.balance) > 0 && asset.tokenInfo)
            .map((asset) => {
              const tokenInfo = asset.tokenInfo!;

              console.log(
                `tokenInfo ${tokenInfo.name}: ${tokenInfo.decimals}, price: ${asset.price}`,
              );

              const balanceInUnits = parseFloat(
                formatUnits(BigInt(asset.balance), tokenInfo.decimals),
              );

              const pricePerUnit = parseFloat(asset.price);
              const totalValue = balanceInUnits * pricePerUnit;

              return (
                <TableRow key={asset.address}>
                  <TableCell>
                    <div className="flex items-center gap-3 font-medium">
                      <Image
                        src={tokenInfo.logoURI}
                        alt={`${tokenInfo.name} logo`}
                        width={32}
                        height={32}
                        className="rounded-full bg-gray-200"
                      />
                      <div>
                        <div>{tokenInfo.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {tokenInfo.symbol}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{balanceInUnits.toFixed(5)}</TableCell>
                  <TableCell className="text-right">
                    {`$${totalValue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                  </TableCell>
                </TableRow>
              );
            })
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
