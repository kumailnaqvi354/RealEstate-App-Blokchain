import Link from "next/link"
import { ArrowLeft, MapPin, Bed, Bath, Square, Building, Shield, Clock, Share2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PropertyGallery from "@/components/property-gallery"
import PropertyMap from "@/components/property-map"
import PropertyBlockchainInfo from "@/components/property-blockchain-info"
import RelatedProperties from "@/components/related-properties"

export default function PropertyPage({ params }: { params: { id: string } }) {
  // Mock property data - in a real app, you would fetch this based on the ID
  const property = {
    id: params.id,
    title: "Modern Apartment in Downtown",
    description:
      "This beautiful modern apartment is located in the heart of downtown. It features high ceilings, large windows with plenty of natural light, and premium finishes throughout. The open floor plan is perfect for entertaining, and the building offers amenities including a fitness center, rooftop terrace, and 24-hour concierge service.",
    location: "123 Main Street, New York, NY 10001",
    price: "450,000",
    currency: "USD",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    type: "Apartment",
    yearBuilt: 2018,
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    features: [
      "Central Air Conditioning",
      "In-unit Laundry",
      "Hardwood Floors",
      "Stainless Steel Appliances",
      "Walk-in Closet",
      "Balcony",
      "Fitness Center",
      "Rooftop Terrace",
      "24-hour Concierge",
      "Pet Friendly",
    ],
    verified: true,
    tokenId: "0x1a2b3c4d5e6f",
    blockchain: "Ethereum",
    lastUpdated: "2 days ago",
    owner: "0x7a8b9c0d1e2f3g4h5i6j",
    transactionHistory: [
      { date: "Jan 15, 2024", action: "Listed", price: "450,000", from: "0x7a8b9c0d1e2f3g4h5i6j", to: null },
      {
        date: "Dec 10, 2023",
        action: "Purchased",
        price: "425,000",
        from: "0x3g4h5i6j7k8l9m0n1o2p",
        to: "0x7a8b9c0d1e2f3g4h5i6j",
      },
      { date: "Nov 5, 2023", action: "Listed", price: "430,000", from: "0x3g4h5i6j7k8l9m0n1o2p", to: null },
    ],
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/properties">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Listings
          </Button>
        </Link>
      </div>

      {/* Property Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{property.title}</h1>
          <div className="flex items-center mt-2 text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{property.location}</span>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="text-3xl font-bold">
            {property.currency} {property.price}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Blockchain Verified
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Updated {property.lastUpdated}
            </Badge>
          </div>
        </div>
      </div>

      {/* Property Gallery */}
      <PropertyGallery images={property.images} />

      {/* Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="p-4 border rounded-md mt-2">
              <h3 className="text-xl font-semibold mb-4">Property Description</h3>
              <p className="text-muted-foreground mb-6">{property.description}</p>

              <h3 className="text-xl font-semibold mb-4">Property Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 border rounded-md">
                  <Bed className="h-5 w-5 mb-2" />
                  <span className="text-sm text-muted-foreground">Bedrooms</span>
                  <span className="font-semibold">{property.bedrooms}</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-md">
                  <Bath className="h-5 w-5 mb-2" />
                  <span className="text-sm text-muted-foreground">Bathrooms</span>
                  <span className="font-semibold">{property.bathrooms}</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-md">
                  <Square className="h-5 w-5 mb-2" />
                  <span className="text-sm text-muted-foreground">Square Feet</span>
                  <span className="font-semibold">{property.area}</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-md">
                  <Building className="h-5 w-5 mb-2" />
                  <span className="text-sm text-muted-foreground">Property Type</span>
                  <span className="font-semibold">{property.type}</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="features" className="p-4 border rounded-md mt-2">
              <h3 className="text-xl font-semibold mb-4">Property Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="blockchain" className="p-4 border rounded-md mt-2">
              <PropertyBlockchainInfo
                tokenId={property.tokenId}
                blockchain={property.blockchain}
                owner={property.owner}
                transactionHistory={property.transactionHistory}
              />
            </TabsContent>
            <TabsContent value="location" className="p-4 border rounded-md mt-2">
              <h3 className="text-xl font-semibold mb-4">Location</h3>
              <PropertyMap location={property.location} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-1">
          <div className="border rounded-md p-4">
            <h3 className="text-xl font-semibold mb-4">Contact Agent</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-muted"></div>
              <div>
                <div className="font-semibold">John Smith</div>
                <div className="text-sm text-muted-foreground">Real Estate Agent</div>
              </div>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Your email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="I'm interested in this property..."
                ></textarea>
              </div>
              <Button className="w-full">Send Message</Button>
            </form>
          </div>

          <div className="border rounded-md p-4 mt-4">
            <div className="flex justify-between mb-4">
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Heart className="h-4 w-4" />
                Save
              </Button>
            </div>
            <Button variant="default" className="w-full">
              Make an Offer
            </Button>
          </div>
        </div>
      </div>

      {/* Related Properties */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
        <RelatedProperties propertyId={params.id} />
      </div>
    </div>
  )
}
