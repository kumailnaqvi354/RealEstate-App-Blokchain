import Link from "next/link"
import { MapPin, Bed, Bath, Square, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface PropertyCardProps {
  property: {
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
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={property.image || "/placeholder.svg"}
            alt={property.title}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          {property.verified && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Verified
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{property.location}</span>
            </div>
          </div>
          <div className="text-xl font-bold mb-2">
            {property.currency} {property.price}
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-muted-foreground" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-muted-foreground" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4 text-muted-foreground" />
              <span>{property.area} sqft</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground border-t">
          <div className="flex justify-between w-full">
            <span>Token ID: {property.tokenId.substring(0, 8)}...</span>
            <span>Updated {property.lastUpdated}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
