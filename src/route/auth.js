//auth/signup, auth/login, /auth/logout
const express = require("express");
const authRouter = express.Router();
const {validateUser} = require("../utils/validate.js");
const bcrypt = require('bcrypt');
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const {authCookie}= require("../middlewares/auth.js")
const validator = require('validator');
const sendEmail = require('../utils/sendEmail.js');


authRouter.post("/signup", async (req,res) =>{
    try{
        validateUser(req);
        const {firstName, lastName, age, city, password, email, contactNo,imgUrl, gender, about} = req.body;
        const findUser= await User.findOne({ email:email});
        if(findUser) throw new Error("Email already registered!!");
// 
        const hashedPassword = await bcrypt.hash(password,11);
        const user = new User({firstName, lastName, age, city, password:hashedPassword, email, contactNo,imgUrl, about, gender});
        await user.save();
        res.status(201).send("user signed up succesfully");
    }
    catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
});
authRouter.post("/login", async (req,res) =>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            throw new Error ("Email and Password are requied to login!!!");
        }
       
        if(!validator.isEmail(email)){
            throw new Error("Email is invalid!!");
        }
       
        const user =  await User.findOne({
            email:email
        }).select(["firstName","lastName","age","city","imgUrl","about","email","contactNo","password"]);
        if(!user){
            throw new Error("Invalid Credentials!!");
        }

        const userPassword = user.password;
        const isValid =   await bcrypt.compare(password, userPassword);
        // const isValid =  await user.validatePassword(password);
        if(!isValid){
            throw new Error("Invalid Credentialss!!");
        }
    
        const token = jwt.sign({
            _id: user._id
        },process.env.SECRET_KEY,{
            expiresIn: "7d"
        });
  
        const ress = await sendEmail({
            to: ["krishna.kietian@gmail.com"],
            sub: "Login attention",
            body : `${user.firstName} has login at meetdevs.online`
        });
        console.log(ress);
        // console.log("kkSeff : "+ process.env.secretKey);
        // const data =user.select(["firstName","lastName"]);
        res.cookie("token", token).status(200).json({
            "message":"User logged in succesfully",
            "data": user
        });
    }
    catch(err){
    
        res.status(300).json({
             "message": `Error while logging in : ${err}`,
              "Error": err.message

        });
    }
});
authRouter.post("/logout", authCookie, (req, res)=>{
  
    res.clearCookie("token");

    res.send(`${req.user.firstName} logged out succesfully`);
});
module.exports = authRouter;
