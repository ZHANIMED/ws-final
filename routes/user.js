const express = require("express");
const { register, login } = require("../controllers/user");
const isAuth = require("../middlewares/isAuth");


const router = express.Router();

router.post("/register", register);

router.post("/login",login);

router.get("/current", isAuth, (req, res) => {
  res.send(req.user);
});