const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    ingredients: [
      {
        type: String,
        required: true,
      },
    ],

    // 🚀 NEW: Instructions field
    instructions: [
      {
        type: String,
        required: true,
      },
    ],

    // 🚀 NEW: Cooking Time field
    cookingTime: {
      type: Number, // Storing as a number (minutes)
      required: true,
      min: 1,
    },

    // 🚀 NEW: Servings field
    servings: {
      type: Number, // Storing as a number
      required: true,
      min: 1,
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    cuisineType: {
      type: String,
      default: "General",
    },

    // Removing 'createdAt' and 'updatedAt' manual fields since { timestamps: true } handles them
  },
  { timestamps: true } // This option handles createdAt and updatedAt automatically
);

module.exports = mongoose.model("Recipe", recipeSchema);
