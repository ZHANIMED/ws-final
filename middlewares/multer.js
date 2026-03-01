const multer = require("multer");
const path = require("path");

module.exports = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 5 * 1024 * 1024 }, // ✅ 5MB optionnel
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) {
      return cb(new Error("File type is not supported"), false);
    }
    cb(null, true);
  },
});