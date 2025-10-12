const Joi = require("joi");
const Recipe = require("../model/recipes");

const validation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  ingredients: Joi.string().required(),
  difficulty: Joi.string().required(),
  cuisineType: Joi.string().required(),
});

const addRecipe = async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { title, description, ingredients, difficulty, cuisineType } =
      req.body;

    const imagePaths = req.files ? req.files.map((file) => file.filename) : [];

    if (imagePaths.length === 0) {
      return res
        .status(400)
        .json({ message: "Please upload at least one image" });
    }

    const authorId = req.user.id;

    const newRecipe = new Recipe({
      title,
      description,
      ingredients: ingredients.split(","),
      images: imagePaths,
      author: authorId,
      difficulty,
      cuisineType,
    });

    await newRecipe.save();

    return res.status(200).json({
      message: "Recipe added successfully",
      recipe: newRecipe,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error during adding recipe" });
  }
};

module.exports = { addRecipe };
