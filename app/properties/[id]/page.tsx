'use client'
import Link from "next/link"
import { ArrowLeft, MapPin, Bed, Bath, Square, Building, Shield, Clock, Share2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PropertyGallery from "@/components/property-gallery"
import PropertyMap from "@/components/property-map"
import PropertyBlockchainInfo from "@/components/property-blockchain-info"
import RelatedProperties from "@/components/related-properties"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { deposit } from "viem/zksync"

export default function PropertyPage({ params }: { params: { id: string } }) {
  type Property = {
    _id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    currency: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    type: string;
    images: string[];
    verified: boolean;
    tokenId: string;
    blockchain: string;
    lastUpdated: string;
    owner: string;
    documents: string;
    fractionalOwnership?: boolean;
    ownerNumberOfFraction?: number;
    depositPaid?: boolean;
    transactionHistory: {
      date: string;
      action: string;
      price: number;
      from: string | null;
      to: string | null;
    }[];

    // add more fields as needed
  };
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fractionCount, setFractionCount] = useState(1);



  const routerParams = useParams();
  const getData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/property/${routerParams?.id}`);
      if (!res.ok) throw new Error("Failed to fetch property");

      const data = await res.json();
      setProperty(data?.data);

    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    if (routerParams?.id) {
      getData();
    }
  }, []);


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
          <h1 className="text-3xl font-bold">{property?.title}</h1>
          <div className="flex items-center mt-2 text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{property?.location}</span>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="text-3xl font-bold">
            {property?.currency} {property?.price}
          </div>
          <div className="flex items-center gap-2">
          </div>
        </div>
      </div>

      {/* Property Gallery */}
      <PropertyGallery images={property?.images || []} />

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
              <p className="text-muted-foreground mb-6">{property?.description}</p>

              <h3 className="text-xl font-semibold mb-4">Property Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 border rounded-md">
                  <Bed className="h-5 w-5 mb-2" />
                  <span className="text-sm text-muted-foreground">Bedrooms</span>
                  <span className="font-semibold">{property?.bedrooms}</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-md">
                  <Bath className="h-5 w-5 mb-2" />
                  <span className="text-sm text-muted-foreground">Bathrooms</span>
                  <span className="font-semibold">{property?.bathrooms}</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-md">
                  <Square className="h-5 w-5 mb-2" />
                  <span className="text-sm text-muted-foreground">Square Feet</span>
                  <span className="font-semibold">{property?.area}</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-md">
                  <Building className="h-5 w-5 mb-2" />
                  <span className="text-sm text-muted-foreground">Property Type</span>
                  <span className="font-semibold">{property?.type}</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="blockchain" className="p-4 border rounded-md mt-2">
              <PropertyBlockchainInfo
                tokenId={property?.tokenId || ""}
                blockchain={property?.blockchain || ""}
                owner={property?.owner || ""}
                deedDocument={property?.documents || ""}
                transactionHistory={property?.transactionHistory?.map(({ date, action, price, from, to }) => ({
                  date,
                  action,
                  price: price.toString(),
                  from,
                  to,
                })) || []}
              />
            </TabsContent>
            <TabsContent value="location" className="p-4 border rounded-md mt-2">
              <h3 className="text-xl font-semibold mb-4">Location</h3>
              <PropertyMap location={property?.location || ""} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-1"> {property?.type?.toLowerCase() === "builder" ? (
          <div className="border rounded-md p-4 mt-4 space-y-4">
            <h3 className="text-md font-semibold">Builder Property</h3>
            {!property?.depositPaid ? (
              <>
                <p className="text-sm text-muted-foreground">Deposit required to proceed.</p>
                <Button variant="default" className="w-full">
                  Pay Deposit
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Deposit paid. Continue paying installments.</p>
                <Button variant="default" className="w-full">
                  Pay Installment
                </Button>
              </>
            )}
          </div>
        ) : property?.fractionalOwnership ? (
          <div className="border rounded-md p-4 mt-4 space-y-4">
            <div>
              <h3 className="text-md font-semibold">Fractional Ownership</h3>
              <p className="text-sm text-muted-foreground">
                {100 - parseInt(property?.ownerNumberOfFraction?.toString() || "0")} fractions available
              </p>
            </div>
            <div>
              <label htmlFor="fractionCount" className="block text-sm font-medium mb-1">
                Number of Fractions
              </label>
              <input
                id="fractionCount"
                type="number"
                min={1}
                max={100 - parseInt(property?.ownerNumberOfFraction?.toString() || "0")}
                value={fractionCount}
                onChange={(e) => setFractionCount(Number(e.target.value))}
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Enter amount"
              />
            </div>
            <Button variant="default" className="w-full">
              Purchase {fractionCount} {fractionCount > 1 ? "fractions" : "fraction"}
            </Button>
          </div>
        ) : (
          <div className="border rounded-md p-4 mt-4">
            <Button variant="default" className="w-full">
              Purchase Property
            </Button>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
