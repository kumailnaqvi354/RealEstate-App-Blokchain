'use client'
import { createConfig, http} from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";

export const config = createConfig(
    getDefaultConfig({
      // Your dApps chains
      chains: [bscTestnet],
      transports: {
        // RPC URL for each chain
        [bscTestnet.id]: http(
          "https://bsc-testnet.bnbchain.org/",
        ),
    
      },
      // Required API Keys
      walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "default_project_id",
      // Required App Info
      appName: "",

    }),
  );
