const User = require('../Model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') 



exports.register = async (req,res)=>{
    try {
        const {firstname,name,email,password} = req.body;
        
        const founduser = await User.findOne({email})
        if(founduser){
            return res.status(400).send({errors:[{msg:"email déja exist"}]});
        }
        const user = await User.create(req.body)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
       const newUser=new User({...req.body})
       newUser.password=hashedPassword;

       await newUser.save()

       const token = jwt.sign({
        id:user._id, isAdmin:user.isAdmin},process.env.SCRT_KEY,{expiresIn:"48h"})
        
        res.status(200).send({succes : [{msg:"Inscription avec success "}],user,token}) 


           } catch (error) {
        res.status(400).send({errors:[{msg:"Try again"}]})
            
    }
}


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(400).send({
        errors: [{ msg: "email introuvable" }]
      });
    }

    const checkPassword = await bcrypt.compare(password, foundUser.password);

    if (!checkPassword) {
      return res.status(400).send({
        errors: [{ msg: "email password incorrect" }]
      });
    }

    const token = jwt.sign(
      {
        id: newUser._id
      },
      process.env.SCRT_KEY,
      { expiresIn: "48h" }
    );

    res.status(200).send({
      success: [{ msg: "connexion avec success .. " }],
      user: foundUser,
      token
    });

  } catch (error) {
    console.log(error);
  }
};