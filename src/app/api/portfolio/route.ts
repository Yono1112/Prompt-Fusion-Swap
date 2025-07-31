// src/app/api/portfolio/route.ts

import { NextResponse } from "next/server";
import { getWalletBalances, getTokensPrices } from "@/lib/1inch/sdk";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("address");
    const chainIdStr = searchParams.get("chainId");

    if (!walletAddress || !chainIdStr) {
      return NextResponse.json(
        { error: "Missing address or chainId query parameter" },
        { status: 400 },
      );
    }
    const chainId = parseInt(chainIdStr, 10);

    const balances = await getWalletBalances(chainId, walletAddress);
    const tokenAddresses = Object.keys(balances);

    if (tokenAddresses.length === 0) {
      return NextResponse.json([]); // 保有トークンがない場合は空の配列を返す
    }

    const prices = await getTokensPrices(chainId, tokenAddresses);

    const portfolioData = tokenAddresses.map((address) => ({
      address,
      balance: balances[address],
      price: prices[address] || "0", // 価格が取得できなかった場合のフォールバック
    }));

    return NextResponse.json(portfolioData);
  } catch (error) {
    console.error("Error in portfolio API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
