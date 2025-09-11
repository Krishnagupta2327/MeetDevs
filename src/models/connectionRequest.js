const mongoose = require("mongoose");

const connectionRequestSchema =  new mongoose.Schema({
    fromUserId :{
        type:mongoose.Types.ObjectId,
        required:true
    },
    toUserId:{
        type :mongoose.Types.ObjectId,
        required :true
    },
    status:{
        type:String,
        enum:{
            values:["interested", "ignored", "accepted","rejected"],
            message: `status is not allowed!!`
        },
        reqired: true
    }
},{
    timestamps :true
});


const connectionRequest =  mongoose.model("connectionRequest",connectionRequestSchema);

module.exports= connectionRequest;