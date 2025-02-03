import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, MapPin } from "lucide-react";

interface PropertyCardProps {
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string;
  type: string;
}

export function PropertyCard({
  title,
  location,
  price,
  bedrooms,
  bathrooms,
  imageUrl,
  type,
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg animate-fade-in">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          <Badge className="absolute top-2 right-2 bg-primary">{type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
        <div className="flex items-center gap-1 text-muted-foreground mt-1">
          <MapPin size={16} />
          <span className="text-sm line-clamp-1">{location}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <Bed size={16} />
            <span className="text-sm">{bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={16} />
            <span className="text-sm">{bathrooms}</span>
          </div>
        </div>
        <p className="font-semibold text-primary">৳{price.toLocaleString()}/month</p>
      </CardFooter>
    </Card>
  );
}