import React, { useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import "../App.css";

const API_URL = "http://localhost:4321"; // ✅ centralisé

const AddFood = () => {
  const navigate = useNavigate();
  const { isAuth, isAdmin } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("meat");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fileRef = useRef(null); // ✅ pour reset input file

  if (!isAuth) return <Navigate to="/login" replace />;

  if (!isAdmin) {
    return (
      <div className="addfood-page">
        <div className="addfood-card">
          <h2>Access denied</h2>
          <p>Only admin can add food.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMsg("Please enter a name");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", cleanName);
      formData.append("category", category);
      formData.append("price", price === "" ? "0" : String(price)); // ✅ string
      if (image) formData.append("image", image);

      // ✅ debug (tu peux enlever après)
      // for (const [k, v] of formData.entries()) console.log("FD:", k, v);

      await axios.post(`${API_URL}/api/food/add-food`, formData, {
        headers: {
          authorization: localStorage.getItem("token"),
          // ✅ NE PAS mettre Content-Type
        },
      });

      // ✅ reset
      setName("");
      setCategory("meat");
      setPrice("");
      setImage(null);
      if (fileRef.current) fileRef.current.value = ""; // ✅ reset file input

      navigate("/foodlist");
    } catch (error) {
      const status = error?.response?.status;
      const msg =
        error?.response?.data?.msg ||
        error?.response?.data?.error ||
        error.message ||
        "Erreur lors de l'ajout";

      setErrorMsg(status ? `${status} - ${msg}` : msg);
    }
  };

  return (
    <div className="addfood-page">
      <div className="addfood-card">
        <h2 className="addfood-title">Add Food</h2>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="addfood-form">
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Food name"
              required
            />
          </div>

          <div className="input-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="meat">meat</option>
              <option value="fish">fish</option>
              <option value="vegetables">vegetables</option>
            </select>
          </div>

          <div className="input-group">
            <label>Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              min="0"
            />
          </div>

          <div className="input-group">
            <label>Image (optional)</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>

          <button className="addfood-btn" type="submit">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFood;