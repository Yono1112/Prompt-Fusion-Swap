// src/lib/1inch/sdk.ts
import { parseUnits } from "viem";

/**
 * 指定されたウォレットアドレスのトークン残高を取得
 * @param chainId - 取得対象のブロックチェーンID
 * @param walletAddress - トークン残高を取得するウォレットのアドレス
 * @returns ウォレットのトークン残高のオブジェクト
 */
export async function getWalletBalances(
  chainId: number,
  walletAddress: string,
): Promise<Record<string, string>> {
  const apiKey = process.env.ONEINCH_API_KEY;
  if (!apiKey) {
    throw new Error("1INCH_API_KEY is not set in environment variables.");
  }

  const url = `https://api.1inch.dev/balance/v1.2/${chainId}/balances/${walletAddress}`;

  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Failed to fetch token balances:", errorData);
      throw new Error(
        `Failed to fetch token balances. Status: ${response.status}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred while fetching wallet balances:", error);
    throw error;
  }
}

/**
 * 指定されたトークンアドレスのリストに対応する価格を取得
 * @param chainId - 取得対象のブロックチェーンID
 * @param tokenAddresses - 価格を取得したいトークンのアドレスの配列
 * @returns トークンアドレスをキー、価格を値とするオブジェクト
 */
export async function getTokensPrices(
  chainId: number,
  tokenAddresses: string[],
): Promise<Record<string, string>> {
  const apiKey = process.env.ONEINCH_API_KEY;
  if (!apiKey) {
    throw new Error("1INCH_API_KEY is not set in environment variables.");
  }

  const url = `https://api.1inch.dev/price/v1.1/${chainId}`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const body = JSON.stringify({
    tokens: tokenAddresses,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Failed to fetch token prices:", errorData);
      throw new Error(
        `Failed to fetch token prices. Status: ${response.status}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred while fetching token prices:", error);
    throw error;
  }
}

/**
 * 1inch Swap APIからスワップの見積もり（クオート）を取得
 * @param chainId チェーンID
 * @param fromTokenAddress スワップ元のトークンアドレス
 * @param toTokenAddress スワップ先のトークンアドレス
 * @param amount スワップする量（フォーマットされていない人間が読める単位、例: "1.5"）
 * @param fromAddress スワップを実行するユーザーのウォレットアドレス
 * @returns 1inch APIからのスワップ見積もりデータ
 */
export async function getSwapQuote(
  chainId: number,
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: string,
) {
  const apiKey = process.env.ONEINCH_API_KEY;
  if (!apiKey) {
    throw new Error("1INCH_API_KEY is not set in environment variables.");
  }

  // APIは最小単位の数値を要求するため、量を変換（ここでは仮に18桁）
  // TODO: 本来は各トークンのdecimalsに合わせて変換する必要がある
  const amountInSmallestUnit = parseUnits(amount, 18).toString();

  const params = new URLSearchParams({
    src: fromTokenAddress,
    dst: toTokenAddress,
    amount: amountInSmallestUnit,
    includeTokensInfo: "true",
  });

  const url = `https://api.1inch.dev/swap/v6.1/${chainId}/quote?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Failed to fetch swap quote:", errorData);
      throw new Error(`Failed to fetch swap quote. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("An error occurred while fetching swap quote:", error);
    throw error;
  }
}
