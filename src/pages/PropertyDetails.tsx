import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, MapPin } from "lucide-react";
import { toast } from "sonner";

const PropertyDetails = () => {
  const { id } = useParams();

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
        <h1 className="text-2xl font-bold">Property not found</h1>
        <p className="text-muted-foreground mt-2">
          The property you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {property.property_images && property.property_images[0] && (
            <img
              src={property.property_images[0].image_url}
              alt={property.title}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          )}
          <div className="flex gap-2">
            {property.property_images?.slice(1).map((image: { image_url: string }) => (
              <img
                key={image.image_url}
                src={image.image_url}
                alt={property.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="text-muted-foreground" size={16} />
              <span className="text-muted-foreground">{property.location}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Badge variant="secondary">
              <Bed className="mr-1" size={16} />
              {property.bedrooms} Bedrooms
            </Badge>
            <Badge variant="secondary">
              <Bath className="mr-1" size={16} />
              {property.bathrooms} Bathrooms
            </Badge>
            <Badge>{property.tenant_type}</Badge>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">৳{property.price.toLocaleString()}/month</h2>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{property.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;