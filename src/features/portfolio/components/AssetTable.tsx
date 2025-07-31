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

type Asset = {
  address: string;
  balance: string;
  price: string;
};

type AssetTableProps = {
  assets: Asset[];
};

export function AssetTable({ assets }: AssetTableProps) {
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
        {/* TODO: 今後のステップでここにデータを表示するロジックを実装 */}
        <TableRow>
          <TableCell colSpan={3} className="text-center">
            Loading data...
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
