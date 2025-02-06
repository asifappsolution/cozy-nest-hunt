
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, MapPin, Edit, Trash2, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string;
  type: string;
  ownerNumber: string;
  isOwner?: boolean;
  onDelete?: () => void;
}

export function PropertyCard({
  id,
  title,
  location,
  price,
  bedrooms,
  bathrooms,
  imageUrl,
  type,
  ownerNumber,
  isOwner = false,
  onDelete,
}: PropertyCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fallbackImage = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=400&q=80";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImage;
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property deleted successfully",
      });

      // Refresh the properties list
      queryClient.invalidateQueries({ queryKey: ["user-properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      
      if (onDelete) onDelete();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Link to={`/property/${id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg animate-fade-in">
        <CardHeader className="p-0">
          <div className="relative h-48 overflow-hidden">
            <img
              src={imageUrl || fallbackImage}
              alt={title}
              className="object-cover w-full h-full transition-transform hover:scale-105"
              onError={handleImageError}
            />
            <Badge className="absolute top-2 right-2 bg-primary">{type}</Badge>
            {isOwner && (
              <div className="absolute top-2 left-2 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/edit-property/${id}`;
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
          <div className="flex items-center gap-1 text-muted-foreground mt-1">
            <MapPin size={16} />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground mt-1">
            <Phone size={16} />
            <span className="text-sm">{ownerNumber}</span>
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
    </Link>
  );
}
