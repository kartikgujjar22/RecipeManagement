const express = require("express");
const { verifyToken } = require("../middleware/AuthMiddleware");
const { addRecipe } = require("../controller/RecipeController");
const upload = require("../middleware/Upload");

const router = express.Router();

console.log("verifyToken:", typeof verifyToken);
console.log("upload:", typeof upload);
console.log("addRecipe:", typeof addRecipe);

router.post("/add", verifyToken, upload.array("images", 3), addRecipe);

module.exports = router;
