import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (type: "login" | "signup") => {
    try {
      setLoading(true);

      // Validate email
      if (!email) {
        toast({
          variant: "destructive",
          title: "Invalid Email",
          description: "Please enter your email address.",
        });
        setLoading(false);
        return;
      }

      // Validate password length for signup
      if (type === "signup" && password.length < 6) {
        toast({
          variant: "destructive",
          title: "Invalid Password",
          description: "Password should be at least 6 characters long.",
        });
        setLoading(false);
        return;
      }

      let result;

      if (type === "login") {
        result = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
      } else {
        result = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
      }

      if (result.error) {
        // Handle specific error cases
        if (result.error.message.includes("Email not confirmed")) {
          toast({
            title: "Email Verification Required",
            description: "Please check your email and click the verification link before logging in. Check your spam folder if you don't see it.",
          });
        } else if (result.error.message.includes("Invalid login credentials")) {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error.message,
          });
        }
        return;
      }

      // Handle successful auth
      if (type === "login") {
        toast({
          title: "Logged in successfully",
        });
        navigate("/admin");
      } else {
        // Check if the signup was successful and user was created
        if (result.data?.user) {
          toast({
            title: "Signed up successfully",
            description: "Please check your email to verify your account. Check your spam folder if you don't see it.",
          });
          // Stay on the auth page until email is verified
        }
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
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {password.length > 0 && password.length < 6 && (
              <p className="text-sm text-destructive">
                Password must be at least 6 characters long
              </p>
            )}
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