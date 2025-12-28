import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Added LogIn icon for the unauthenticated state
import { Search, Menu, X, Plus, LogOut, User, Home, BookOpen, ChefHat, LogIn } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Navbar = ({ isAuthenticated = false, onLogout }: NavbarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Helper function to close mobile menu on navigation/action
  const handleNavClick = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <ChefHat className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold text-foreground">RecipeHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              <Home className="h-5 w-5" />
            </Link>
            <Link to="/recipes" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>All Recipes</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/my-recipes" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>My Recipes</span>
                </Link>
                <Link to="/add-recipe">
                  <Button variant="default" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Recipe
                  </Button>
                </Link>
                <Link to="/update-recipe/1">
                  <Button variant="default" size="sm" className="gap-2">
                    {/* <Plus className="h-4 w-4" /> */}
                    Update Recipe
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Search & Auth Actions */}
          <div className="flex items-center gap-2">
            {/* Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-foreground hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Desktop Auth Button (Login/Logout) 🚀 UPDATED */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Link to="/login">
                  <Button variant="default" size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" /> {/* Use LogIn icon */}
                    Login
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search Bar Expansion */}
        {searchOpen && (
          <div className="py-3 border-t border-border animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
              <Input
                type="search"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button type="submit" variant="default">
                Search
              </Button>
            </form>
          </div>
        )}

        {/* Mobile Menu 🚀 UPDATED */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-3">
              {/* Static Links */}
              <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors" onClick={handleNavClick}>
                <Home className="h-5 w-5" /><span>Home</span>
              </Link>
              <Link to="/recipes" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors" onClick={handleNavClick}>
                <BookOpen className="h-5 w-5" /><span>All Recipes</span>
              </Link>
              
              {isAuthenticated ? (
                <>
                  {/* Authenticated Links */}
                  <Link to="/my-recipes" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors" onClick={handleNavClick}>
                    <User className="h-5 w-5" /><span>My Recipes</span>
                  </Link>
                  <Link to="/add-recipe" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors" onClick={handleNavClick}>
                    <Plus className="h-5 w-5" /><span>Add Recipe</span>
                  </Link>
                  {/* Logout Button in Mobile Menu */}
                  <button
                    onClick={() => {
                      onLogout?.();
                      handleNavClick();
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Unauthenticated Links: Login as primary button */}
                  <Link to="/login" onClick={handleNavClick}>
                    <Button variant="default" className="w-full">
                      Login
                    </Button>
                  </Link>
                  {/* Sign Up as a secondary (ghost) button in mobile */}
                  <Link to="/signup" onClick={handleNavClick}>
                    <Button variant="ghost" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;