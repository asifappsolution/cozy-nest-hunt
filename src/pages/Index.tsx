import { PropertyCard } from "@/components/PropertyCard";
import { SearchFilters } from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SAMPLE_PROPERTIES = [
  {
    id: 1,
    title: "Modern 2BHK Apartment in Gulshan",
    location: "Gulshan-1, Dhaka",
    price: 35000,
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
    type: "Family",
  },
  {
    id: 2,
    title: "Luxurious 3BHK with City View",
    location: "Banani, Dhaka",
    price: 45000,
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500",
    type: "Family",
  },
  {
    id: 3,
    title: "Cozy Bachelor Pad",
    location: "Dhanmondi, Dhaka",
    price: 15000,
    bedrooms: 1,
    bathrooms: 1,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
    type: "Bachelor",
  },
];

const Index = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_PROPERTIES.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;