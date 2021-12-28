const mongoose = require("mongoose");
const validator = require("validator");

// now we are creating an instance of mongoose schema

const UserSchema = new mongoose.Schema({
    name : {
        type:String,
        maxlength:50
    },
    email : {
        type:String,
        required:true,
        minlength:5,
        maxlength:255,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email");
            }
        }
    },
    password : {
        type:String,
        required:true,
        minlength:5,
        maxlength:50,
    }
});
// we will create a collection(i.e table) = User
const User = new mongoose.model('User' ,UserSchema);
module.exports = User;