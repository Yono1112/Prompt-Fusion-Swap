// src/app/api/portfolio/route.ts

// src/app/api/portfolio/route.ts

import { NextResponse } from "next/server";
import {
  getWalletBalances,
  getTokensPrices,
  getTokensInfo,
} from "@/lib/1inch/sdk";
import { NATIVE_ASSET_INFO_BY_CHAIN } from "@/lib/tokens";

// ネイティブアセットのアドレスを定数として定義
const NATIVE_ASSET_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

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

    // 1. 全てのトークンの残高を取得
    const allBalances = await getWalletBalances(chainId, walletAddress);
    const addressesWithBalance = Object.keys(allBalances).filter(
      (address) => BigInt(allBalances[address]) > 0,
    );

    if (addressesWithBalance.length === 0) {
      return NextResponse.json([]);
    }

    // 2. ネイティブアセットのアドレスを除外したERC20トークンのアドレスリストを作成
    const erc20TokenAddresses = addressesWithBalance.filter(
      (address) => address.toLowerCase() !== NATIVE_ASSET_ADDRESS,
    );

    // 3. 全てのアセットの価格と、ERC20トークンの詳細情報を並行して取得
    const [prices, erc20TokensInfo] = await Promise.all([
      getTokensPrices(chainId, addressesWithBalance), // 価格はネイティブアセットも含めて取得
      erc20TokenAddresses.length > 0
        ? getTokensInfo(chainId, erc20TokenAddresses) // ERC20トークンのみ情報取得
        : Promise.resolve({} as Record<string, any>), // ERC20がなければ空のオブジェクト
    ]);

    // 4. フロントエンド用のデータを作成
    const portfolioData = addressesWithBalance.map((address) => {
      const lowerCaseAddress = address.toLowerCase();

      // ネイティブアセットの場合、情報を手動で設定
      if (lowerCaseAddress === NATIVE_ASSET_ADDRESS) {
        return {
          address,
          balance: allBalances[address],
          price: prices[address] || "0",
          tokenInfo: NATIVE_ASSET_INFO_BY_CHAIN[chainId] || null,
        };
      }

      // ERC20トークンの場合
      return {
        address,
        balance: allBalances[address],
        price: prices[address] || "0",
        tokenInfo: erc20TokensInfo[lowerCaseAddress] || null,
      };
    });

    return NextResponse.json(portfolioData);
  } catch (error) {
    console.error("Error in portfolio API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
