
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, MapPin, ArrowLeft, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      // Validate if the ID is in UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!id || !uuidRegex.test(id)) {
        toast.error("Invalid property ID format");
        throw new Error("Invalid property ID format");
      }

      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          property_images (
            image_url
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Error loading property");
        throw error;
      }
      
      if (!data) {
        toast.error("Property not found");
        throw new Error("Property not found");
      }

      return data;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Property not found</h1>
        <p className="text-muted-foreground mt-2">
          The property you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {property.property_images && property.property_images.length > 0 && (
            <Carousel className="relative w-full">
              <CarouselContent>
                {property.property_images.map((image: { image_url: string }, index: number) => (
                  <CarouselItem key={index}>
                    <div className="aspect-video relative">
                      <img
                        src={image.image_url}
                        alt={`${property.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {property.property_images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </>
              )}
            </Carousel>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">{property.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="text-muted-foreground" size={16} />
              <span className="text-muted-foreground">{property.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary" className="text-sm">
              <Bed className="mr-1" size={16} />
              {property.bedrooms} Bedrooms
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Bath className="mr-1" size={16} />
              {property.bathrooms} Bathrooms
            </Badge>
            <Badge className="text-sm">{property.tenant_type}</Badge>
          </div>

          <div>
            <h2 className="text-xl lg:text-2xl font-semibold">৳{property.price.toLocaleString()}/month</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-base lg:text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap text-sm lg:text-base">{property.description}</p>
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <Phone className="text-muted-foreground" size={16} />
              <span className="text-muted-foreground">Contact: {property.owner_number}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;

