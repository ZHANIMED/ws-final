import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../JS/Actions/user"; // ✅ adapte si besoin
import "./Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuth, isAdmin } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">FoodApp</div>

      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        {isAuth && (
          <li>
            <Link to="/foodlist">Food List</Link>
          </li>
        )}

        {isAuth && isAdmin && (
          <li>
            <Link to="/addfood">Add Food</Link>
          </li>
        )}

        {!isAuth && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}

        {isAuth && (
          <>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;