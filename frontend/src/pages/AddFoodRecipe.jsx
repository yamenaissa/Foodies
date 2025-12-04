import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddFoodRecipe() {
  const [recipeData, setRecipeData] = useState({});
  const navigate = useNavigate();

  const categories = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Snack",
    "Vegan",
    "Vegetarian",
    "Other",
  ];

  const onHandleChange = (e) => {
    let val =
      e.target.name === "ingredients"
        ? e.target.value.split(",")
        : e.target.name === "file"
        ? e.target.files[0]
        : e.target.value;
    setRecipeData((pre) => ({ ...pre, [e.target.name]: val }));
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !recipeData.title ||
      !recipeData.ingredients ||
      !recipeData.instructions
    ) {
      toast.warning("Please fill in all required fields");
      return;
    }

    if (!recipeData.file) {
      toast.warning("Please upload a recipe image");
      return;
    }

    console.log(recipeData);
    await axios
      .post("http://localhost:5000/recipe", recipeData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: "bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        toast.success("Recipe added successfully!");
        navigate("/");
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Failed to add recipe";
        toast.error(errorMessage);
      });
  };

  return (
    <>
      <div className="container">
        <form className="form" onSubmit={onHandleSubmit}>
          <div className="form-control">
            <label>Title</label>
            <input
              type="text"
              className="input"
              name="title"
              onChange={onHandleChange}
            ></input>
          </div>
          <div className="form-control">
            <label>Category</label>
            <select className="input" name="category" onChange={onHandleChange}>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label>Time</label>
            <input
              type="text"
              className="input"
              name="time"
              onChange={onHandleChange}
              placeholder="e.g., 30 min"
            ></input>
          </div>
          <div className="form-control">
            <label>Ingredients (comma separated)</label>
            <textarea
              type="text"
              className="input-textarea"
              name="ingredients"
              rows="5"
              onChange={onHandleChange}
              placeholder="e.g., 2 eggs, 1 cup flour, 1/2 cup milk"
            ></textarea>
          </div>
          <div className="form-control">
            <label>Instructions</label>
            <textarea
              type="text"
              className="input-textarea"
              name="instructions"
              rows="5"
              onChange={onHandleChange}
              placeholder="Describe the cooking steps..."
            ></textarea>
          </div>
          <div className="form-control">
            <label>Recipe Image</label>
            <input
              type="file"
              className="input"
              name="file"
              onChange={onHandleChange}
            ></input>
          </div>
          <button type="submit">Add Recipe</button>
        </form>
      </div>
    </>
  );
}
