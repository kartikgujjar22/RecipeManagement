import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import pastaImage from "@/assets/pasta-recipe.jpg";

// Mock user recipes - replace with actual API data
const mockUserRecipes = [
  {
    id: "1",
    title: "My Special Pasta",
    description: "Family recipe passed down through generations",
    image: pastaImage,
    cookingTime: 30,
    author: "You",
  },
  {
    id: "2",
    title: "Homemade Pizza",
    description: "Perfect crispy crust with fresh toppings",
    image: undefined,
    cookingTime: 45,
    author: "You",
  },
];

const MyRecipes = () => {
  const [recipes, setRecipes] = useState(mockUserRecipes);

  const handleDelete = (id: string) => {
    // Confirm deletion
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      // TODO: Call API to delete recipe
      setRecipes(recipes.filter((recipe) => recipe.id !== id));
      toast.success("Recipe deleted successfully");
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              My Recipes
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage and view all your recipes in one place
            </p>
          </div>
          <Link to="/add-recipe">
            <Button variant="default" className="gap-2">
              <Plus className="h-5 w-5" />
              Add New Recipe
            </Button>
          </Link>
        </div>

        {/* Recipe Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
          </p>
        </div>

        {/* Recipe Grid */}
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                {...recipe}
                isOwner={true}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <div className="max-w-md mx-auto">
              <p className="text-xl text-foreground mb-2">
                No recipes yet
              </p>
              <p className="text-muted-foreground mb-6">
                Start sharing your culinary creations with the community
              </p>
              <Link to="/add-recipe">
                <Button variant="default" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Add Your First Recipe
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecipes;
