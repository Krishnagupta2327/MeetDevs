const jwt= require('jsonwebtoken');
const User = require("../models/user.js")
console.log("hiiKli");
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

console.log("kksech: "+ SECRET_KEY);
const adminAuth= (req,res,next)=>{
    const token = req.query.token;
    if(token != "xyz"){
        res.status(401).send("Invalid Admin!!");
    }
    else{
        next();
    }

};
const userAuth = (req,res,next) => {

    const token= req.query.token;
    if(token!="abc"){
        res.status(401).send("Invalid User!!");
    }
    else{
        next();
    }
};
const authCookie = async (req, res, next) => {
    try{
        const cookie= req.cookies;
    
        
        const {token}= cookie;
        if(!token){
            res.status(401).send("Token is not valid, Login again!!");
        }
       
        const decodedData= jwt.verify(token, SECRET_KEY);
      
        const {_id}= decodedData;
        const user= await User.findById(_id);
        req.user=user;
        console.log("ok");
        next();

    }
    catch(err){
        // next(err);
        res.status(502).send("Error while viewing profile " +err);
    }
}
const authCookiee = async (req,res, next) =>{

try{
    console.log(1);
        const cookie = req.cookies;
        console.log(13);
        const {token}= cookie;
        console.log(12);
        if(!token){
            console.log(14);
            throw new Error("token not valid, Login again!!!");
            console.log(17);
        }
        console.log(13);
        const decodedData = jwt.verify(token,SECRET_KEY);
        console.log(31);
        const {_id}= decodedData;
        const user= await User.findById(_id);
        console.log(15);
        req.user= user;
        console.log(133);
        next();
    }
    catch(err){
        res.status(500).send("error while  token validation: "+ err);
    }
};

module.exports= {
    adminAuth,
    userAuth,
    authCookie
}