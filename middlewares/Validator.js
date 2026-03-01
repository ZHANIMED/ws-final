const {check ,validationResult}=require("express-validator")


exports.registerValidator =()=> [
    check("firstname","insérer votre prénom").not().isEmpty(),
        check("name","insérer votre nom").not().isEmpty(),
    check("email","insérer votre email").isEmail(),
    check("password"," votre password de taille 6 min ").isLength ({min:6}),


]


exports.loginValidator =()=> [
    check("email","insérer votre email").isEmail(),
    check("password"," votre password de taille 6 min ").isLength ({min:6}),
]


exports.validation=(req,res,next)=> {
    const errors=validationResult(req)
    if (!errors.isEmpty() )  {
                res.status(400).send({errors : {errors :errors.array()}})

    }
   return next()
}
