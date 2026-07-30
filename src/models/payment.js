const mongoose= require('mongoose');


const paymentSchema = new mongoose.Schema({
    "amount":{
        type: Number,
        required :true
    },
    "currency":{
        type:String,
        required:true
    },
    "userId":{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    "orderId":{
        type:String,
        required:true
    },
    "status":{
        type:String,
        required:true
    },
    "receipt":{
        type: String,
        required: true
    },
    "notes":{
        firstName:{
            type:String
        },
        lastName:{
            type:String
        },
        email:{
            type:String
        }
    }

},{
    timestamps:true
});

const Payment = new mongoose.model("Payment", paymentSchema);
module.exports = Payment;