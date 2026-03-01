const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Debug (à laisser pendant le test puis enlever)
//if (!process.env.CLOUDINARY_CLOUD_NAME) {
  //console.log("❌ CLOUDINARY_CLOUD_NAME is missing in .env");
//}
//if (!process.env.CLOUDINARY_API_KEY) {
 // console.log("❌ CLOUDINARY_API_KEY is missing in .env");
////}
//if (!process.env.CLOUDINARY_API_SECRET) {
 // console.log("❌ CLOUDINARY_API_SECRET is missing in .env");
//}

module.exports = cloudinary;


