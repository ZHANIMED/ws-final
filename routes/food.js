const express = require("express");
const mongoose = require("mongoose");
const Food = require("../model/food");
const cloudinary = require("../middlewares/cloudinary");
const upload = require("../middlewares/multer");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

console.log("✅ routes/food.js loaded");

// ✅ DEBUG
router.get("/whoami", (req, res) => res.send("I am routes/food.js ✅"));

// ✅ GET ALL (routes statiques d'abord)
router.get("/allfood", async (req, res) => {
  try {
    const listFood = await Food.find().sort({ createdAt: -1 });
    return res.status(200).send({ msg: "all foods", listFood });
  } catch (error) {
    return res.status(500).send({ msg: "cannot get foods", error: error.message });
  }
});

// ✅ ADD (AVANT /:id)
router.post("/add-food", isAuth, isAdmin, (req, res) => {
  upload.single("image")(req, res, async (err) => {
    try {
      if (err) return res.status(400).send({ msg: err.message || "Upload error" });

      const name = String(req.body?.name || "").trim();
      const category = String(req.body?.category || "").trim();
      const price =
        req.body?.price === "" || req.body?.price == null ? 0 : Number(req.body.price);

      if (!name) return res.status(400).send({ msg: "Name is required" });
      if (!category) return res.status(400).send({ msg: "Category is required" });
      if (Number.isNaN(price)) return res.status(400).send({ msg: "Price must be a number" });

      const allowed = ["meat", "fish", "vegetables"];
      if (!allowed.includes(category)) {
        return res.status(400).send({ msg: "Invalid category" });
      }

      let result = null;
      if (req.file) {
        result = await cloudinary.uploader.upload(req.file.path);
      }

      const newFood = new Food({
        name,
        category,
        price,
        profile_img: result ? result.secure_url : "",
        cloudinary_id: result ? result.public_id : "",
      });

      await newFood.save();
      return res.status(200).send({ msg: "food added", newFood });
    } catch (error) {
      if (error.code === 11000) return res.status(400).send({ msg: "Food name already exists" });
      return res.status(400).send({ msg: "food not added", error: error.message });
    }
  });
});

// ✅ GET ONE (APRES routes statiques)
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({ msg: "Invalid id" });
    }

    const foodToGet = await Food.findById(req.params.id);
    if (!foodToGet) return res.status(404).send({ msg: "Food not found" });

    return res.status(200).send({ msg: "one food", foodToGet });
  } catch (error) {
    return res.status(500).send({ msg: "cannot get food", error: error.message });
  }
});

// ✅ EDIT (avec ou sans photo)
router.put("/:id", isAuth, isAdmin, (req, res) => {
  upload.single("image")(req, res, async (err) => {
    try {
      if (err) return res.status(400).send({ msg: err.message || "Upload error" });

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ msg: "Invalid id" });
      }

      const food = await Food.findById(req.params.id);
      if (!food) return res.status(404).send({ msg: "Food not found" });

      const name = req.body?.name !== undefined ? String(req.body.name).trim() : undefined;
      const category = req.body?.category !== undefined ? String(req.body.category).trim() : undefined;

      const price =
        req.body?.price === undefined || req.body?.price === null || req.body?.price === ""
          ? undefined
          : Number(req.body.price);

      if (price !== undefined && Number.isNaN(price)) {
        return res.status(400).send({ msg: "Price must be a number" });
      }

      if (category !== undefined) {
        const allowed = ["meat", "fish", "vegetables"];
        if (!allowed.includes(category)) {
          return res.status(400).send({ msg: "Invalid category" });
        }
      }

      // ✅ update champs texte
      if (name !== undefined) food.name = name;
      if (category !== undefined) food.category = category;
      if (price !== undefined) food.price = price;

      // ✅ update image si une nouvelle image est envoyée
      if (req.file) {
        // supprimer ancienne image Cloudinary
        if (food.cloudinary_id) {
          await cloudinary.uploader.destroy(food.cloudinary_id);
        }

        // upload nouvelle image
        const result = await cloudinary.uploader.upload(req.file.path);

        food.profile_img = result.secure_url;
        food.cloudinary_id = result.public_id;
      }

      await food.save();

      return res.status(200).send({ msg: "food updated", updated: food });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).send({ msg: "Food name already exists" });
      }
      return res.status(400).send({ msg: "food not updated", error: error.message });
    }
  });
});

// ✅ DELETE
router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({ msg: "Invalid id" });
    }

    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).send({ msg: "Food not found" });

    if (food.cloudinary_id) {
      await cloudinary.uploader.destroy(food.cloudinary_id);
    }

    await Food.findByIdAndDelete(req.params.id);
    return res.status(200).send({ msg: "food deleted" });
  } catch (error) {
    return res.status(400).send({ msg: "food not deleted", error: error.message });
  }
});

module.exports = router;