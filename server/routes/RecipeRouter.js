// server\routes\RecipeRouter.js

const express = require("express");
const router = express.Router();
const multer = require("multer"); // Required for error checking
const { verifyToken } = require("../middleware/AuthMiddleware");
const { addRecipe, getAllRecipes } = require("../controller/RecipeController");
const upload = require("../middleware/Upload"); // Multer instance

router.post(
  "/add",
  verifyToken,
  // 1. Run Multer middleware (with an immediate error handler)
  (req, res, next) => {
    upload.array("images", 3)(req, res, (err) => {
      // Check if the error is a MulterError instance
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: `File upload failed: One or more images exceed the 3MB limit.`,
          });
        }
        // Handle other Multer errors (e.g., wrong field name, too many files)
        return res.status(400).json({
          message: `File upload error: ${err.message}`,
        });
      }

      // Handle custom errors thrown by the fileFilter (e.g., file type error)
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      // If no errors, continue to the next middleware/controller
      next();
    });
  },
  addRecipe
);

router.get("/all", getAllRecipes);

module.exports = router;
