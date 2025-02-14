
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/PropertyCard";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Home, LogOut, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to access your profile",
        });
        navigate("/auth");
      } else {
        setUser(session.user);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, toast]);

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ["user-properties", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data: properties, error } = await supabase
        .from("properties")
        .select(`
          *,
          property_images (
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return properties;
    },
    enabled: !!user?.id,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/");
  };

  if (isLoading || propertiesLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-2 sm:gap-4 flex-1">
            <Button 
              variant="outline" 
              size={isMobile ? "icon" : "default"} 
              asChild
              className="shrink-0"
            >
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                {!isMobile && "Back to Home"}
              </Link>
            </Button>
            <Button
              variant="outline"
              size={isMobile ? "icon" : "default"}
              className="shrink-0"
            >
              <UserCog className="h-4 w-4" />
              {!isMobile && "Admin"}
            </Button>
            <h2 className="text-base sm:text-lg font-semibold truncate">
              {isMobile ? "Dashboard" : "Property Owner Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-6 ml-auto">
            {!isMobile && (
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                {user?.email}
              </span>
            )}
            <Button 
              variant="outline" 
              size={isMobile ? "icon" : "default"} 
              onClick={handleLogout}
              className="shrink-0"
            >
              <LogOut className="h-4 w-4" />
              {!isMobile && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Properties</h1>
          <Button asChild>
            <Link to="/create-property">
              <Plus className="h-4 w-4 mr-2" />
              Add New Property
            </Link>
          </Button>
        </div>

        {properties?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">You haven't listed any properties yet.</p>
            <Button asChild>
              <Link to="/create-property">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Property
              </Link>
            </Button>
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
                ownerNumber={property.owner_number}
                isOwner={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
