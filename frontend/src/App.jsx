import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import MainNavigation from "./components/MainNavigation";
import axios from "axios";
import AddFoodRecipe from "./pages/AddFoodRecipe";
import EditRecipe from "./pages/EditRecipe";
import RecipeDetails from "./pages/RecipeDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getAllRecipes = async () => {
  let allRecipes = [];
  await axios.get("http://localhost:5000/recipe").then((res) => {
    allRecipes = res.data;
  });
  return allRecipes;
};

const getMyRecipes = async () => {
  let user = JSON.parse(localStorage.getItem("user"));
  let allRecipes = await getAllRecipes();
  return allRecipes.filter((item) => item.createdBy === user._id);
};

const getFavRecipes = () => {
  return JSON.parse(localStorage.getItem("fav"));
};

const getRecipe = async ({ params }) => {
  let recipe;
  await axios
    .get(`http://localhost:5000/recipe/${params.id}`)
    .then((res) => (recipe = res.data));

  await axios
    .get(`http://localhost:5000/user/${recipe.createdBy}`)
    .then((res) => {
      recipe = { ...recipe, email: res.data.email };
    });

  return recipe;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation></MainNavigation>,
    children: [
      { path: "/", element: <Home></Home>, loader: getAllRecipes },
      { path: "/myRecipe", element: <Home></Home>, loader: getMyRecipes },
      { path: "/favRecipe", element: <Home></Home>, loader: getFavRecipes },
      { path: "/addRecipe", element: <AddFoodRecipe></AddFoodRecipe> },
      { path: "/editrecipe/:id", element: <EditRecipe></EditRecipe> },
      { path: "/recipe/:id", element: <RecipeDetails />, loader: getRecipe },
    ],
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
