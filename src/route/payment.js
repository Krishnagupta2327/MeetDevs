const express = require('express');
const paymentRouter = express.Router();
const {authCookie}  = require('../middlewares/auth');
const rzpInstance = require('../config/razorpayInstance');
const Payment = require("../models/payment");

paymentRouter.post("/createPayment",  authCookie, async (req,res)=>{
    const plan = req?.body?.plan;
    const {_id , firstName, lastName, email}= req.user;

    const data = {
        "amount": plan === "Gold"? 799:499,
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
                    "userId":_id
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



module.exports = paymentRouter;
// module.exports = paymentRouter;
// module.exports = paymnetRouter;