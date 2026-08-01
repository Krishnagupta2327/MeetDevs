const socket = require("socket.io");
const Chat = require("../models/Chat");

const generateRoomId =({userId, targetUserId})=>{
    const roomId = [userId, targetUserId].sort().join('_');
    return roomId;
}
const initializeSocket=(server)=>{

    const io = socket(server,{
        cors: {
            origin: [
                "http://localhost:5173",
                "https://meetdevs.online"
            ],
            credentials: true
        }
        
    });
    io.on('connection',(socket)=>{
        //handle socket req
        socket.on("joinChat",({userId, targetUserId})=>{
            
            const roomId = generateRoomId({userId,targetUserId});
           
            
            socket.join(roomId);
         });

         socket.on("sendMessage", async ({userId, userName ,targetUserId, newMessage})=>{
            console.log(userName + " sent : " + newMessage);
            try{
            let chat  = await Chat.findOne({
                participants:{
                    $all:[userId,targetUserId]
                }
            });
            if(!chat) {
                chat = new Chat({
                    participants:[userId, targetUserId],
                    messages:[]
                });
            }
            chat.messages.push({
                senderId:userId,
                text:newMessage,
                senderName:userName
            });
            await chat.save();
        }catch(err){
            console.log(err);
        }
        const now = new Date();

const time = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
});
   

            const roomId= generateRoomId({userId,targetUserId});
            io.to(roomId).emit("messageReceived",{
                newMessage,
                userId,
                createdAt:now
            })
         });



    })

}

module.exports = initializeSocket;