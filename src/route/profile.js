const  express = require("express");
const profileRouter = express.Router();
//const jwt = require('jsonwebtoken');
const User= require("../models/user.js");
const {authCookie}= require("../middlewares/auth.js");


profileRouter.get('/profile/view',authCookie ,async (req,res)=>{
    try{
        // const cookie = req.cookies;
        // const {token} = cookie;
        // if(!token){
        //     throw new Error("User not logged in!!");
        // }
        // const encodedData =  jwt.verify(token,  "SECRET_KEY");
        // const {_id}= encodedData;
        // const user = await User.findById(_id);
        const data= await User.findById(req.user._id)
        .select(["firstName","lastName","age"]);
        res.status(200).json({
            "message": "User profile is ready   to view.",
            'user': data
        });
    }
    catch(err){

        res.status(500).send("Error while viewing profile " +err);
    }
});
profileRouter.patch("/profile/update", authCookie, async (req,res)=>{
    try{
    const allowedChanges= ["firstName", "lastName", "age","contactNo"];
    const body = req.body;
    const user= req.user;
    const isAllowed = Object.keys(body).every((key)=> allowedChanges.includes(key));
    if(!isAllowed){
        throw new Error("cant change Invalid field!!");
    }
    allowedChanges.forEach((key)=>{
        user[key]=body[key];
    });
    await user.save();
    res.json({
        "message": "user updated succesfullyy",
        "user": user

    });

    }
    catch(err){
        res.send("Error while updating user "+err);
    }


});
profileRouter.patch("/profile/passwordUpdate", authCookie, async(req,res)=>{


});

module.exports = profileRouter;