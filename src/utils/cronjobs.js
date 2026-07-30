const cron = require('node-cron');
const sendEmail = require("./sendEmail");
const ConnectionRequest= require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");

cron.schedule('  0 8 * * *', async ()=>{
    try{
        const yesterday = subDays(new Date(),1);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const data = await ConnectionRequest.find({
            status:"interested",
            createdAt:{
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
            }
        });
    await sendEmail({
        to: ["harshkumarh399@gmail.com","krishna.kietian@gmail.com"],
        sub: "status about connectonRequest",
        body:`${data} reauests were created on MeetDevs.online yesterday`
    });
    console.log("mail sent")
    }catch(err){
        console.log(err);
    }
});
