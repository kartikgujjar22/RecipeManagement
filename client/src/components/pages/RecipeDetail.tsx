import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Users, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import pastaImage from "@/assets/pasta-recipe.jpg";

// Mock recipe data - replace with actual API call
const mockRecipe = {
  id: "1",
  title: "Classic Italian Pasta",
  description: "A delicious and authentic Italian pasta recipe with fresh tomatoes, basil, and garlic. This recipe has been passed down through generations and brings the taste of Italy to your kitchen.",
  image: pastaImage,
  cookingTime: 30,
  servings: 4,
  author: "Chef Mario",
  authorId: "user123",
  ingredients: [
    "500g pasta",
    "4 large tomatoes",
    "4 cloves of garlic",
    "Fresh basil leaves",
    "2 tbsp olive oil",
    "Salt and pepper to taste",
    "Parmesan cheese for serving",
  ],
  instructions: [
    "Bring a large pot of salted water to boil. Add pasta and cook according to package directions.",
    "Meanwhile, dice the tomatoes and mince the garlic.",
    "Heat olive oil in a large pan over medium heat. Add garlic and sauté until fragrant.",
    "Add diced tomatoes and cook for 10 minutes until they break down into a sauce.",
    "Season with salt and pepper. Tear fresh basil leaves and add to the sauce.",
    "Drain pasta and toss with the tomato sauce.",
    "Serve hot with grated Parmesan cheese on top.",
  ],
};

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // TODO: Fetch recipe from API using id
  // Mock check if user is the recipe owner
  const isOwner = true; // Replace with actual auth check

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      // TODO: Call API to delete recipe
      toast.success("Recipe deleted successfully");
      navigate("/my-recipes");
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Recipe Image */}
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
          {mockRecipe.image ? (
            <img
              src={mockRecipe.image}
              alt={mockRecipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-secondary/20">
              <span className="text-6xl">🍳</span>
            </div>
          )}
        </div>

        {/* Recipe Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {mockRecipe.title}
            </h1>
            {isOwner && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>

          <p className="text-lg text-muted-foreground mb-6">
            {mockRecipe.description}
          </p>

          <div className="flex flex-wrap gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{mockRecipe.cookingTime} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{mockRecipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>By {mockRecipe.author}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ingredients */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Ingredients
              </h2>
              <ul className="space-y-3">
                {mockRecipe.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-foreground"
                  >
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Instructions
              </h2>
              <ol className="space-y-4">
                {mockRecipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </span>
                    <p className="text-foreground pt-1">{instruction}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
