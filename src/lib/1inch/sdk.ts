// src/lib/1inch/sdk.ts

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
