"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"

export function PropertyFilters() {
  const [priceRange, setPriceRange] = useState([100000, 1000000])

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Filters</div>

      <Accordion type="multiple" defaultValue={["price", "type", "features", "bedrooms"]}>
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                defaultValue={[100000, 1000000]}
                max={2000000}
                min={0}
                step={10000}
                value={priceRange}
                onValueChange={setPriceRange}
              />
              <div className="flex items-center justify-between">
                <div className="text-sm">${priceRange[0].toLocaleString()}</div>
                <div className="text-sm">${priceRange[1].toLocaleString()}</div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="type">
          <AccordionTrigger>Property Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="type-house" />
                <label
                  htmlFor="type-house"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  House
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="type-apartment" />
                <label
                  htmlFor="type-apartment"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Apartment
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="type-condo" />
                <label
                  htmlFor="type-condo"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Condo
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="type-villa" />
                <label
                  htmlFor="type-villa"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Villa
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="type-land" />
                <label
                  htmlFor="type-land"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Land
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="bedrooms">
          <AccordionTrigger>Bedrooms</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="bed-1" />
                <label
                  htmlFor="bed-1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  1 Bedroom
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="bed-2" />
                <label
                  htmlFor="bed-2"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  2 Bedrooms
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="bed-3" />
                <label
                  htmlFor="bed-3"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  3 Bedrooms
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="bed-4" />
                <label
                  htmlFor="bed-4"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  4+ Bedrooms
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="features">
          <AccordionTrigger>Features</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="feature-pool" />
                <label
                  htmlFor="feature-pool"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Swimming Pool
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="feature-garden" />
                <label
                  htmlFor="feature-garden"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Garden
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="feature-garage" />
                <label
                  htmlFor="feature-garage"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Garage
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="feature-balcony" />
                <label
                  htmlFor="feature-balcony"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Balcony
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="feature-air" />
                <label
                  htmlFor="feature-air"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Air Conditioning
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full mt-4">Apply Filters</Button>
      <Button variant="outline" className="w-full">
        Reset
      </Button>
    </div>
  )
}

