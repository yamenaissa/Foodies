const express = require("express");
const {
  getRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  upload,
} = require("../controller/recipe");
const verifyToken = require("../middleware/auth")
const router = express.Router();

router.get("/", getRecipes); //get all recipes
router.get("/:id", getRecipe); //get recipe by id
router.post("/", upload.single("file"), verifyToken, addRecipe); //create a new recipe
router.put("/:id", upload.single("file"), editRecipe); //update a recipe
router.delete("/:id", deleteRecipe); //delete a recipe

module.exports = router;
