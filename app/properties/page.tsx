import { PropertyFilters } from "@/components/property-filters"
import { PropertyCard } from "@/components/property-card"
import { Pagination } from "@/components/pagination"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PropertiesPage() {
  // Mock property data
  const properties = [
    {
      id: "1",
      title: "Modern Apartment in Downtown",
      location: "New York, NY",
      price: "450,000",
      currency: "USD",
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      type: "Apartment",
      image: "/placeholder.svg?height=300&width=400",
      verified: true,
      tokenId: "0x1a2b3c4d5e6f",
      lastUpdated: "2 days ago",
    },
    {
      id: "2",
      title: "Luxury Villa with Pool",
      location: "Miami, FL",
      price: "1,250,000",
      currency: "USD",
      bedrooms: 4,
      bathrooms: 3,
      area: 3200,
      type: "Villa",
      image: "/placeholder.svg?height=300&width=400",
      verified: true,
      tokenId: "0x2b3c4d5e6f7g",
      lastUpdated: "5 days ago",
    },
    {
      id: "3",
      title: "Cozy Suburban House",
      location: "Austin, TX",
      price: "650,000",
      currency: "USD",
      bedrooms: 3,
      bathrooms: 2,
      area: 2100,
      type: "House",
      image: "/placeholder.svg?height=300&width=400",
      verified: true,
      tokenId: "0x3c4d5e6f7g8h",
      lastUpdated: "1 week ago",
    },
    {
      id: "4",
      title: "Penthouse with City Views",
      location: "Chicago, IL",
      price: "850,000",
      currency: "USD",
      bedrooms: 3,
      bathrooms: 3,
      area: 1800,
      type: "Penthouse",
      image: "/placeholder.svg?height=300&width=400",
      verified: true,
      tokenId: "0x4d5e6f7g8h9i",
      lastUpdated: "3 days ago",
    },
    {
      id: "5",
      title: "Beachfront Condo",
      location: "San Diego, CA",
      price: "750,000",
      currency: "USD",
      bedrooms: 2,
      bathrooms: 2,
      area: 1500,
      type: "Condo",
      image: "/placeholder.svg?height=300&width=400",
      verified: true,
      tokenId: "0x5e6f7g8h9i0j",
      lastUpdated: "6 days ago",
    },
    {
      id: "6",
      title: "Mountain Retreat Cabin",
      location: "Denver, CO",
      price: "520,000",
      currency: "USD",
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      type: "Cabin",
      image: "/placeholder.svg?height=300&width=400",
      verified: true,
      tokenId: "0x6f7g8h9i0j1k",
      lastUpdated: "2 weeks ago",
    },
  ]

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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <Pagination totalPages={10} currentPage={1} />
          </div>
        </div>
      </div>
    </div>
  )
}

