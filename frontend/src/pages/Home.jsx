import React, { useState } from "react";
import foodRecipe from "../assets/foodRecipe.png";
import RecipeItems from "../components/RecipeItems";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import InputForm from "../components/InputForm";

export default function Home() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const addRecipe = () => {
    let token = localStorage.getItem("token");
    if (token) navigate("/addRecipe");
    else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <section className="home">
        <div className="left">
          <h1>Foodies</h1>
          <h5>
            Welcome to Foodies, where food lovers unite! Share your favorite
            recipes, discover new dishes from around the world, and connect with
            a passionate community of home cooks. Whether you're a beginner or a
            seasoned chef, there's a place for you at our table. Start sharing
            your culinary creations today!
          </h5>
          <button onClick={addRecipe}>Share your recipe</button>
        </div>
        <div className="right">
          <img src={foodRecipe} width="320px" height="300px"></img>
        </div>
      </section>
      <div className="bg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#d4f6e8"
            fillOpacity="1"
            d="M0,32L18.5,48C36.9,64,74,96,111,128C147.7,160,185,192,222,186.7C258.5,181,295,139,332,117.3C369.2,96,406,96,443,122.7C480,149,517,203,554,234.7C590.8,267,628,277,665,245.3C701.5,213,738,139,775,122.7C812.3,107,849,149,886,170.7C923.1,192,960,192,997,165.3C1033.8,139,1071,85,1108,106.7C1144.6,128,1182,224,1218,234.7C1255.4,245,1292,171,1329,149.3C1366.2,128,1403,160,1422,176L1440,192L1440,320L1421.5,320C1403.1,320,1366,320,1329,320C1292.3,320,1255,320,1218,320C1181.5,320,1145,320,1108,320C1070.8,320,1034,320,997,320C960,320,923,320,886,320C849.2,320,812,320,775,320C738.5,320,702,320,665,320C627.7,320,591,320,554,320C516.9,320,480,320,443,320C406.2,320,369,320,332,320C295.4,320,258,320,222,320C184.6,320,148,320,111,320C73.8,320,37,320,18,320L0,320Z"
          ></path>
        </svg>
      </div>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
      <div className="recipe">
        <RecipeItems />
      </div>
    </>
  );
}
