import { formatEther } from "viem";

export interface Fund {
  index: number;
  title: string;
  description: string;
  timestamp: number;
  owner: string;
  imageUri: string;
  donations: string;
}

export async function getFunds(): Promise<Fund[]> {
  const res = await fetch(
    "https://api.studio.thegraph.com/query/90801/charitea/v0.0.1",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        /*graphQL*/
        query: `query Funds {
              funds {
                title
                description
                imageURI
                owner {
                  address
                }
                creationTimestamp
              }
            }`,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  const rawFunds: {
    title: string;
    description: string;
    imageURI: string;
    owner: {
      address: string;
    };
    creationTimestamp: number;
    amount: number;
    fundIndex: number;
  }[] = (await res.json()).data.funds;

  return rawFunds.map((fund) => ({
    description: fund.description,
    donations: formatEther(BigInt(fund.amount)),
    imageUri: fund.imageURI,
    index: fund.fundIndex,
    owner: fund.owner.address,
    timestamp: fund.creationTimestamp,
    title: fund.title,
  }));
}
