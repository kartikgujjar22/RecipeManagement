// client\src\App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// 🚀 Import the AuthProvider and useAuth hook
import { AuthProvider, useAuth } from "./context/AuthContext"; 
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import AllRecipes from "./components/pages/AllRecipes";
import MyRecipes from "./components/pages/MyRecipes";
import AddRecipe from "./components/pages/AddRecipe";
import RecipeDetail from "./components/pages/RecipeDetail";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import NotFound from "./components/pages/NotFound";
import UpdateRecipe from "./components/pages/UpdateRecipe";

const queryClient = new QueryClient();

// 🚀 Wrapper Component to access the Auth Context
const AppContent = () => {
  // Use the hook to get the global state and functions
  const { isAuthenticated, handleLogout } = useAuth();

  return (
    <>
      {/* Navbar gets the global state/function */}
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<AllRecipes />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        
        {/* Protected Routes */}
        {isAuthenticated && (
          <>
            <Route path="/my-recipes" element={<MyRecipes />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/update-recipe/:id" element={<UpdateRecipe />} />
          </>
        )}
        
        {/* Public/Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* 🚀 AuthProvider wraps the content that needs auth state */}
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;