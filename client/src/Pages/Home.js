import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../App.css";

const Home = () => {
  const { isAuth, isAdmin } = useSelector((state) => state.user);

  return (
    <div className="home-page">
      <div className="home-card">
        <h1 className="home-title">Welcome to FoodApp 🍽️</h1>
        <p className="home-subtitle">
          Manage your food items easily and efficiently
        </p>

        {/* ✅ Affichage conditionnel */}
        {isAuth && (
          <div className="home-buttons">
            {/* Visible pour tout utilisateur connecté */}
            <Link to="/foodlist" className="home-btn">
              View Food List
            </Link>

            {/* Visible uniquement pour admin */}
            {isAdmin && (
              <Link to="/addfood" className="home-btn secondary">
                Add New Food
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;