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
                  Instalment
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
      </Accordion>

      <Button className="w-full mt-4">Apply Filters</Button>
      <Button variant="outline" className="w-full">
        Reset
      </Button>
    </div>
  )
}
