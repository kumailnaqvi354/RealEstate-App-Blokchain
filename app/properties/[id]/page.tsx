"use client"
import dynamic from 'next/dynamic';
const PropertyPage = dynamic(() => import('@/components/property-page'), { ssr: false });
import Web3Provider from '@/components/Provider';

export default function PropertyPageWrapper({ params }: { params: { id: string } }) {
  return (
    <Web3Provider>
      <PropertyPage params={params} />
    </Web3Provider>
  )
}
