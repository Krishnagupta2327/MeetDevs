const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { kMaxLength } = require('buffer');
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        // unique: true,
        trim: true,
        // lowercase:true,
         //default: 'Johny'
    },
    lastName:{
        type: String,
        // lowercase:true
    },
    age:{
        type: Number,
        validate: (age)=>{
            if(age<0 || age>=100) {
                throw new Error("Age must be between 0 and 100");
            }
        }
    },
    email:{
        type: String,
        validate(data){
            const val= validator.isEmail(data);
            if(!val){
                throw new Error("Email is invalid");
            }

        },
        lowercase:true,
        unique:true,
        required:true
    },
    contactNo: {
        type: String
        
    },
    password:{
        type: String
    },
    about:{
        type:String,
        maxLength: 200
        
    },
    imgUrl:{
        type:String
    },
    city:{
        type:String
    },
    gender:{
        type: String,
        enum:["male","female"]
    }

},{
    timestamps: true
});
userSchema.methods.validatePassword = async function(passwordByUser){
    try{
    const user = this;
    // console.log('aa');
    // return true;
    const isValid = await bcrypt.compare(passwordByUser, user.password);
    // console.log('a');
    return isValid;
    }catch(err){
        console.log("error while debugging password! "+err);
    }

};
userSchema.methods.getJWT = async function(){
    const user = this;
    const token = jwt.sign({
        _id:user._id
    },process.env.KEY,{
        expiresIn: "7d"
    });
    return token;
};


const User = mongoose.model('User', userSchema);
module.exports = User;