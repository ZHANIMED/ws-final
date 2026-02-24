const express = require("express");

// creation d'instance
const app = express();

app.use(express.json());
require("dotenv").config();

// connect db
const connectDB = require("./config/connectDB");
connectDB();

// create routes
app.use("/api/user", require("./routes/user"));


// create port
const PORT = process.env.PORT || 2224

// create server
app.listen(PORT, error => {
  error     ? console.error('fail to connect ${error}')
    : console.log('server is running at ${PORT}')
})
