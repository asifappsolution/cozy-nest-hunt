import { PropertyCard } from "@/components/PropertyCard";
import { SearchFilters } from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties"],
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-gradient-to-r from-primary/90 to-primary text-white">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Find Your Perfect Home
          </h1>
          <p className="text-lg text-center mb-8 max-w-2xl mx-auto">
            Discover thousands of rental properties in Bangladesh
          </p>
          <div className="max-w-2xl mx-auto flex gap-2">
            <Input
              placeholder="Search by location..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Button variant="secondary" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchFilters />
        </div>

        <h2 className="text-2xl font-semibold mb-6">Featured Properties</h2>
        {isLoading ? (
          <div>Loading properties...</div>
        ) : (
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
        )}
      </main>
    </div>
  );
};

export default Index;