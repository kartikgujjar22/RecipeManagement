const Joi = require("joi");
const Recipe = require("../model/recipes");
const { httplogger, logger } = require("../middleware/logger");

const validation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  ingredients: Joi.string().required(),
  difficulty: Joi.string().required(),
  cuisineType: Joi.string().required(),
  cookingTime: Joi.number().min(1).required(),
  servings: Joi.number().min(1).required(),
  instructions: Joi.string().required(),
});

const addRecipe = async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    logger.info(`Adding recipe with data: ${JSON.stringify(req.body)}`);
    const {
      title,
      description,
      ingredients,
      difficulty,
      cuisineType,
      instructions,
      cookingTime,
      servings,
    } = req.body;

    logger.info(`Received recipe data: ${JSON.stringify(req.body)}`);

    const imagePaths = req.files ? req.files.map((file) => file.filename) : [];

    logger.info(`Uploaded image paths: ${imagePaths}`);

    if (imagePaths.length === 0) {
      return res
        .status(400)
        .json({ message: "Please upload at least one image" });
    }

    const authorId = req.user.id;
    logger.info(`Author ID from token: ${authorId}`);

    const newRecipe = new Recipe({
      title,
      description,
      ingredients: ingredients.split(",").map((i) => i.trim()),
      images: imagePaths,
      author: authorId,
      difficulty,
      cuisineType,
      instructions: instructions
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s),
      cookingTime: Number(cookingTime),
      servings: Number(servings),
    });

    logger.info(`New Recipe object: ${JSON.stringify(newRecipe)}`);

    await newRecipe.save();

    return res.status(200).json({
      message: "Recipe added successfully",
      recipe: newRecipe,
    });
  } catch (error) {
    console.error(error);
    logger.error(`Error occured during the recipe addation ${error}`);
    return res
      .status(500)
      .json({ message: "Server error during adding recipe" });
  }
};

const updateRecipe = async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const recipeId = req.params.id;
    const {
      title,
      description,
      ingredients,
      difficulty,
      cuisineType,
      instructions,
      cookingTime,
      servings,
    } = req.body;

    const findingExistingRecipe = await Recipe.findById(recipeId);
    if (!findingExistingRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const imagePaths = req.files ? req.files.map((file) => file.filename) : [];

    if (imagePaths.length === 0) {
      return res
        .status(400)
        .json({ message: "Please upload at least one image" });
    }

    findingExistingRecipe.title = title;
    findingExistingRecipe.description = description;
    findingExistingRecipe.ingredients = ingredients
      .split(",")
      .map((i) => i.trim());
    findingExistingRecipe.images = imagePaths;
    findingExistingRecipe.difficulty = difficulty;
    findingExistingRecipe.cuisineType = cuisineType;
    findingExistingRecipe.instructions = instructions
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s);
    findingExistingRecipe.cookingTime = Number(cookingTime);
    findingExistingRecipe.servings = Number(servings);
    await findingExistingRecipe.save();

    return res.status(200).json({
      message: "Recipe updated successfully",
      recipe: findingExistingRecipe,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error during Recipe update process" });
  }
};

const getAllRecipes = async (req, res) => {
  try {
    // 1. Pagination and Filtering Parameters
    const {
      page = 1, // Default to page 1
      limit = 10, // Default to 10 recipes per page
      cuisine, // Filter by cuisineType
      difficulty, // Filter by difficulty
    } = req.query;

    // Convert to integers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // 2. Build Query Filter Object
    const filter = {};
    if (cuisine) {
      // Case-insensitive search for cuisineType
      filter.cuisineType = { $regex: cuisine, $options: "i" };
    }
    if (difficulty) {
      // Case-insensitive search for difficulty
      filter.difficulty = { $regex: difficulty, $options: "i" };
    }

    // 3. Fetch Data
    const recipesPromise = Recipe.find(filter)
      .select("-__v")
      .populate("author", "name")
      .limit(limitNumber)
      .skip(skip)
      .lean(); // Use .lean() for faster query when not saving/updating

    const totalCountPromise = Recipe.countDocuments(filter);

    const [recipes, totalCount] = await Promise.all([
      recipesPromise,
      totalCountPromise,
    ]);

    // 4. Construct Pagination Response
    const totalPages = Math.ceil(totalCount / limitNumber);

    logger.info(
      `Fetched recipes. Page: ${pageNumber}, Limit: ${limitNumber}, Count: ${recipes.length}`
    );

    return res.status(200).json({
      recipes,
      pagination: {
        totalRecipes: totalCount,
        totalPages: totalPages,
        currentPage: pageNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    // 5. Error Handling
    logger.error(`Error fetching paginated/filtered recipes: ${error.message}`);
    // Return 500 status for internal errors
    return res
      .status(500)
      .json({ message: "Server error while fetching recipes." });
  }
};

module.exports = { addRecipe, getAllRecipes };
