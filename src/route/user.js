const express = require('express');
const userRouter = express.Router();
const {authCookie} = require('../middlewares/auth.js');
const connectionRequest = require('../models/connectionRequest.js');
const User = require('../models/user.js');


userRouter.get("/user/requests/recieved", authCookie,async (req, res)=>{
    try{const allRequests = await connectionRequest.find({
        toUserId: req.user._id,
        status:"interested"
    });
    if(!allRequests.length){
        return res.send("No pending request!!");
    }
    // const connectionUsers = new Array();
    // allRequests.map(async (req)=>{
    //     await User.findById(req.fromUserId).select(["firstName","lastName","age","city","imgUrl","about","email","contactNo"]).then((user)=>{
    //         connectionUsers.push(user);
    //     });
    // });
    const connectionUsers = await Promise.all(
        allRequests.map(async (request) => {
          return await User.findById(request.fromUserId).select(
            "firstName lastName age city imgUrl about email contactNo membershipType"
          );
        })
      );
    res.json({
        "message":"requests fetched successfully",
        "data":connectionUsers
    });
}
    catch(err){
        res.send("Error while fetching request!!"+err);
    }
});

// userRouter.get("/user/requests/received", authCookie, async (req, res) => {
//     try {
//         const allRequests = await connectionRequest.find({
//             toUserId: req.user._id,
//             status: "interested",
//         });

//         if (!allRequests.length) {
//             return res.json({
//                 message: "No pending requests",
//                 data: [],
//             });
//         }

//         const connectionUsers = await Promise.all(
//             allRequests.map((request) =>
//                 User.findById(request.fromUserId).select(
//                     "firstName lastName age city imgUrl about gender email contactNo"
//                 )
//             )
//         );

//         res.json({
//             message: "Requests fetched successfully",
//             data: connectionUsers,
//         });
//     } catch (err) {
//         res.status(500).send(
//             "Error while fetching requests: " + err.message
//         );
//     }
// });
userRouter.get("/user/connections", authCookie, async (req, res) => {
    try {
        const connections = await connectionRequest.find({
            $or: [
                {
                    toUserId: req.user._id,
                    status: "accepted",
                },
                {
                    fromUserId: req.user._id,
                    status: "accepted",
                },
            ],
        });

        if (!connections.length) {
            return res.send("No coonection exists for " + req.user.firstName);
        }

        const connectionUsers = await Promise.all(
            connections.map(async (request) => {
                const connectionUserId = request.fromUserId.equals(req.user._id)
                    ? request.toUserId
                    : request.fromUserId;

                return await User.findById(connectionUserId).select(
                    "firstName lastName age city imgUrl about email contactNo"
                );
            })
        );

        res.json({
            message: "connections fetched succesfullyy ",
            data: connectionUsers,
        });
    } catch (err) {
        res.status(400).send("error while fetching connections " + err);
    }
});
// userRouter.get("/user/feed", authCookie , async (req,res)=>{
//     try{
//         const user = req.user;
//         const user_id= user._id;
//         const notAllowed = await connectionRequest.find({
//             $or:[
//                 {
//                     toUserId:user_id,
//                 },
//                 {
//                     fromUserId:user_id,
//                 }
//             ]
//     }).select("fromUserId toUserId");
//     const toHide= new Set();
//     notAllowed.forEach((req)=>{
//         toHide.add(req.toUserId);
//         toHide.add(req.fromUserId);
//     });

//     const users= await User.find({
//            $and:[
//             {_id: {$nin: Array.from(toHide)}},
//             { _id:{ $ne: user_id} } ,
//            ]
        
//     }).select(["firstName","lastName","age","city","imgUrl","about","email","contactNo","password"]);;
//     res.status(200).json({
//         "meesage":'feeed has arrived!',
//         data:users

//     });


//     }catch(err){
//         res.status(500).send(err.message);

//     }

// });

userRouter.get("/user/feed", authCookie, async (req, res) => {
    try {
        const user = req.user;
        const user_id = user._id;

        const notAllowed = await connectionRequest.find({
            
            $or: [
                {
                    toUserId: user_id,
                },
                {
                    fromUserId: user_id,
                },
            ],
        }).select("fromUserId toUserId");

        const toHide = new Set();

        notAllowed.forEach((request) => {
            toHide.add(request.fromUserId.toString());
            toHide.add(request.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(toHide) } },
                { _id: { $ne: user_id } },
            ],
        }).select(
            "firstName lastName age city imgUrl about email contactNo"
        );

        res.status(200).json({
            message: "feed has arrived!",
            data: users,
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = userRouter;