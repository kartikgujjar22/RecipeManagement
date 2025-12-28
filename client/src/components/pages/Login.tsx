// client\src\components\pages\Login.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios"; 
import { useAuth } from "../../context/AuthContext"; 

const Login = () => {
  const navigate = useNavigate();
  
  const { setIsAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
     
      const response = await axios.post(
        `${VITE_BACKEND_URL}api/auth/login`, 
        { 
          email: formData.email, 
          password: formData.password 
        }, 
        { 
          withCredentials: true, // CRITICAL: Ensures the cookie is set by the browser
          headers: {
             "Content-Type": "application/json",
          }
        }
      );

      if (response.status === 200) {
        // 🚀 THE FIX: Update the global authentication state
        setIsAuthenticated(true); 
        
        toast.success("Logged in successfully!");
        navigate("/");
      }
      
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.message || "Login failed. Please try again."
        : "An unexpected error occurred.";
        
      return toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <ChefHat className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your RecipeHub account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;