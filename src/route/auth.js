//auth/signup, auth/login, /auth/logout
const express = require("express");
const authRouter = express.Router();
const {validateUser} = require("../utils/validate.js");
const bcrypt = require('bcrypt');
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const {authCookie}= require("../middlewares/auth.js")
const validator = require('validator');
authRouter.post("/signup", async (req,res) =>{
    try{
        validateUser(req);
        const {firstName, lastName, age, city, password, email, contactNo} = req.body;
        const hashedPassword = await bcrypt.hash(password,11);
        const user = new User({firstName, lastName, age, city, password:hashedPassword, email, contactNo});
        await user.save();
        res.status(201).send("user signed up succesfully");
    }
    catch(err){
        res.status(500).send("error while signing up user => " +err);
    }
});
authRouter.post("/login", async (req,res) =>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            throw new Error ("Email and Password are requied to login!!");
        }
        if(!validator.isEmail(email)){
            throw new Error("Email is invalid!!");
        }
        const user =  await User.findOne({
            email:email
        }).select(["firstName","lastName"]);
        if(!user){
            throw new Error("Invalid Credentials!!");
        }
        console.log(user);
        const userPassword = user.password;
        // const isValid =   await bcrypt.compare(password, userPassword);\
        const isValid =  user.validatePassword(password);
        if(!isValid){
            throw new Error("Invalid Credentials!!");
        }
        const token = jwt.sign({
            _id: user._id
        },"SECRET_KEY",{
            expiresIn: "7d"
        });
        // const data =user.select(["firstName","lastName"]);
        res.cookie("token", token).status(200);
        res.json({
            "message":"User logged in succesfully",
            "data": user
        });
    }
    catch(err){
        res.json({
             "message": `Error while logging in ${err}`,
              "Error": err.message

        });
    }
});
authRouter.post("/logout", authCookie,(req, res)=>{
    const token= jwt.sign({},"SECRET_KEY",{
        expiresIn:"0d"
    });

    res.cookie("token",token).send(`${req.user.firstName} logged out succesfully`);
});
module.exports = authRouter;