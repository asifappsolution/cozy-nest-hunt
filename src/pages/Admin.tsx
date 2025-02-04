import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/PropertyCard";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const Admin = () => {
  const { data: properties, isLoading } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      const { data: properties, error } = await supabase
        .from("properties")
        .select(`
          *,
          property_images (
            image_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return properties;
    },
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Properties</h1>
        <Button asChild>
          <Link to="/create-property">
            <Plus className="h-4 w-4 mr-2" />
            Add New Property
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties?.map((property) => (
          <PropertyCard
            key={property.id}
            id={property.id}
            title={property.title}
            location={property.location}
            price={property.price}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            imageUrl={property.property_images?.[0]?.image_url || "/placeholder.svg"}
            type={property.tenant_type}
          />
        ))}
      </div>
    </div>
  );
};

export default Admin;