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
        return res.send("UserID is invalid...");

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
        throw new Error("you can not sen d connectionrequest to yourself");
    }


    const connectionRequestt = new connectionRequest({
        fromUserId: fromUserId,
        toUserId:toUserId, 
        status:status
    });
    const data = await connectionRequestt.save();
    res.json({
        "message":`connection request is ${status}`,
        "data": data
    });}
    catch(err){
        res.status(500).send("Error while sending connection request"+err);
    }
});
connectionRouter.post("/connectionRequest/review/:userId/:status",authCookie, async(req,res)=>{
    const allowedStatus = ["accepted", "rejected" ];
    const loggedInUser= req.user;
    const toReviewUser = req.params.userId;
    const status = req.params.status;
    try{
        if(!allowedStatus.includes(status)){
            res.send(`${status } is not valid status`);
        }
        const user = User.findById(toReviewUser._id);
        if(!user){
            res.send("Reviewing user does not exist");
        }
        if(loggedInUser._id.equals(toReviewUser._id)){
            res.send("You can not review yourself");
        }
        const isExisting = await connectionRequest.find({
            $or:[
                {
                    toUserId:loggedInUser._id,
                    fromUserId :toReviewUser._id,
                    status:"accepted"
                },
                {
                    fromUserId:loggedInUser._id,
                    toUserId :toReviewUser._id,
                    status:"rejected"
                },
                {
                    toUserId:loggedInUser._id,
                    fromUserId :toReviewUser._id,
                    status:"rejected"
                },
                {
                    fromUserId:loggedInUser._id,
                    toUserId :toReviewUser._id,
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
                    fromUserId: toReviewUser._id,
                    status:"interested"

                },
                {
                    toUserId: toReviewUser._id,
                    fromUserId:loggedInUser._id,
                    status:"interested"
                }
            ]
        });
        if(!toReviewRequest){
            throw new Error("You can not review unsend request!!");
        }
        else if(toReviewRequest.status != "interested"){
            throw new Error("you cant review not interested connectionRequest");
        }
        toReviewRequest.status = status;
        const data = await toReviewRequest.save();
        res.json({
            "message": "connectionRequest reviewed succesfully",
            "data": data
        })


    }
    catch(err){
        res.status(500).send("Error while reviewing connectionRequest "+ err);
    }
});
module.exports = connectionRouter;