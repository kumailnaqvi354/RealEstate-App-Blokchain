'use client'
import { createConfig, http} from "wagmi";
import { bsc } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";

export const config = createConfig(
    getDefaultConfig({
      // Your dApps chains
      chains: [bsc],
      transports: {
        // RPC URL for each chain
        [bsc.id]: http(
          `https://bnb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
        ),
    
      },
      // Required API Keys
      walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "default_project_id",
      // Required App Info
      appName: "",

    }),
  );
