const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const foodSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },

    category: {
      type: String,
      required: true,
      enum: ["meat", "fish", "vegetables"],
      default: "meat",
    },

    price: { type: Number, default: 0 },

    profile_img: { type: String, default: "" },
    cloudinary_id: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("food", foodSchema);



