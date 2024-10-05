import { WagmiProvider, createConfig, http } from "wagmi";
import { scrollSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ReactNode } from "react";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [scrollSepolia],
    transports: {
      // RPC URL for each chain
      [scrollSepolia.id]: http(),
    },

    // Required API Keys
    walletConnectProjectId: import.meta.env.VITE_PROJECT_ID,

    // Required App Info
    appName: "Charitea",

    // Optional App Info
    appDescription: "Trustless charity funding platform",
    appUrl: "https://charitea.io", // your app's url
    appIcon: "https://charitea.io/icon.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
