import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, Plus, LogOut, User, Home, BookOpen, ChefHat } from "lucide-react";
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

            {/* Desktop Auth Buttons */}
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
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="default" size="sm">Sign Up</Button>
                  </Link>
                </>
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link
                to="/recipes"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpen className="h-5 w-5" />
                <span>All Recipes</span>
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/my-recipes"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>My Recipes</span>
                  </Link>
                  <Link
                    to="/add-recipe"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Recipe</span>
                  </Link>
                  <button
                    onClick={() => {
                      onLogout?.();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      Login
                    </Button>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="default" className="w-full">
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
