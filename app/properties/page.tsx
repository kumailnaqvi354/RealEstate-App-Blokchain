"use client"

import { useEffect, useState } from "react"
import { PropertyFilters } from "@/components/property-filters"
import { PropertyCard } from "@/components/property-card"
import { Pagination } from "@/components/pagination"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PropertiesPage() {
  interface Property {
    _id: null | undefined
    id: string
    title: string
    location: string
    price: string
    currency: string
    bedrooms: number
    bathrooms: number
    area: number
    type: string
    image: string
    verified: boolean
    tokenId: string
    lastUpdated: string
  }

  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const fetchProperties = async () => {
    try {
      console.log("Fetching properties...")
      const res = await fetch("/api/property", { cache: "no-store" })
      const data = await res.json()
      console.log("Debug data", data?.data);
      

      if (res.ok) {
        setProperties(data?.data || [])
      } else {
        setError(data.error || "Failed to fetch properties")
      }
    } catch (err) {
      console.error("Fetch error:", err)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {

    fetchProperties()
  }, [])

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Property Listings</h1>
        <p className="text-muted-foreground">Browse our selection of blockchain-verified properties</p>
      </div>

      {/* Search Bar */}
      <div className="w-full mb-8">
        <form className="flex w-full items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by location, property type, or price..."
              className="w-full bg-background shadow-sm rounded-md border border-input px-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters */}
        <div className="lg:col-span-1">
          <PropertyFilters />
        </div>

        {/* Property Listings */}
        <div className="lg:col-span-3">
          {loading && <p>Loading properties...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard key={property?._id} property={property} />
                ))}
              </div>

              {/* Pagination (optional) */}
              <div className="mt-8">
                <Pagination totalPages={10} currentPage={1} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
