const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/connectDB");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// ⚠️ Ne casse pas multipart/form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ ajoute ça




connectDB();

app.use("/api/user", require("./routes/user"));
app.use("/api/food", require("./routes/food"));

console.log("✅ server.js loaded");
console.log("✅ food route mounted at /api/food");


app.use((req, res) => {
  res.send("HELLO")
})




const PORT = process.env.PORT || 4321;

app.listen(PORT, (error) => {
  if (error) console.error(`Fail to connect: ${error}`);
  else console.log(`Server is running at http://localhost:${PORT}`);
});


