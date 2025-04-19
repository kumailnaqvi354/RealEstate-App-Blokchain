"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"

type PropertyFiltersProps = {
  onApply: (filters: any) => void
}

export function PropertyFilters({ onApply }: PropertyFiltersProps) {
  const [priceRange, setPriceRange] = useState([100000, 1000000])
  const [types, setTypes] = useState<string[]>([])
  const [bedrooms, setBedrooms] = useState<number[]>([])

  const toggle = (list: any[], item: any, setList: (x: any[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item))
    } else {
      setList([...list, item])
    }
  }

  const handleApply = () => {
    onApply({
      priceRange,
      types,
      bedrooms,
    })
  }

  const resetFilters = () => {
    setPriceRange([100000, 1000000])
    setTypes([])
    setBedrooms([])
    onApply({}) // apply no filters
  }

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Filters</div>

      <Accordion type="multiple" defaultValue={["price", "type", "features", "bedrooms"]}>
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <Slider
              defaultValue={[100000, 1000000]}
              max={2000000}
              min={0}
              step={10000}
              value={priceRange}
              onValueChange={setPriceRange}
            />
            <div className="flex justify-between text-sm pt-2">
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="type">
          <AccordionTrigger>Property Type</AccordionTrigger>
          <AccordionContent>
            {["individual", "instalment", "fractional"].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={types.includes(type)}
                  onCheckedChange={() => toggle(types, type, setTypes)}
                />
                <label htmlFor={`type-${type}`} className="text-sm font-medium">{type}</label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="bedrooms">
          <AccordionTrigger>Bedrooms</AccordionTrigger>
          <AccordionContent>
            {[1, 2, 3, 4].map((count) => (
              <div key={count} className="flex items-center space-x-2">
                <Checkbox
                  id={`bed-${count}`}
                  checked={bedrooms.includes(count)}
                  onCheckedChange={() => toggle(bedrooms, count, setBedrooms)}
                />
                <label htmlFor={`bed-${count}`} className="text-sm font-medium">
                  {count === 4 ? "4+ Bedrooms" : `${count} Bedroom${count > 1 ? "s" : ""}`}
                </label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full mt-4" onClick={handleApply}>
        Apply Filters
      </Button>
      <Button variant="outline" className="w-full" onClick={resetFilters}>
        Reset
      </Button>
    </div>
  )
}
