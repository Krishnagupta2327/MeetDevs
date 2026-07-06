const  express = require("express");
const profileRouter = express.Router();
//const jwt = require('jsonwebtoken');
const User= require("../models/user.js");
const {authCookie}= require("../middlewares/auth.js");


profileRouter.get('/profile/view' ,authCookie ,async (req,res)=>{
    try{
       const uid= req.user._id;

        const data= await User.findById(uid)
        .select(["firstName","lastName","age","about","imgUrl","city","gender"]);
        console.log("jikiop")
        console.log(data)
        res.status(200).send(data);
        //.json({
    //         "message": "User profile is ready to view.",
    //         'user': data
    //     }
    // );
    }
    catch(err){
        res.status(500).send("Error while viewing profile " +err);
        // res.status(309).send(err);
    }
});
profileRouter.patch("/profile/update", authCookie, async (req,res)=>{
    try{
    const allowedChanges= ["firstName", "lastName", "age","contactNo","about","city","gender","imgUrl"];
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
    res.status(200).json({
        "message": "user updated succesfullyy",
        "user": user
    });

    }
    catch(err){
        res.send("Error while updating user "+err);
    }


});
profileRouter.patch("/profile/passwordUpdate", authCookie, async(req,res)=>{
    const user =req.user;
    const userId= req.user._id;
    const newPasswd = req.body.newPasswd;
    

});

module.exports = profileRouter;