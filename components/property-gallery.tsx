"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyGalleryProps {
  images: string[]
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={images[currentImage] || "/placeholder.svg"}
          alt={`Property image ${currentImage + 1}`}
          className="object-cover w-full h-full"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 rounded-full"
          onClick={prevImage}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 rounded-full"
          onClick={nextImage}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentImage ? "bg-primary" : "bg-background/80"}`}
              onClick={() => setCurrentImage(index)}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`aspect-video rounded-md overflow-hidden ${index === currentImage ? "ring-2 ring-primary" : ""}`}
            onClick={() => setCurrentImage(index)}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`Property thumbnail ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

