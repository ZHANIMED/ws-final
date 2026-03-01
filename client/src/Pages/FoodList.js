import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API_URL = "http://localhost:4321";

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const { isAuth, isAdmin } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchFoods = async () => {
    try {
      setErrorMsg("");
      const res = await axios.get(`${API_URL}/api/food/allfood`);
      setFoods(res.data.listFood || []);
    } catch (error) {
      console.error("Error fetching foods:", error?.response?.data || error.message);
      setErrorMsg(
        error?.response?.data?.msg ||
        error?.response?.data?.error ||
        "Erreur lors du chargement"
      );
    }
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login", { replace: true });
      return;
    }
    fetchFoods();
  }, [isAuth, navigate]);

  const handleDelete = async (id) => {
    if (!isAdmin) {
      alert("You are not admin. You cannot delete this item.");
      return;
    }

    const ok = window.confirm("Are you sure you want to delete this food?");
    if (!ok) return;

    try {
      setErrorMsg("");
      await axios.delete(`${API_URL}/api/food/${id}`, {
        headers: { authorization: localStorage.getItem("token") },
      });
      fetchFoods();
    } catch (error) {
      const status = error?.response?.status;
      const msg =
        error?.response?.data?.msg ||
        error?.response?.data?.error ||
        error.message;

      console.error("Delete error:", status, msg);

      if (status === 401 || status === 403) {
        setErrorMsg("Session expired or not authorized. Please login again.");
        navigate("/login", { replace: true });
        return;
      }

      setErrorMsg(msg || "Delete failed");
    }
  };

  return (
    <div className="foodlist-page">
      <div className="foodlist-card" style={{ width: "900px" }}>
        <h2 className="foodlist-title">Food List</h2>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        {foods.length === 0 ? (
          <div className="empty-state">No food available</div>
        ) : (
          <div className="food-grid">
            {foods.map((f) => (
              <div className="food-item" key={f._id}>
                <img
                  className="food-img"
                  src={f.profile_img || "https://via.placeholder.com/300x180"}
                  alt={f.name}
                />

                <div className="food-body">
                  <h3>{f.name}</h3>
                  <p className="cat">{f.category}</p>

                  {/* ✅ MODIFIÉ ICI */}
                  <p className="price">{f.price} DT</p>

                  {isAdmin && (
                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        onClick={() => navigate(`/editfood/${f._id}`)}
                        style={{
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(f._id)}
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodList;