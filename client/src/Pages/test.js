import React, { useRef, useState } from "react";
import axios from "axios";
import "../App.css";

const AddFood = () => {
  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("meat");
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState("");

  const fileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const formData = new FormData();
      formData.append("name", foodName);
      formData.append("price", price);
      formData.append("category", category);
      if (image) formData.append("profile_img", image);

      // ✅ IMPORTANT: URL RELATIVE (proxy)
      await axios.post("/api/food/add-food", formData);

      setMsg("✅ Food added successfully!");
      setFoodName("");
      setPrice("");
      setCategory("meat");
      setImage(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      console.log("STATUS:", err?.response?.status);
      console.log("DATA:", err?.response?.data);

      setMsg(
        "❌ Error: " +
          (err?.response?.data?.errors?.[0]?.msg ||
            err?.response?.data?.message ||
            err.message)
      );
    }
  };

  return (
    <div className="addfood-page">
      <div className="addfood-card">
        <h2 className="addfood-title">Add New Food</h2>
        <p className="addfood-subtitle">Fill the details below</p>

        {msg && <p style={{ textAlign: "center" }}>{msg}</p>}

        <form className="addfood-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Food Name</label>
            <input
              type="text"
              placeholder="Enter food name"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Price</label>
            <input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                border: "1px solid #ddd",
              }}
            >
              <option value="meat">meat</option>
              <option value="fish">fish</option>
              <option value="vegetables">vegetables</option>
            </select>
          </div>

          <div className="input-group">
            <label>Image</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button className="addfood-btn" type="submit">
            Add Food
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFood;
