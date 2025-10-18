import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const AddRecipe = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cookingTime: "",
    servings: "",
    image: "",
  });
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const filteredIngredients = ingredients.filter((ing) => ing.trim() !== "");
    const filteredInstructions = instructions.filter((inst) => inst.trim() !== "");

    if (filteredIngredients.length === 0 || filteredInstructions.length === 0) {
      toast.error("Please add at least one ingredient and instruction");
      return;
    }

    // TODO: Call API to create recipe
    console.log({
      ...formData,
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
    });

    toast.success("Recipe added successfully!");
    navigate("/my-recipes");
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Add New Recipe
          </h1>
          <p className="text-lg text-muted-foreground">
            Share your culinary creation with the community
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Recipe Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Recipe Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Classic Margherita Pizza"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of your recipe..."
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cookingTime">Cooking Time (minutes)</Label>
                    <Input
                      id="cookingTime"
                      name="cookingTime"
                      type="number"
                      value={formData.cookingTime}
                      onChange={handleInputChange}
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="servings">Servings</Label>
                    <Input
                      id="servings"
                      name="servings"
                      type="number"
                      value={formData.servings}
                      onChange={handleInputChange}
                      placeholder="4"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Ingredients *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addIngredient} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Ingredient
                  </Button>
                </div>
                <div className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                        placeholder={`Ingredient ${index + 1}`}
                      />
                      {ingredients.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIngredient(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Instructions *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addInstruction} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Step
                  </Button>
                </div>
                <div className="space-y-2">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1">
                        <Textarea
                          value={instruction}
                          onChange={(e) => handleInstructionChange(index, e.target.value)}
                          placeholder={`Step ${index + 1}`}
                          rows={2}
                        />
                      </div>
                      {instructions.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeInstruction(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="default" className="flex-1">
                  Publish Recipe
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;
