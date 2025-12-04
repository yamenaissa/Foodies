import React, { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import foodImg from "../assets/foodRecipe.png";
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import SearchAndFilter from "./SearchAndFilter";

export default function RecipeItems() {
  const recipes = useLoaderData();
  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  let path = window.location.pathname === "/myRecipe" ? true : false;
  let favItems = JSON.parse(localStorage.getItem("fav")) ?? [];
  const [isFavRecipe, setIsFavRecipe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAllRecipes(recipes || []);
    setFilteredRecipes(recipes || []);
  }, [recipes]);

  // Filter recipes based on search term and category
  useEffect(() => {
    let filtered = allRecipes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((recipe) => {
        const titleMatch = recipe.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const ingredientsMatch = recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return titleMatch || ingredientsMatch;
      });
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (recipe) => recipe.category === selectedCategory
      );
    }

    setFilteredRecipes(filtered);
  }, [searchTerm, selectedCategory, allRecipes]);

  const onDelete = async (id) => {
    await axios
      .delete(`http://localhost:5000/recipe/${id}`)
      .then((res) => {
        console.log(res);
        toast.success("Recipe deleted successfully!");
        setAllRecipes((recipes) =>
          recipes.filter((recipe) => recipe._id !== id)
        );
        let filterItem = favItems.filter((recipe) => recipe._id !== id);
        localStorage.setItem("fav", JSON.stringify(filterItem));
      })
      .catch((error) => {
        toast.error("Failed to delete recipe");
      });
  };

  const favRecipe = (item) => {
    let filterItem = favItems.filter((recipe) => recipe._id !== item._id);
    const isAlreadyFav =
      favItems.filter((recipe) => recipe._id === item._id).length > 0;

    favItems = !isAlreadyFav ? [...favItems, item] : filterItem;

    localStorage.setItem("fav", JSON.stringify(favItems));
    setIsFavRecipe((pre) => !pre);

    if (!isAlreadyFav) {
      toast.success("Added to favourites! ❤️");
    } else {
      toast.info("Removed from favourites");
    }
  };

  return (
    <>
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {filteredRecipes.length === 0 ? (
        <div className="no-recipes">
          <h3>No recipes found</h3>
          <p>Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="card-container">
          {filteredRecipes.map((item, index) => {
            return (
              <div
                key={index}
                className="card"
                onDoubleClick={() => navigate(`/recipe/${item._id}`)}
              >
                <img
                  src={`http://localhost:5000/images/${item.coverImage}`}
                  width="120px"
                  height="100px"
                  alt={item.title}
                ></img>
                <div className="card-body">
                  <div className="title">{item.title}</div>
                  <div className="category-badge">
                    {item.category || "Other"}
                  </div>
                  <div className="icons">
                    <div className="timer">
                      <BsStopwatchFill />
                      {item.time}
                    </div>
                    {!path ? (
                      <FaHeart
                        onClick={() => favRecipe(item)}
                        style={{
                          color: favItems.some((res) => res._id === item._id)
                            ? "red"
                            : "",
                        }}
                      />
                    ) : (
                      <div className="action">
                        <Link
                          to={`/editRecipe/${item._id}`}
                          className="editIcon"
                        >
                          <FaEdit />
                        </Link>
                        <MdDelete
                          onClick={() => onDelete(item._id)}
                          className="deleteIcon"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
