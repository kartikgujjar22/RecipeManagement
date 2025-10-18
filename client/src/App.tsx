import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import AllRecipes from "./components/pages/AllRecipes";
import MyRecipes from "./components/pages/MyRecipes";
import AddRecipe from "./components/pages/AddRecipe";
import RecipeDetail from "./components/pages/RecipeDetail";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import NotFound from "./components/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // TODO: Replace with actual authentication state management
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    // TODO: Call API to logout
    setIsAuthenticated(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<AllRecipes />} />
            <Route path="/my-recipes" element={<MyRecipes />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
