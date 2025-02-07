
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PropertyDetails from "./pages/PropertyDetails";
import CreateProperty from "./pages/CreateProperty";
import EditProperty from "./pages/EditProperty";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";

const App = () => {
  // Create a client instance that persists across re-renders
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="fixed top-4 right-4 z-50">
            <Button variant="outline" size="icon" asChild>
              <Link to="/admin" className="hover:no-underline">
                <UserCog className="h-4 w-4" />
                <span className="sr-only">Admin Dashboard</span>
              </Link>
            </Button>
          </div>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/create-property" element={<CreateProperty />} />
            <Route path="/edit-property/:id" element={<EditProperty />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
