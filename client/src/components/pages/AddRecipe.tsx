import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 

interface FormData {
  title: string;
  description: string;
  cookingTime: string; 
  servings: string;
  difficulty: string; 
  cuisineType: string;
}

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const AddRecipe = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null); 

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    cookingTime: "30", //added default cooking time
    servings: "4",   // added default servings
    difficulty: "Easy", 
    cuisineType: "Italian", 
  });
  
  const [images, setImages] = useState<File[]>([]); 
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(newFiles);
    }
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

    const filteredIngredients = ingredients.filter((ing) => ing.trim() !== "");
    const filteredInstructions = instructions.filter((inst) => inst.trim() !== "");

    // Basic validation
    if (!formData.title || !formData.description || !formData.difficulty || !formData.cuisineType) {
      return toast.error("Please fill in all required fields.");
    }
    if (filteredIngredients.length === 0 || filteredInstructions.length === 0) {
      return toast.error("Please add at least one ingredient and instruction.");
    }
    if (images.length === 0) {
      return toast.error("Please upload at least one image.");
    }

    const data = new FormData();
    
    // Append simple text fields
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("difficulty", formData.difficulty);
    data.append("cuisineType", formData.cuisineType);
    // 🚀 NEW: Append cookingTime and servings
    data.append("cookingTime", formData.cookingTime); 
    data.append("servings", formData.servings);     
    
    data.append("ingredients", filteredIngredients.join(",")); 
    
    data.append("instructions", filteredInstructions.join("\n")); 

    // Append image files
    images.forEach((file) => {
      data.append("images", file); 
    });

    console.log("Attempting POST to:", `${VITE_BACKEND_URL}api/recipe/add`);

    try {
      await axios.post(
        `${VITE_BACKEND_URL}api/recipe/add`,
        data,
        { withCredentials: true }
      );

      toast.success("Recipe added successfully!");
      navigate("/my-recipes");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Server error during adding recipe."
        : "An unexpected error occurred.";
      console.error(error);
      toast.error(message);
    }
  };


  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header (unchanged) */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Add New Recipe</h1>
          <p className="text-lg text-muted-foreground">Share your culinary creation with the community</p>
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
                {/* Title and Description (unchanged) */}
                <div><Label htmlFor="title">Recipe Title *</Label><Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Classic Margherita Pizza" required /></div>
                <div><Label htmlFor="description">Description *</Label><Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Brief description of your recipe..." rows={3} required /></div>

                {/* 🚀 NEW: Cooking Time & Servings */}
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
                      required // Making this required as per new validation
                      min="1"
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
                      required // Making this required as per new validation
                      min="1"
                    />
                  </div>
                </div>

                {/* Difficulty and Cuisine Type (unchanged) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Difficulty *</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))} defaultValue={formData.difficulty}>
                      <SelectTrigger id="difficulty"><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cuisineType">Cuisine Type *</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, cuisineType: value }))} defaultValue={formData.cuisineType}>
                      <SelectTrigger id="cuisineType"><SelectValue placeholder="Select cuisine" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Italian">Italian</SelectItem>
                        <SelectItem value="Mexican">Mexican</SelectItem>
                        <SelectItem value="Indian">Indian</SelectItem>
                        <SelectItem value="American">American</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* File Input (unchanged) */}
                <div>
                    <Label htmlFor="images">Recipe Images *</Label>
                    <Input id="images" name="images" type="file" accept="image/*" ref={fileInputRef} multiple onChange={handleFileChange} required/>
                    {images.length > 0 && (<p className="text-sm text-muted-foreground mt-1">{images.length} file(s) selected.</p>)}
                </div>
              </div>

              {/* Ingredients (unchanged) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Ingredients *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addIngredient} className="gap-2"><Plus className="h-4 w-4" />Add Ingredient</Button>
                </div>
                <div className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <Input value={ingredient} onChange={(e) => handleIngredientChange(index, e.target.value)} placeholder={`Ingredient ${index + 1}`}/>
                      {ingredients.length > 1 && (<Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(index)}><X className="h-4 w-4" /></Button>)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions (unchanged) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Instructions *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addInstruction} className="gap-2"><Plus className="h-4 w-4" />Add Step</Button>
                </div>
                <div className="space-y-2">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1">
                        <Textarea value={instruction} onChange={(e) => handleInstructionChange(index, e.target.value)} placeholder={`Step ${index + 1}`} rows={2}/>
                      </div>
                      {instructions.length > 1 && (<Button type="button" variant="ghost" size="icon" onClick={() => removeInstruction(index)}><X className="h-4 w-4" /></Button>)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons (unchanged) */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="default" className="flex-1">Publish Recipe</Button>
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;