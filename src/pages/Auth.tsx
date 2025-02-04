import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (type: "login" | "signup") => {
    try {
      setLoading(true);
      let result;

      if (type === "login") {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
      }

      if (result.error) throw result.error;

      toast({
        title: type === "login" ? "Logged in successfully" : "Signed up successfully",
        description: type === "signup" ? "Please check your email to verify your account" : undefined,
      });

      if (type === "login") {
        navigate("/admin");
      }
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
    <div className="container mx-auto max-w-md px-4 py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account or create a new one</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full"
            onClick={() => handleAuth("login")}
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => handleAuth("signup")}
            disabled={loading}
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;