const express=require('express');
const { register, login } = require('../controllers/user');
const { registerValidator, validation, loginValidator } = require('../middlewares/Validator');
const isAuth = require('../middlewares/isAuth');




const router=express.Router() ;




router.post("/register",registerValidator(),validation,register)

router.post("/login", loginValidator(),validation,login)
router.get("/current",isAuth,(req,res)=> {  res.send(req.user)})



module.exports=router
