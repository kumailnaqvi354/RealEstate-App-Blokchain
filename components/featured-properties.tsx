import Link from "next/link"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"

export default function FeaturedProperties() {
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
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Properties</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Explore our handpicked selection of blockchain-verified properties.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/properties">
            <Button size="lg">View All Properties</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

