const express = require('express');
const userRouter = express.Router();
const {authCookie} = require('../middlewares/auth.js');
const connectionRequest = require('../models/connectionRequest.js');

userRouter.get("/user/requests/recieved", authCookie,async (req, res)=>{
    try{const allRequests = await connectionRequest.find({
        toUserId: req.user._id,
        status:"interested"
    });
    if(!allRequests.length){
        return res.send("No pending request!!");
    }
    res.json({
        "message":"requests fetched successfully",
        "data":allRequests
    });
}
    catch(err){
        res.send("Error while fetching request!!"+err);
    }
});
userRouter.get("/user/connections", authCookie, async (req,res)=>{
    try{
        const connections = await connectionRequest.find({
            $or:[
                {
                    toUserId: req.user._id,
                    status: "accepted"
                },
                {
                    fromUserId: req.user._id,
                    status:"accepted"
                }
            ]
            
    });
        if(!connections.length){
            return res.send("No coonection exists for "+req.user.firstName);
        }
        res.json({
            "message":"connections fetched succesfullyy ",
            "data": connections
        })




    }
    catch(err){
        res.status(400).send("error while fetching connections "+err);
    }
});
userRouter.get("/user/feed", authCookie , async (req,res)=>{

});

module.exports = userRouter;