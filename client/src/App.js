import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { current } from "./JS/Actions/user";

import Navbar from "./Components/Navbar";

import Home from "./Pages/Home";
import FoodList from "./Pages/FoodList";
import AddFood from "./Pages/AddFood";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";

import EditFood from "./Pages/EditFood";

function App() {
  const dispatch = useDispatch();

  // 🔐 Rester connecté après refresh
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(current());
    }
  }, [dispatch]);

  return (
    <Router>
      <Navbar />

      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/foodlist" element={<FoodList />} />
  <Route path="/addfood" element={<AddFood />} />
  <Route path="/editfood/:id" element={<EditFood />} />  {/* ✅ ici */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/profile" element={<Profile />} />


</Routes>
    </Router>
  );
}

export default App;