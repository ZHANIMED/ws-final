import React, { useEffect, useState } from "react";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { editFood, getOneFood } from "../JS/Actions/food";

const EditFood = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { oneFood, loading, errors } = useSelector((state) => state.food);
  const { isAuth, isAdmin } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("meat");
  const [localError, setLocalError] = useState("");

  // ✅ photo
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  // auth guard
  useEffect(() => {
    if (!isAuth) {
      navigate("/login", { replace: true });
      return;
    }
    if (isAuth && !isAdmin) {
      navigate("/foodlist", { replace: true });
    }
  }, [isAuth, isAdmin, navigate]);

  useEffect(() => {
    if (!id) navigate("/foodlist", { replace: true });
  }, [id, navigate]);

  useEffect(() => {
    if (id && isAuth && isAdmin) dispatch(getOneFood(id));
  }, [dispatch, id, isAuth, isAdmin]);

  // remplir form
  useEffect(() => {
    const f = oneFood?.foodToGet ? oneFood.foodToGet : oneFood;
    if (f) {
      setLocalError("");
      setName(f.name || "");
      setPrice(f.price !== undefined && f.price !== null ? String(f.price) : "");
      setCategory(f.category || "meat");

      // ✅ image existante depuis DB
      setPhotoPreview(f.profile_img || "");
      setPhotoFile(null);
    }
  }, [oneFood]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setLocalError("Please select an image file");
      return;
    }

    setLocalError("");
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    const cleanName = name.trim();
    if (!cleanName) return setLocalError("Name is required");

    const numPrice = price === "" ? 0 : Number(price);
    if (Number.isNaN(numPrice)) return setLocalError("Price must be a number");
    if (numPrice < 0) return setLocalError("Price must be >= 0");

    // ✅ Si une nouvelle photo est choisie => FormData
    if (photoFile) {
      const formData = new FormData();
      formData.append("name", cleanName);
      formData.append("category", category);
      formData.append("price", String(numPrice));

      // IMPORTANT: "image" doit matcher upload.single("image") backend
      formData.append("image", photoFile);

      dispatch(editFood(id, formData, navigate));
    } else {
      // ✅ sinon JSON sans changer photo
      dispatch(editFood(id, { name: cleanName, category, price: numPrice }, navigate));
    }
  };

  const f = oneFood?.foodToGet ? oneFood.foodToGet : oneFood;

  return (
    <div className="editfood-page">
      <div className="editfood-card">
        <h2 className="editfood-title">Edit Food</h2>

        {(localError || errors) && (
          <p style={{ color: "red", textAlign: "center" }}>
            {localError || errors}
          </p>
        )}

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : !f ? (
          <p style={{ textAlign: "center" }}>Food not found.</p>
        ) : (
          <form className="editfood-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Food Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="input-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="meat">meat</option>
                <option value="fish">fish</option>
                <option value="vegetables">vegetables</option>
              </select>
            </div>

            {/* ✅ Photo */}
            <div className="input-group">
              <label>Photo</label>
              <input type="file" accept="image/*" onChange={handlePhotoChange} />
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="preview"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    marginTop: 10,
                    borderRadius: 8,
                  }}
                />
              ) : null}
            </div>

            <button className="editfood-btn" type="submit" disabled={loading}>
              Save Changes
            </button>

            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditFood;