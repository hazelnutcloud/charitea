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
    "https://api.studio.thegraph.com/query/90801/charitea/v0.0.2",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        /*graphQL*/
        query: `query Funds {
              funds {
                fundIndex
                title
                description
                imageURI
                owner {
                  address
                }
                creationTimestamp
                amount
              }
            }`,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  const json = await res.json()

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
  }[] = json.data.funds;

  return rawFunds.map((fund) => ({
    description: fund.description,
    donations: formatEther(BigInt(fund.amount)),
    imageUri: "/fund-image.jpg",
    index: fund.fundIndex,
    owner: fund.owner.address,
    timestamp: fund.creationTimestamp,
    title: fund.title,
  }));
}
