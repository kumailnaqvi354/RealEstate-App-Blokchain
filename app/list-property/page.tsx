"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, Plus, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ListPropertyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const totalSteps = 4

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setImages([...images, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = [...images]
    updatedImages.splice(index, 1)
    setImages(updatedImages)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Redirect to properties page after success
      setTimeout(() => {
        router.push("/properties")
      }, 3000)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-16 max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl mb-2">Property Listed Successfully!</CardTitle>
          <CardDescription className="text-lg mb-6">
            Your property has been submitted for verification on the blockchain.
          </CardDescription>
          <p className="mb-8 text-muted-foreground">
            Once verified, your property will appear in the listings.
          </p>
          <Button onClick={() => router.push("/properties")} className="mx-auto">
            View All Properties
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/properties">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Listings
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">List Your Property</h1>
        <p className="text-muted-foreground">
          Complete the form below to list your property on our blockchain-powered marketplace.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep > index + 1
                  ? "bg-primary text-primary-foreground"
                  : currentStep === index + 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className="w-full bg-muted rounded-full h-2 mb-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <div>Property Details</div>
          <div>Images</div>
          <div>Blockchain Info</div>
          <div>Review</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Property Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Provide the basic details about your property.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title</Label>
                    <Input id="title" placeholder="e.g. Modern Apartment in Downtown" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Property Type</Label>
                    <Select defaultValue="apartment">
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Individual</SelectItem>
                        <SelectItem value="house">Builder (Payment Plan)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe your property in detail..." rows={5} required />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select defaultValue="2">
                      <SelectTrigger>
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem value="0">Studio</SeclectItem> */}
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Select defaultValue="2">
                      <SelectTrigger>
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Area (sq ft)</Label>
                    <Input id="area" type="number" placeholder="e.g. 1200" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Where is your property located?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" placeholder="e.g. 123 Main Street" required />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="e.g. New York" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="e.g. NY" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="e.g. 10001" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set the price for your property.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" placeholder="e.g. 4 eth" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="ETH">
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ETH">ETH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Images */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Images</CardTitle>
                <CardDescription>
                  Upload high-quality images of your property. You can upload up to 10 images.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Drag and drop your images here</h3>
                    <p className="text-sm text-muted-foreground">or click to browse from your computer</p>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      id="image-upload"
                      onChange={handleImageUpload}
                    />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <Button type="button" variant="outline">
                        Select Images
                      </Button>
                    </Label>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Uploaded Images ({images.length}/10)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Property image ${index + 1}`}
                            className="h-24 w-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      {images.length < 10 && (
                        <Label
                          htmlFor="add-more-images"
                          className="h-24 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer"
                        >
                          <div className="flex flex-col items-center">
                            <Plus className="h-6 w-6 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground mt-1">Add More</span>
                          </div>
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            id="add-more-images"
                            onChange={handleImageUpload}
                          />
                        </Label>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Image Tips</CardTitle>
                <CardDescription>Follow these tips to showcase your property in the best light.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Use high-resolution images (at least 1920x1080 pixels)</li>
                  <li>Include photos of all rooms, exterior, and special features</li>
                  <li>Take photos during daylight for natural lighting</li>
                  <li>Ensure the property is clean and tidy before taking photos</li>
                  <li>Consider hiring a professional photographer for best results</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Blockchain Information */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card>
              {/* <CardHeader>
                <CardTitle>Blockchain Details</CardTitle>
                <CardDescription>Provide information for blockchain verification and tokenization.</CardDescription>
              </CardHeader> */}
              <CardContent className="space-y-4">
                {/* <Alert className="mb-4">
                  <AlertTitle>Important Information</AlertTitle>
                  <AlertDescription>
                    Your property will be tokenized on the blockchain, creating a unique digital asset that represents
                    ownership. This ensures transparency and security in all transactions.
                  </AlertDescription>
                </Alert> */}
{/* 
                <div className="space-y-2">
                  <Label htmlFor="wallet">Wallet Address</Label>
                  <Input id="wallet" placeholder="e.g. 0x1a2b3c4d5e6f..." required />
                  <p className="text-xs text-muted-foreground">
                    This is the wallet that will receive funds when the property is sold.
                  </p>
                </div> */}
{/* 
                <div className="space-y-2">
                  <Label>Blockchain Network</Label>
                  <RadioGroup defaultValue="ethereum">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ethereum" id="ethereum" />
                      <Label htmlFor="ethereum">Ethereum</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="polygon" id="polygon" />
                      <Label htmlFor="polygon">Polygon</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="solana" id="solana" />
                      <Label htmlFor="solana">Solana</Label>
                    </div>
                  </RadioGroup>
                </div> */}

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Label>Verification Documents</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload documents to verify your ownership of the property.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="deed" />
                      <Label htmlFor="deed" className="text-sm">
                        Property Deed
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="title" />
                      <Label htmlFor="title" className="text-sm">
                        Title Insurance
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tax" />
                      <Label htmlFor="tax" className="text-sm">
                        Property Tax Records
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="id" />
                      <Label htmlFor="id" className="text-sm">
                        Government-issued ID
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Label htmlFor="document-upload" className="block mb-2">
                    Upload Documents
                  </Label>
                  <Input type="file" id="document-upload" accept=".pdf,.doc,.docx,.jpg,.png" multiple />
                  <p className="text-xs text-muted-foreground mt-1">
                    Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Smart Contract Terms</CardTitle>
                <CardDescription>Define the terms for your property's smart contract.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <div className="space-y-2">
                  <Label htmlFor="royalty">Future Sale Royalty (%)</Label>
                  <Input id="royalty" type="number" placeholder="e.g. 2.5" min="0" max="10" step="0.1" />
                  <p className="text-xs text-muted-foreground">
                    Percentage you'll receive from future sales of this property (0-10%).
                  </p>
                </div> */}

                <div className="space-y-2">
                  <Label>Fractional Ownership</Label>
                  <RadioGroup defaultValue="no">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="fractional-yes" />
                      <Label htmlFor="fractional-yes">Yes, allow fractional ownership</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="fractional-no" />
                      <Label htmlFor="fractional-no">No, sell as a whole property</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Your Listing</CardTitle>
                <CardDescription>
                  Please review all information before submitting your property listing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Property Details</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                    <TabsTrigger value="blockchain">Blockchain Info</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">Property Title</h3>
                        <p>Modern Apartment in Downtown</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">Property Type</h3>
                        <p>Apartment</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">Bedrooms</h3>
                        <p>2</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">Bathrooms</h3>
                        <p>2</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">Area</h3>
                        <p>1,200 sq ft</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">Price</h3>
                        <p>USD 450,000</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground">Address</h3>
                      <p>123 Main Street, New York, NY 10001</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground">Description</h3>
                      <p className="text-sm">
                        This beautiful modern apartment is located in the heart of downtown. It features high ceilings,
                        large windows with plenty of natural light, and premium finishes throughout. The open floor plan
                        is perfect for entertaining, and the building offers amenities including a fitness center,
                        rooftop terrace, and 24-hour concierge service.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="images" className="pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.length > 0 ? (
                        images.map((image, index) => (
                          <img
                            key={index}
                            src={image || "/placeholder.svg"}
                            alt={`Property image ${index + 1}`}
                            className="h-24 w-full object-cover rounded-md"
                          />
                        ))
                      ) : (
                        <div className="col-span-4 text-center py-8 text-muted-foreground">
                          No images uploaded. Please go back to add images.
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="blockchain" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">Wallet Address</h3>
                        <p className="font-mono text-sm">0x1a2b3c4d5e6f...</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">Blockchain Network</h3>
                        <p>Ethereum</p>
                      </div>
                      {/* <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">Future Sale Royalty</h3>
                        <p>2.5%</p>
                      </div> */}
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">Fractional Ownership</h3>
                        <p>No, sell as a whole property</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground">Verification Documents</h3>
                      <ul className="list-disc pl-5 text-sm">
                        <li>Property Deed</li>
                        <li>Title Insurance</li>
                        <li>Government-issued ID</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2 w-full">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm">
                    I confirm that all information provided is accurate and I have the legal right to sell this
                    property.
                  </Label>
                </div>
                <div className="flex items-center space-x-2 w-full">
                  <Checkbox id="blockchain-terms" required />
                  <Label htmlFor="blockchain-terms" className="text-sm">
                    I understand that this property will be tokenized on the blockchain and all transactions will be
                    publicly visible.
                  </Label>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <Button type="button" variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < totalSteps ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Listing"}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
