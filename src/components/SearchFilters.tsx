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

export function SearchFilters() {
  const [priceRange, setPriceRange] = useState([5000, 50000]);

  return (
    <div className="p-4 space-y-4 bg-card rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select>
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

        <Select>
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

        <Select>
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
          value={priceRange}
          onValueChange={setPriceRange}
          className="py-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>৳{priceRange[0].toLocaleString()}</span>
          <span>৳{priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <Button className="w-full">Apply Filters</Button>
    </div>
  );
}