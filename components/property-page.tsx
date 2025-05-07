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
import { useEthersProvider, useEthersSigner } from "@/lib/ether-provider"
import { ethers, formatEther, formatUnits, parseEther, parseUnits } from 'ethers';
import { FRACTIONAL_CONTRACT_ABI, FRACTIONAL_CONTRACT_ADDRESS, REAL_ESTATE_CONTRACT_ABI, REAL_ESTATE_CONTRACT_ADDRESS } from "@/lib/contract"
import { parse } from "path"



export default function Property({ params }: { params: { id: string } }) {
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
    propertyType: string;
    images: string[];
    verified: boolean;
    propertyId: string;
    blockchain: string;
    lastUpdated: string;
    sellerAddress: string;
    documents: string;
    fractional?: string;
    fractionsOwned?: number;
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
  const [isForSale, setIsForSale] = useState(true);
  const [fractionCount, setFractionCount] = useState(0);
  const [owner, setOwner] = useState();
  const [buyerAddress, setBuyerAddress] = useState("");
  const [isDepositor, setIsDepositor] = useState(false);
  const [depositPaid, setDepositPaid] = useState(false);
  const [downPayment, setDownPayment] = useState(0);
  const [installmentAmount, setInstallmentAmount] = useState(0);
  const [installmentBuyer, setInstallmentBuyer] = useState("0x0000000000000000000000000000000000000000");
  const [noOfInstallments, setNoOfInstallments] = useState(0);
  const [installmentPaid, setInstallmentPaid] = useState(false);
  const [isPaymentPlanActive, setIsPaymentPlanActive] = useState(false);
  const [pricePerFraction, setPricePerFraction] = useState("");


  const provider = useEthersProvider()
  const signer = useEthersSigner()

  const isSeller = property?.sellerAddress?.toLowerCase() === signer?.address?.toLowerCase();

  const showCreateDispute = property?.propertyType === "builder" && isSeller;


  const routerParams = useParams();
  const getData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/property/${routerParams?.id}`);
      if (!res.ok) throw new Error("Failed to fetch property");

      const data = await res.json();
      console.log("Debug Property Data", data);
      setProperty(data?.data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getPropertyDataBlockchain = async () => {
    console.log("Debug Property ID", property?.propertyId);
    const contract = new ethers.Contract(
      REAL_ESTATE_CONTRACT_ADDRESS,
      REAL_ESTATE_CONTRACT_ABI,
      provider
    );
    const data = await contract?.properties(property?.propertyId?.toString());

    setIsForSale(data?.forSale);
    setOwner(data?.owner);
    if (data.propertyType?.toString() === "1") {
      setDownPayment(parseFloat(formatUnits(data?.paymentPlan?.downPayment?.toString(), 18)));
      setInstallmentAmount(parseFloat(formatUnits(data?.paymentPlan?.installmentAmount?.toString(), 18)));
      setIsPaymentPlanActive(data?.paymentPlan?.isActive);
      setNoOfInstallments(data?.paymentPlan?.numOfInstallments?.toString());

      const installmentInfo = await contract?.installmentStatus(property?.propertyId?.toString());
      setInstallmentPaid(installmentInfo?.paidInstallments);
      setInstallmentBuyer(installmentInfo?.buyer);
    }
    if (property?.fractional === "yes") {
      const _contract = new ethers.Contract(
        FRACTIONAL_CONTRACT_ADDRESS,
        FRACTIONAL_CONTRACT_ABI,
        provider
      )
      //@ts-ignore
      const _data = await _contract.properties(property?.propertyId?.toString());
      setPricePerFraction(formatUnits(_data?.pricePerFraction, 18));
      console.log("Transaction:", data);
    }
  }

  const handlePurchase = async () => {
    if (signer?.address === property?.sellerAddress) {
      alert("You cannot purchase your own property");
      return;
    }
    try {
      console.log("Debug Property ID", property?.propertyId);
      const contract = new ethers.Contract(
        REAL_ESTATE_CONTRACT_ADDRESS,
        REAL_ESTATE_CONTRACT_ABI,
        provider
      ) as ethers.Contract & {
        purchaseProperty: (...args: any) => Promise<any>;
      };
      if (!signer) {
        throw new Error("Signer is not available");
      }
      // @ts-ignore
      const tx = await contract?.connect(signer)?.purchaseProperty(
        parseInt(property?.propertyId || "0"),
        {
          value: parseEther(property?.price.toString() || "0"),
        }
      );


    } catch (error) {
      console.error("Error purchasing property:", error);
    }
  }

  const handleDeposit = async () => {
    if (!signer || !property) return;
    if (signer?.address === property?.sellerAddress) {
      alert("You cannot purchase your own property");
      return;
    }
    try {
      console.log("Debug Property ID", property?.propertyId);
      const contract = new ethers.Contract(
        REAL_ESTATE_CONTRACT_ADDRESS,
        REAL_ESTATE_CONTRACT_ABI,
        provider
      ) as ethers.Contract & {
        purchaseProperty: (...args: any) => Promise<any>;
      };
      if (!signer) {
        throw new Error("Signer is not available");
      }
      // @ts-ignore
      const tx = await contract?.connect(signer)?.purchaseProperty(
        parseInt(property?.propertyId || "0"),
        {
          value: parseEther(downPayment?.toString() || "0"),
        }
      );
      await tx.wait();
      setDepositPaid(true);
      setBuyerAddress(signer.address);
      setIsDepositor(true);
    } catch (error) {
      console.error("Error in handleDeposit:", error);
    }
  };

  const handleInstallment = async () => {
    if (!signer || !property) return;
    if (signer?.address === property?.sellerAddress) {
      alert("You cannot purchase your own property");
      return;
    }
    try {
      console.log("Debug Property ID", property?.propertyId);
      const contract = new ethers.Contract(
        REAL_ESTATE_CONTRACT_ADDRESS,
        REAL_ESTATE_CONTRACT_ABI,
        provider
      ) as ethers.Contract & {
        payInstallment: (...args: any) => Promise<any>;

      }
      if (!signer) {
        throw new Error("Signer is not available");
      }
      // @ts-ignore
      const tx = await contract?.connect(signer)?.payInstallment(
        parseInt(property?.propertyId || "0"),
        {
          value: parseEther(installmentAmount?.toString() || "0"),
        }
      );
    } catch (error) {
      console.error("Error in handleInstallment:", error);
    }
  }

  const handleFractionPurchase = async () => {
    if (!signer || !property) return;
    if (signer?.address === property?.sellerAddress) {
      alert("You cannot purchase your own property");
      return;
    }
    const _contract = new ethers.Contract(
      FRACTIONAL_CONTRACT_ADDRESS,
      FRACTIONAL_CONTRACT_ABI,
      provider
    ) as ethers.Contract & {
      buyFractions: (...args: any[]) => Promise<any>;
    };

    //@ts-ignore
    if (!signer) {
      throw new Error("Signer is not available");
    }
    const totalAmount = parseEther(pricePerFraction?.toString() || "0"); // rounds safely
    const contract = _contract.connect(signer || "") as typeof _contract;
    const tx = await contract.buyFractions(property?.propertyId, fractionCount?.toString(),
      {
        value: totalAmount?.toString() || "0",
      });
    await tx.wait();
    console.log("Transaction:", tx);
  }

  const handleDispute = async () => {
    if (signer?.address !== property?.sellerAddress) {
      alert("You cannot create dispute on this property");
      return;
    }
    try {
      console.log("Debug Property ID", property?.propertyId);
      const contract = new ethers.Contract(
        REAL_ESTATE_CONTRACT_ADDRESS,
        REAL_ESTATE_CONTRACT_ABI,
        provider
      ) as ethers.Contract & {
        raiseDispute: (...args: any) => Promise<any>;
      };
      if (!signer) {
        throw new Error("Signer is not available");
      }
      // @ts-ignore
      const tx = await contract?.connect(signer)?.raiseDispute(
        parseInt(property?.propertyId || "0")
      );
      await tx.wait();
      console.log("Dispute raised successfully:", tx);

    } catch (error) {
      console.error("Error purchasing property:", error);
    }
  }

  useEffect(() => {

    if (routerParams?.id) {
      getData();
    }
    if (property?.propertyId) {
      getPropertyDataBlockchain();
    }
  }, [property?.propertyId, routerParams?.id, depositPaid, isPaymentPlanActive]);


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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              {/* <TabsTrigger value="features">Features</TabsTrigger> */}
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
                  <span className="font-semibold">{property?.propertyType}</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="blockchain" className="p-4 border rounded-md mt-2">
              <PropertyBlockchainInfo
                tokenId={property?.propertyId || ""}
                blockchain={"EVM"}
                owner={owner || ""}
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

        <div className="md:col-span-1">
          {property?.propertyType?.toLowerCase() === "builder" ? (
            <div className="border rounded-md p-4 mt-4 space-y-4">
              <h3 className="text-md font-semibold">Builder Property</h3>
              {showCreateDispute ? (
                <Button onClick={handleDispute} variant="default" className="w-full">
                  Create Dispute
                </Button>) : installmentBuyer == "0x0000000000000000000000000000000000000000" ? (
                  <>
                    <p className="text-sm text-muted-foreground">Deposit required to proceed.</p>
                    <p>Deposit Amount {downPayment}</p>

                  </>
                ) : (
                <>
                  {!isForSale && isPaymentPlanActive ? (<>
                    <p className="text-sm text-muted-foreground">Deposit paid. Continue paying installments.</p>
                    <p>Installment Amount {installmentAmount}</p>
                    <p>Number of Installments {noOfInstallments}</p>
                    <p>Installment Paid {installmentPaid}</p>
                    <Button onClick={handleInstallment} variant="default" className="w-full">
                      Pay Installment
                    </Button>
                  </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Sold. New Owner by: <span className="font-medium">{owner}</span>
                    </p>
                  )}
                </>
              )}
            </div>
          ) : property?.fractional == "yes" ? (
            <div className="border rounded-md p-4 mt-4 space-y-4">
              <div>
                <h3 className="text-md font-semibold">Fractional Ownership</h3>
                <p className="text-sm text-muted-foreground">
                  {100 - parseInt(property?.fractionsOwned?.toString() || "0")} fractions available
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
                  max={100 - parseInt(property?.fractionsOwned?.toString() || "0")}
                  value={fractionCount}
                  onChange={(e) => setFractionCount(Number(e.target.value))}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="Enter amount"
                />
                <p> {pricePerFraction}</p>
              </div>
              {isForSale ? (
                <Button onClick={handleFractionPurchase} variant="default" className="w-full">
                  Purchase {fractionCount} {fractionCount > 1 ? "fractions" : "fraction"}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Not for sale. Owned by: <span className="font-medium">{owner}</span>
                </p>
              )}
            </div>
          ) : (
            <div className="border rounded-md p-4 mt-4">
              {isForSale ? (
                <Button onClick={handlePurchase} variant="default" className="w-full">
                  Purchase Property
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sold. New Owner by: <span className="font-medium">{owner}</span>
                </p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
