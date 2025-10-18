import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import RecipeCard from "@/components/RecipeCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import pastaImage from "@/assets/pasta-recipe.jpg";
import salmonImage from "@/assets/salmon-recipe.jpg";
import cakeImage from "@/assets/chocolate-cake-recipe.jpg";

// Mock recipes - replace with actual API data
const mockRecipes = [
  {
    id: "1",
    title: "Classic Italian Pasta",
    description: "A delicious and authentic Italian pasta recipe with fresh tomatoes and basil",
    image: pastaImage,
    cookingTime: 30,
    author: "Chef Mario",
  },
  {
    id: "2",
    title: "Grilled Salmon with Herbs",
    description: "Perfectly grilled salmon with a blend of fresh herbs and lemon",
    image: salmonImage,
    cookingTime: 25,
    author: "Chef Sarah",
  },
  {
    id: "3",
    title: "Chocolate Lava Cake",
    description: "Decadent chocolate dessert with a molten center",
    image: cakeImage,
    cookingTime: 20,
    author: "Chef Emma",
  },
  {
    id: "4",
    title: "Thai Green Curry",
    description: "Aromatic and spicy Thai curry with coconut milk and vegetables",
    image: undefined,
    cookingTime: 35,
    author: "Chef Lee",
  },
  {
    id: "5",
    title: "French Onion Soup",
    description: "Classic French soup with caramelized onions and melted cheese",
    image: undefined,
    cookingTime: 45,
    author: "Chef Pierre",
  },
  {
    id: "6",
    title: "Margherita Pizza",
    description: "Traditional Italian pizza with fresh mozzarella and basil",
    image: undefined,
    cookingTime: 40,
    author: "Chef Antonio",
  },
];

const AllRecipes = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Filter recipes based on search query
  const filteredRecipes = mockRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(localSearch.toLowerCase()) ||
    recipe.description.toLowerCase().includes(localSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            All Recipes
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Explore our collection of delicious recipes from around the world
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search recipes..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found
          </p>
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              No recipes found matching "{localSearch}"
            </p>
            <p className="text-muted-foreground mt-2">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRecipes;
