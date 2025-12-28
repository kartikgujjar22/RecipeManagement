import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, } from "lucide-react";




interface Author {_id:string; name:string}
interface Recipe{
  _id:string;
  title:string;
  description:string;
  images:string[];
  ingredients: string[];
  cookingTime?:number;
  serving?:number;
  difficulty:string;
  author:Author;
  cuisineType:string;
}

interface Pagination{
  totalRecipes:number;
  totalPages:number;
  currentPage:number;
  hasNextPage:boolean;
  hasPrevPage:boolean;
}


const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";



const AllRecipes = () => {
  

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);


  const [searchParams, setSearchParams] = useSearchParams();

  const [localSearch, setLocalSearch] = useState(searchParams.get("search") || "");

  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentCuisine = searchParams.get('cuisine') || 'all';
  const currentDifficulty = searchParams.get('difficulty') || 'all';

  const fetchRecipes = useCallback(async () => {
    setLoading(true);

    const currentParams = new URLSearchParams(searchParams);
    if (localSearch){
      currentParams.set('search', localSearch);
    }else{
      currentParams.delete('search');
    }
    

    const queryString = currentParams.toString();

    const finalQueryString = queryString ? `?${queryString}` : '';

    try {
      const response = await axios(`${VITE_BACKEND_URL}api/recipe${finalQueryString}`,{
        withCredentials:true,
      });

      setRecipes(response.data.recipes || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.log('Error during fetching recipes',error);
      toast.error("Failed to fetch recipes. Please try again.");
      setRecipes([]);
      setPagination(null);
    }finally{
      setLoading(false);
    }

  }, [searchParams, localSearch]);

  useEffect( () =>{
    fetchRecipes();
  }, [fetchRecipes]);

  const handleFilterChange = (key: string, value: string) => {
        setSearchParams(prevParams => {
            const newParams = new URLSearchParams(prevParams);
            
            newParams.set('page', '1'); // Always reset to page 1 when filtering
            
            if (value && value!== 'all') {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }
            return newParams;
        }, { replace: true });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchParams(prevParams => {
            const newParams = new URLSearchParams(prevParams);
            newParams.set('page', '1');
            if (localSearch) {
                newParams.set('search', localSearch);
            } else {
                newParams.delete('search');
            }
            return newParams;
        }, { replace: true });
    };

    const handlePageChange = (newPage: number) => {
        if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
            setSearchParams(prevParams => {
                const newParams = new URLSearchParams(prevParams);
                newParams.set('page', String(newPage));
                return newParams;
            }, { replace: true });
        }
    };


    const renderRecipeCard = (recipe: Recipe) => (
        <Link to={`/recipe/${recipe._id}`} key={recipe._id}>
            <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="p-0 overflow-hidden rounded-t-lg">
                    {/* Display the first image, assuming a dedicated upload folder */}
                    {recipe.images && recipe.images.length > 0 ? (
                        <img 
                            src={`${VITE_BACKEND_URL}uploads/${recipe.images[0]}`} 
                            alt={recipe.title} 
                            className="w-full h-48 object-cover"
                        />
                    ) : (
                        <div className="w-full h-48 bg-muted flex items-center justify-center text-sm text-muted-foreground">
                            
                        </div>
                    )}
                </CardHeader>
                <CardContent className="pt-4">
                    <CardTitle className="text-xl line-clamp-1">{recipe.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">{recipe.description}</CardDescription>
                    <div className="mt-3 text-sm flex justify-between items-center">
                        <span className="text-primary font-medium">{recipe.cuisineType}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {recipe.difficulty}
                        </span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                        By {recipe.author?.name || 'Unknown'} | {recipe.cookingTime} mins
                    </div>
                </CardContent>
            </Card>
        </Link>
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
                    <form onSubmit={handleSearchSubmit} className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search recipes..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="pl-10"
                        />
                        {/* Note: An implicit submit button is good for accessibility, 
                            but the search is also triggered by hitting Enter */}
                    </form>
                </div>

                {/* Filter and Controls Section */}
                <div className="flex flex-wrap gap-4 mb-6 items-center">
                    <span className="text-lg font-medium">Filter By:</span>

                    {/* Cuisine Filter */}
                    <Select 
                        value={currentCuisine} 
                        onValueChange={(value) => handleFilterChange('cuisine', value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Cuisine Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Cuisines</SelectItem>
                            <SelectItem value="Indian">Indian</SelectItem>
                            <SelectItem value="Italian">Italian</SelectItem>
                            <SelectItem value="Mexican">Mexican</SelectItem>
                            {/* Add all your cuisine types here */}
                        </SelectContent>
                    </Select>

                    {/* Difficulty Filter */}
                    <Select 
                        value={currentDifficulty} 
                        onValueChange={(value) => handleFilterChange('difficulty', value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Difficulties</SelectItem>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    {/* Reset Filters Button */}
                    {(currentCuisine || currentDifficulty || currentPage > 1 || localSearch) && (
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setLocalSearch(""); // Clear local search input
                                setSearchParams(new URLSearchParams(), { replace: true });
                            }}
                        >
                            Reset Filters
                        </Button>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-muted-foreground">
                        {pagination?.totalRecipes || 0} {pagination?.totalRecipes === 1 ? 'recipe' : 'recipes'} found
                    </p>
                </div>

                {/* Recipe Grid */}
                {loading ? (
                    <div className="text-center py-10 text-xl">Loading recipes...</div>
                ) : recipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map(renderRecipeCard)}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-xl text-muted-foreground">
                            No recipes found matching your criteria. 😔
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Try broadening your search or resetting filters.
                        </p>
                    </div>
                )}
                
                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-10">
                        <Button
                            variant="outline"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!pagination.hasPrevPage || loading}
                            className="gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Previous
                        </Button>

                        <span className="text-sm text-foreground">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>

                        <Button
                            variant="outline"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!pagination.hasNextPage || loading}
                            className="gap-2"
                        >
                            Next <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllRecipes;