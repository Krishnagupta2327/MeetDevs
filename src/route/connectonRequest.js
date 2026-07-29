const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user.js");
const {authCookie} = require('../middlewares/auth.js')
const express= require("express");
const connectionRouter = express.Router();

connectionRouter.post("/connectionRequest/send/:toUserId/:status",authCookie, async (req, res)=>{
    const fromUser = req.user;
    const toUserId = req.params.toUserId;
    const fromUserId= req.user._id;
    const status= req.params.status;
    const allowedStatus =["interested","ignore"];

    
    try{
    if(!allowedStatus.includes(status)){
        throw new Error("status is not allowed!!");
    }
    const toUser = await User.findById(toUserId);
    if(!toUser){
        return res.status(400).send(" User not found");

    }
    const isExisting= await connectionRequest.find({
        $or:[
           {
            fromUserId:fromUserId,
            toUserId: toUserId
            },
           {
            fromUserId: toUserId,
            toUserId:fromUserId     
           }
        ]});
    if(isExisting.length){
        console.log(isExisting)
        throw new Error("connectionRequest already exists!!");
    }
    if(fromUserId.equals(toUserId)){
        throw new Error("you can not send connectionrequest to yourself");
    }


    const connectionRequestt = new connectionRequest({
        fromUserId: fromUserId,
        toUserId:toUserId, 
        status:status
    });
    const data = await connectionRequestt.save();
    res.status(200).json({
        "message":`connection request is ${status}`,
        "data": data
    });}
    catch(err){
        res.status(500).send("Error while sending connection request"+err);
    }
});

connectionRouter.post("/connectionRequest/review/:userId/:status",authCookie, async(req,res)=>{
    const allowedStatus = ["accepted", "rejected"];
    const loggedInUser= req.user;
    const toReviewUser = req.params.userId;
    const status = req.params.status;
    try{
        if(!allowedStatus.includes(status)){
            return res.send(`${status } is not valid status`);
        }
        const user = await  User.findById(toReviewUser);
        if(!user){
            return res.send("Reviewing user does not exist");
        }
        if(loggedInUser._id.equals(toReviewUser)){
            return res.send("You can not review yourself");
        }
        const isExisting = await connectionRequest.find({
            $or:[
                {
                    toUserId:loggedInUser._id,
                    fromUserId :toReviewUser,
                    status: "ignored"
                    
                },
                {
                    fromUserId:loggedInUser._id,
                    toUserId :toReviewUser,
                    status: "ignored"
                },
                {
                    toUserId:loggedInUser._id,
                    fromUserId :toReviewUser,
                    status: "accepted"
                    
                },
                {
                    fromUserId:loggedInUser._id,
                    toUserId :toReviewUser,
                    status: "accepted"
                }
            ]
        }) ;
        if(isExisting.length){
            throw new Error("ConnectionRequest is already reviewed!!");
        }
        const toReviewRequest = await connectionRequest.findOne({
            $or:[
                {
                    toUserId:loggedInUser._id,
                    fromUserId: toReviewUser,
                    status:"interested"

                },
                
            ]
        });
        if(!toReviewRequest){
            throw new Error("You can not review unsend request!!");
        }
        toReviewRequest.status = status;
        const data = await toReviewRequest.save();
        res.json({
            "message": "connectionRequest reviewed succesfully",
            "data": data
        })


    }
    catch(err){
        res.status(500).send("Error while reviewing connectionRequest "+ err.message);
    }
});
module.exports = connectionRouter;