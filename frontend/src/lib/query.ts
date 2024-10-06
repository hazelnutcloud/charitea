import { PinataSDK } from "pinata-web3";
import { formatEther, http, createPublicClient } from "viem";
import { scrollSepolia } from "viem/chains";
import { chariteaAbi } from "./abi";
import { chariteaAddress } from "./consts";

export interface Fund {
  index: number;
  title: string;
  description: string;
  timestamp: number;
  owner: string;
  imageUri: string;
  donations: string;
}

const client = createPublicClient({
  transport: http(),
  chain: scrollSepolia,
});

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

  const json = await res.json();

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

  return await Promise.all(
    rawFunds.map(async (fund) => {
      let img = fund.imageURI
      if (!img) {
        const [, , hash] = await client.readContract({
          abi: chariteaAbi,
          functionName: "funds",
          args: [BigInt(fund.fundIndex)],
          address: chariteaAddress,
        });
        const { data } = await fetchImage(hash);
        img = (data as unknown as { image: string }).image;
      }
      console.log(img)
      return {
        description: fund.description,
        donations: formatEther(BigInt(fund.amount)),
        imageUri: img,
        index: fund.fundIndex,
        owner: fund.owner.address,
        timestamp: fund.creationTimestamp,
        title: fund.title,
      };
    })
  );
}

const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY,
});

const fetchImage = async (ipfsHash: string) => {
  const data = await pinata.gateways.get(ipfsHash);
  console.log(data);
  return data;
};
