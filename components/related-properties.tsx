import { PropertyCard } from "@/components/property-card"

interface RelatedPropertiesProps {
  propertyId: string
}

export default function RelatedProperties({ propertyId }: RelatedPropertiesProps) {
  // Mock property data - in a real app, you would fetch related properties based on the current property
  const properties = [
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

  // Filter out the current property if it's in the list
  const filteredProperties = properties.filter((property) => property.id !== propertyId)

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
