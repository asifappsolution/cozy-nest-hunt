
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { create } from "zustand";

interface FiltersState {
  propertyType: string | null;
  bedrooms: string | null;
  tenantType: string | null;
  priceRange: [number, number];
  setFilters: (filters: Partial<Omit<FiltersState, "setFilters" | "resetFilters">>) => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  propertyType: null,
  bedrooms: null,
  tenantType: null,
  priceRange: [5000, 50000],
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
  resetFilters: () => 
    set({
      propertyType: null,
      bedrooms: null,
      tenantType: null,
      priceRange: [5000, 50000],
    }),
}));

export function SearchFilters() {
  const { propertyType, bedrooms, tenantType, priceRange, setFilters, resetFilters } = useFiltersStore();
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);

  const handleApplyFilters = () => {
    setFilters({ priceRange: localPriceRange });
  };

  return (
    <div className="p-4 space-y-4 bg-card rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          value={propertyType || ""}
          onValueChange={(value) => setFilters({ propertyType: value || null })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flat">Flat Rent</SelectItem>
            <SelectItem value="sublet">Sublet</SelectItem>
            <SelectItem value="hostel">Hostel</SelectItem>
            <SelectItem value="commercial">Commercial Space</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={bedrooms || ""}
          onValueChange={(value) => setFilters({ bedrooms: value || null })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Bedroom</SelectItem>
            <SelectItem value="2">2 Bedrooms</SelectItem>
            <SelectItem value="3">3 Bedrooms</SelectItem>
            <SelectItem value="4">4+ Bedrooms</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={tenantType || ""}
          onValueChange={(value) => setFilters({ tenantType: value || null })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tenant Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="family">Family</SelectItem>
            <SelectItem value="bachelor">Bachelor</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="office">Office</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Price Range</label>
        <Slider
          defaultValue={[5000, 50000]}
          max={100000}
          min={0}
          step={1000}
          value={localPriceRange}
          onValueChange={setLocalPriceRange}
          className="py-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>৳{localPriceRange[0].toLocaleString()}</span>
          <span>৳{localPriceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={handleApplyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={resetFilters}>Reset</Button>
      </div>
    </div>
  );
}
