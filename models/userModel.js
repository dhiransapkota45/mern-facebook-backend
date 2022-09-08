const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    firstname:String,
    lastname:String,
    password:String,
    email:{
        type:String,
        unique:true
    },
    birthday:Date,
    creation_date:{
        type:Date,
        default:Date.now
    },
    gender:String,
    profile_picture:{
        type:String,
        default:""
    }  
})

const userModel = new mongoose.model("usermodel", userSchema)
module.exports = userModel