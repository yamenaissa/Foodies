const Recipe = require("../models/recipe");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.fieldname;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    return res.json(recipes);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch recipe" });
  }
};

const addRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time, category } = req.body;

    // ✅ FIXED: Return proper error status
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({
        message: "Title, ingredients, and instructions are required.",
      });
    }

    // ✅ Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "Recipe image is required.",
      });
    }

    const newRecipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      time,
      category: category || "Other",
      coverImage: req.file.filename,
      createdBy: req.user.id,
    });

    return res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Add recipe error:", error);
    return res
      .status(500)
      .json({ message: "Failed to add recipe. Please try again." });
  }
};

const editRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time, category } = req.body;

    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // ✅ Validation
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({
        message: "Title, ingredients, and instructions are required.",
      });
    }

    let coverImage = req.file?.filename ? req.file.filename : recipe.coverImage;

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { ...req.body, coverImage },
      { new: true }
    );

    res.json(updatedRecipe);
  } catch (error) {
    console.error("Edit recipe error:", error);
    return res
      .status(500)
      .json({ message: "Failed to update recipe. Please try again." });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    await Recipe.deleteOne({ _id: req.params.id });
    res.json({ status: "ok", message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("Delete recipe error:", err);
    return res
      .status(500)
      .json({ message: "Failed to delete recipe. Please try again." });
  }
};

module.exports = {
  getRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  upload,
};
