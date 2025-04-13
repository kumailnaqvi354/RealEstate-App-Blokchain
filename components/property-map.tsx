interface PropertyMapProps {
  location: string
}

export default function PropertyMap({ location }: PropertyMapProps) {
  return (
    <div className="w-full aspect-video rounded-md overflow-hidden bg-muted flex items-center justify-center">
      <div className="text-center p-4">
        <p className="text-muted-foreground mb-2">Map view for:</p>
        <p className="font-medium">{location}</p>
        <p className="text-xs text-muted-foreground mt-4">
          In a real application, this would display an interactive map using Google Maps, Mapbox, or a similar service.
        </p>
      </div>
    </div>
  )
}

