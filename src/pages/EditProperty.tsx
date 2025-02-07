
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState({
    title: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    type: "",
    owner_number: "",
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) {
          setProperty({
            title: data.title,
            location: data.location,
            price: String(data.price),
            bedrooms: String(data.bedrooms),
            bathrooms: String(data.bathrooms),
            type: data.type,
            owner_number: data.owner_number,
          });
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    };

    if (id) fetchProperty();
  }, [id, toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("properties")
        .update({
          title: property.title,
          location: property.location,
          price: Number(property.price),
          bedrooms: Number(property.bedrooms),
          bathrooms: Number(property.bathrooms),
          type: property.type,
          owner_number: property.owner_number,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property updated successfully",
      });
      navigate("/admin");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Property</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={property.title}
            onChange={(e) => setProperty({ ...property, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={property.location}
            onChange={(e) => setProperty({ ...property, location: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (per month)</Label>
          <Input
            id="price"
            type="number"
            value={property.price}
            onChange={(e) => setProperty({ ...property, price: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              value={property.bedrooms}
              onChange={(e) => setProperty({ ...property, bedrooms: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              type="number"
              value={property.bathrooms}
              onChange={(e) => setProperty({ ...property, bathrooms: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Property Type</Label>
          <Select
            value={property.type}
            onValueChange={(value) => setProperty({ ...property, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="House">House</SelectItem>
              <SelectItem value="Condo">Condo</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="owner_number">Owner Contact Number</Label>
          <Input
            id="owner_number"
            value={property.owner_number}
            onChange={(e) => setProperty({ ...property, owner_number: e.target.value })}
            required
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Property"}
        </Button>
      </form>
    </div>
  );
};

export default EditProperty;
