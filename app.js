// const validator= require('validator');
// const bcrypt = require('bcrypt');
// const mongoose = require('mongoose');
// const jsonwebtoken = require("jsonwebtoken");
// const {validateUser} = require('./utils/validate.js');
// const User = require("./models/user.js");
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/database.js');
const authRouter = require('./src/route/auth.js');
const profileRouter = require('./src/route/profile.js');
const connectionRouter = require('./src/route/connectonRequest.js');
const userRouter = require("./src/route/user.js")
const app = express();
connectDB()
.then(() => {
    console.log("Connected to DB");
    app.listen(7777, () => {
        console.log("Server is running successfully on port 7777");
    });
})
.catch((err)=>{
    console.log("Error connecting to DB!!",err);
});


app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:"192.168.0.100:5173",
    credentials:true
}));

app.use((req,res,next)=>{
    console.log(req.method, req.url);
    next();
});
app.get("/",(req,res)=>{
   " hd";
   console.log('hii');
   res.send("hii");
});
app.use("/", authRouter);
app.use("/",profileRouter)
app.use("/", connectionRouter);
app.use("/", userRouter);

// const now = new Date();
// console.log(now.toda);
// app.patch("/update", async (req,res)=>{
//     const userId= req.body._id;
//     const data= req.body;
//     console.log(req.body);
//     const userq = await User.findByIdAndUpdate(userId,data,{
//         returnDocument:'before'
//     });
//     console.log(userq);
//     res.send("User updated succesfullyy");
// });
// app.patch("/updateUser/:userId", async (req,res)=>{
//     const userData = req.body;
//     const userId = req.params.userId;
//     try{
//         const allowedFields = ['lastName', 'city', 'contactNo'];
//         const flag = Object.keys(userData).every((k)=> allowedFields.includes(k));
//         if(!flag){
//             throw new Error("can not update user..");
//         }
//         await User.findByIdAndUpdate(userId, userData,{
//             returnType :'before'
//         });
//         res.send("user updated succesfullyy");
//     }
//     catch(err){
//         res.status(500).send("Error whiel updating user "+err);
//     }
// });
// app.delete("/deleteByName", async (req, res)=>{
//     const userName = req.body.contactNo;
//     const a = await User.deleteMany({
//         contactNo: userName
//     });
//     console.log(a);
//     res.send("users deleted successfullyy");
// });
// app.delete("/delete",async (req, res) =>{
//     const userId= req.body._id;
//     await User.findByIdAndDelete(userId);
//     res.send("user deleted successfullyy");
// });
// app.get("/login",async (req, res)=>{
//     const {email, password} = req.body;
//     try{
//         if(! validator.isEmail(email)){
//             throw new Error("Email is not valid!!");
//         }
//         const userr= await User.findOne({email:email});
//         if(!userr){
//             res.status(404).send("User not found with this email!!");
//         }
//         const flag = userr.validatePassword(password);
//         if(flag){
//             const cookieToken = await userr.getJWT();
//             res.cookie("token", cookieToken).status(200).send("User login successfullyy");
//         }else{
//             res.status(400).send("passord is wrong!!");
//         }
//     }
//     catch(err){

//         res.status(500).send("Error while logging in user!! "+err);
//     }
// });
// app.get("/profile", async (req,res)=>{
//    try{ //console.log(req.cookies);
//     const cookies = req.cookies;
//     const {token}= cookies;
//     // console.log(token);
//     const data= jsonwebtoken.verify(token,"KEY");
//     console.log(data);
//     const userId= data._id;
//     const userr = await User.findById(userId);
//     console.log(userr);
//     res.send("rs"+userr);}
//     catch(err){
//         res.status(500);
//         res.send("Error while fetching profile!! "+err);
//     }
    
// });
// app.post("/signup", async (req,res) => {
//     //console.log(req.bod
//     // y);
    
    
//     try{
//         const {firstName, lastName, age, city, password,email,contactNo} = req.body;
//         validateUser(req);
//         const hashedPasswd = await bcrypt.hash(password,10);
//         const user = new User({firstName, lastName, age, city, email, password:hashedPasswd,contactNo

//         });
//         await user.save();
//         res.status(201).send("User signed up successfullyy");
//     }
//     catch(err){
//         res.status(500).send("Error while singing up user!! =>"+err);

//     }
// });
// app.use("/test",(req, res)=>{
//     res.send("Testing");
// });

// app.get("/users", async (req,res) => {
//     const userEmail = req.body.email;
//     console.log(userEmail);
//     try{
//         const users = await User.find({email: req.body.email});
//         if(users.length === 0 ){
//             res.status(404).send("No user found with this email");
//         }
//         else{
//             res.status(200).send(users);
//         }
//     }   
//     catch(err){
//         res.status(500).send("error while fetching users",err);
//     }
// });

// const startServer = ()=>{
//     app.listen(7777, () => {
//     console.log("Server is running succesfully on port 7777");
//     });
// };
// database().then(startServer).catch((err)=>{
//     console.log("error connecting to DB!!");
// });

// 
//comments added
//new tasks
// const {adminAuth, userAuth} = require("./middlewares/auth.js");
// app.use("/school",userAuth, (req,res,next)=>{
    
    //     console.log("first middleware for /school");
    //     next();
    //     //res.send("Middleware response for /school");
    // }
    // );
    
    // app.use("/school/testing", (req,res,next)=>{
    //     console.log("Second middleware for /school");
    //     next();
    //     //res.send("Middleware response for /school");
    // }
    // );
    // app.use("/school/testing/r1", (req,res)=>{
    //     console.log("Second ppo middleware for /school");
    //     res.send("Middleware response for /school");
    // }
    // );
    // app.use("/school/exam", (req,res)=>{
    //     console.log("Second 9 middleware for /school");
    //     res.send("Middleware response 9 for /school");
    // }
    // );
    // app.use("/abc", (req,res, next) =>{
    //     res.send("hiii");
    //     console.log("Middleware for /abc");
    //     // res.send("Middleware response for /abc " + req.query.name);
    //     next();
    // },(req,res)=>{
    //     console.log("Second middleware for /abc");
    //     res.send("Middleware response for /abc " + req.query.name);
    // });
    // app.use("/abcd/:name/:age", (req,res, next) =>{
    //     if(req.params.age>14)console.log("Middleware for /abc");
    //     next();
    // },(req,res)=>{
    //     console.log("Second middleware for 24/abc");
    //     res.send("Middleware response for /abc " + req.params.name+req.params.age);
    // });
    
    // app.get(/abhb*c/,(req,res) =>{
    //     res.send({name: "krishna", Dept: "IT"})
    // });
    // app.use("/hello",(req,res)=>{
    //     res.send("hello");
    // });
    
    // app.use("/test", (req,res)=>{
    //     res.send("test");
    // });
    // app.use("/",(req,res) =>{
    //     res.send("he llo world");
    // });;
    //console.log("ok");
