const mongoose = require('mongoose');
const{Schema,model} = mongoose;


const userSchema = new Schema({

    firstname:{
        type:String,
        required:true       
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        
    },
    password:{    
        type:String,
        required:true
    },
    isAdmin :{
        type:Boolean,
        default:false
    }
})  

module.exports = User=model("user",userSchema)



