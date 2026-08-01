const express  = require('express');
const chatRouter = express.Router();
const {authCookie} = require("../middlewares/auth");
const Chat = require('../models/Chat');


chatRouter.get("/chat/:targetId",authCookie, async (req,res)=>{
    try{
        const {targetId} = req.params;
        let chat = await Chat.findOne({
                participants: {
                    $all:[req.user._id, targetId]
                }
        });
        console.log(chat);
        if(!chat){
             chat = new Chat({
                participants:[req.user._id,targetId],
                messages: []
            });
            await chat.save();
        }

        res.json({
            "message":"chat fetched succesfully",
            "chat": chat.messages
        });



    }catch(err){
        console.log(err);
        res.send(err);
    }
});


module.exports = chatRouter;