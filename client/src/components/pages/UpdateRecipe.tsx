
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Define the shape of your recipe data
interface RecipeData {
  title: string;
  description: string;
  ingredients: string; // Storing as a single string for simplicity
  instructions: string;
}

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const UpdateRecipe = () => {
  const { id } = useParams<{ id: string }>(); // Get recipe ID from URL
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<RecipeData>({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
  });
  const [loading, setLoading] = useState(true);

  // 1. Fetch Existing Recipe Data
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}api/recipes/${id}`);
        const data = response.data;
        setRecipe({
          title: data.title,
          description: data.description,
          ingredients: data.ingredients.join('\n'), // Convert array to multiline string
          instructions: data.instructions,
        });
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load recipe data.");
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  // 2. Handle Form Submission (Update API Call)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return toast.error("Recipe ID is missing.");

    try {
      const updatedData = {
        ...recipe,
        // Convert the multiline string back to an array for the backend
        ingredients: recipe.ingredients.split('\n').map(item => item.trim()).filter(item => item),
      };

      await axios.put(
        `${VITE_BACKEND_URL}api/recipes/${id}`,
        updatedData,
        { withCredentials: true } // Required for authenticated routes
      );

      toast.success("Recipe updated successfully!");
      navigate(`/recipe/${id}`); // Redirect to the updated recipe detail page

    } catch (error) {
      const message = axios.isAxiosError(error) 
        ? error.response?.data?.message || "Failed to update recipe."
        : "An unexpected error occurred.";
      toast.error(message);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading recipe...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Update Recipe {recipe.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title Input */}
        <div>
          <Label htmlFor="title">Recipe Title</Label>
          <Input
            id="title"
            name="title"
            type="text"
            value={recipe.title}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Description Input */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={recipe.description}
            onChange={handleInputChange}
            rows={3}
            required
          />
        </div>

        {/* Ingredients Input */}
        <div>
          <Label htmlFor="ingredients">Ingredients (One per line)</Label>
          <Textarea
            id="ingredients"
            name="ingredients"
            value={recipe.ingredients}
            onChange={handleInputChange}
            rows={5}
            required
          />
        </div>
        
        {/* Instructions Input */}
        <div>
          <Label htmlFor="instructions">Instructions</Label>
          <Textarea
            id="instructions"
            name="instructions"
            value={recipe.instructions}
            onChange={handleInputChange}
            rows={8}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default UpdateRecipe;