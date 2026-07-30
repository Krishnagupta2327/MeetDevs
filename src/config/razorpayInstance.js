const Razorpay = require('razorpay');

const rzpInstance = new Razorpay(
    {
        key_id: process.env.RZP_KEY_ID,
        key_secret: process.env.RZP_SECRET_KEY
    }
);



module.exports = rzpInstance;