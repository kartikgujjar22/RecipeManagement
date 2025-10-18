import { Link } from "react-router-dom";
import { ArrowRight, ChefHat, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/RecipeCard";
import pastaImage from "@/assets/pasta-recipe.jpg";
import salmonImage from "@/assets/salmon-recipe.jpg";
import cakeImage from "@/assets/chocolate-cake-recipe.jpg";

// Mock featured recipes - replace with actual API data
const featuredRecipes = [
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
];

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-6">
              <ChefHat className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Discover & Share
              <span className="block text-primary">Delicious Recipes</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our community of food lovers. Share your favorite recipes and discover new culinary adventures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/recipes">
                <Button size="lg" variant="default" className="gap-2 w-full sm:w-auto">
                  Explore Recipes
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Why RecipeHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Endless Recipes
              </h3>
              <p className="text-muted-foreground">
                Browse thousands of recipes from cuisines around the world
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4 bg-secondary/10 rounded-full mb-4">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Community Driven
              </h3>
              <p className="text-muted-foreground">
                Connect with fellow food enthusiasts and share your creations
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4 bg-accent/10 rounded-full mb-4">
                <ChefHat className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Easy to Use
              </h3>
              <p className="text-muted-foreground">
                Simple interface to add, manage, and discover recipes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Featured Recipes
            </h2>
            <Link to="/recipes">
              <Button variant="ghost" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary/90 to-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Share Your Recipe?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Join thousands of home cooks and professional chefs sharing their favorite recipes
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
