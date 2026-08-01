const  mongoose  = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required:true
    },
    text: {
        type: String,
        required:true,
    },
    senderName:{
        type:String ,
        required:true
    }

},{
    timestamps:true
})



const ChatSchema = new mongoose.Schema({
    participants: [
        {type :mongoose.Types.ObjectId,
        ref: "User",
        required:true}
    ],
    messages :[messageSchema]
},{
    timestamps:true
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;