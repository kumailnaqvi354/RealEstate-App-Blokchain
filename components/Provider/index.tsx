'use client'
import { config } from '@/lib/web3-config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import React from 'react'
import { WagmiProvider } from 'wagmi';


function Web3Provider({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider>
                    {children}
                </ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export default Web3Provider