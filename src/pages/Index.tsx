
import { PropertyCard } from "@/components/PropertyCard";
import { SearchFilters, useFiltersStore } from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Index = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const { propertyType, bedrooms, tenantType, priceRange } = useFiltersStore();

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties", propertyType, bedrooms, tenantType, priceRange, searchLocation],
    queryFn: async () => {
      let query = supabase
        .from("properties")
        .select(`
          *,
          property_images (
            image_url
          )
        `)
        .order("created_at", { ascending: false });

      // Apply filters
      if (propertyType) {
        query = query.eq("property_type", propertyType);
      }
      if (bedrooms) {
        query = query.eq("bedrooms", parseInt(bedrooms));
      }
      if (tenantType) {
        query = query.eq("tenant_type", tenantType);
      }
      if (priceRange) {
        query = query.gte("price", priceRange[0]).lte("price", priceRange[1]);
      }
      if (searchLocation) {
        query = query.ilike("location", `%${searchLocation}%`);
      }

      const { data: properties, error } = await query;

      if (error) throw error;
      return properties;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

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
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
            <Input
              placeholder="Search by location..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
            <Button type="submit" variant="secondary" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchFilters />
        </div>

        <h2 className="text-2xl font-semibold mb-6">
          {properties?.length === 0
            ? "No properties found"
            : properties?.length === 1
            ? "1 Property Found"
            : `${properties?.length || "Featured"} Properties`}
        </h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
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
