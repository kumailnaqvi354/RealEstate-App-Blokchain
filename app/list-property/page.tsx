"use client"
import dynamic from 'next/dynamic';
const ListProperty = dynamic(() => import('@/components/list-property'), { ssr: false });
import Web3Provider from '@/components/Provider';

export default function ListPropertyPage() {
  return(
    <Web3Provider>
      <ListProperty />
    </Web3Provider>
  )
}
