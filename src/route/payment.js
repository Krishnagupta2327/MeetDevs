const express = require('express');
const paymentRouter = express.Router();
const {authCookie}  = require('../middlewares/auth');
const rzpInstance = require('../config/razorpayInstance');
const Payment = require("../models/payment");
const User = require('../models/user');

const {validateWebhookSignature} =require("razorpay/dist/utils/razorpay-utils");

paymentRouter.post("/payment/create",  authCookie, async (req,res)=>{
    const plan = req?.body?.plan;
    const {_id , firstName, lastName, email}= req.user;

    const data = {
        "amount": plan === "Gold"? 79900:49900,
    }

    try{
        const order = await rzpInstance.orders.create({
            "amount":data.amount,
            "currency":"INR",
            "receipt":"receipt1",
            "notes":
                {
                    firstName,
                    lastName,
                    email,
                    "userId":_id,
                    plan
                }

            }
        );
        const payment  = new Payment({
            "amount":order.amount,
            "currency": order.currency,
            "receipt": order.receipt,
            "notes": order.notes,
            "userId": order.notes.userId,
            "status": order.status,
            "orderId": order.id

            
        });
        await payment.save();

    

        res.json({
            "message":"payment created successfully",
            "data": order
        });
    }catch(err){
        console.log(err);
        res.json({
            "message":"some error occured",
            "data": err.message
        });
    }


});

paymentRouter.post("/payment/feedback",async (req,res)=>{

    const webhookSignature = req.get("X-Razorpay-Signature");
    const webhookSecret= process.env.WEBHOOK_SECRET;
    const resp = validateWebhookSignature(
        JSON.stringify(req.body),
        webhookSignature,
        webhookSecret

    );


    if(!resp) {
        return res.status(400).send("webhook signature is not valid");
    }
    try{
        const paymentDetails = req.body.payload.payment.entity;
        console.log(paymentDetails);
    const payment = await Payment.findOne({
        "orderId":paymentDetails.order_id
    });
    payment.status= paymentDetails.status;
    await payment.save();

    if(payment.status==="captured"){
        const user = await User.findById(
             paymentDetails.notes.userId
        );
        user.membershipType = paymentDetails.notes.plan;
       await user.save();
    }
    

    return res.status(200).send("webhook captured successfully");
}catch(err){
    res.status(200).send("ok");
}
});

paymentRouter.get('/payment/verify',authCookie, (req,res)=>{
  try{  const {membershipType} = req.user;
    res.status(203).send(membershipType);
    }catch(err) {
        res.send(err);
    }
}

);
module.exports = paymentRouter;
// module.exports = paymentRouter;
// module.exports = paymnetRouter;