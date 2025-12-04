import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditRecipe() {
  const [recipeData, setRecipeData] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

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

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`http://localhost:5000/recipe/${id}`)
        .then((response) => {
          let res = response.data;
          setRecipeData({
            title: res.title,
            ingredients: res.ingredients.join(","),
            instructions: res.instructions,
            time: res.time,
            category: res.category || "Other",
          });
        })
        .catch((error) => {
          toast.error("Failed to load recipe");
        });
    };
    getData();
  }, []);

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

    console.log(recipeData);
    await axios
      .put(`http://localhost:5000/recipe/${id}`, recipeData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: "bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        toast.success("Recipe updated successfully!");
        navigate("/myRecipe");
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Failed to update recipe";
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
              value={recipeData.title}
            ></input>
          </div>
          <div className="form-control">
            <label>Category</label>
            <select
              className="input"
              name="category"
              onChange={onHandleChange}
              value={recipeData.category}
            >
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
              value={recipeData.time}
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
              value={recipeData.ingredients}
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
              value={recipeData.instructions}
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
          <button type="submit">Edit Recipe</button>
        </form>
      </div>
    </>
  );
}
