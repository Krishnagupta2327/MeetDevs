const jwt= require('jsonwebtoken');
const User = require("../models/user.js")


const adminAuth= (req,res,next)=>{
    const token = req.query.token;
    if(token != "xyz"){
        res.status(401).send("Invalid Admin!!");
    }
    else{
        next();
    }
};
const userAuth = (req,res,next)=>{
    const token= req.query.token;
    if(token!="abc"){
        res.status(401).send("Invalid User!!");
    }
    else{
        next();
    }
};
const authCookie= async (req,res, next) =>{

try{
        const cookie = req.cookies;
        const {token}= cookie;
        if(!token){
            throw new Error("token not valid, Login again!!!");
        }
        const decodedData = jwt.verify(token,"SECRET_KEY");
        const {_id}= decodedData;
        const user= await User.findById(_id);
        req.user= user;
        next();
    }
    catch(err){
        res.status(500).send("error while  token validation: "+ err);
    }
};

module.exports={
    adminAuth,
    userAuth,
    authCookie
}