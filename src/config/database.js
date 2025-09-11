const mongoose= require("mongoose");
const DB_URL = "mongodb+srv://krishnakietian:abcdkiet@meetdevsdb.goczcll.mongodb.net/?retryWrites=true&w=majority&appName=MeetDevsDB";
const db_URL="mongodb+srv://krishnakietian:Kiet%402327@meetdevsdb.goczcll.mongodb.net/?retryWrites=true&w=majority&appName=MeetDevsDB";
// "mongodb+srv:/krishnakietian:<db_password>@meetdevsdb.goczcll.mongodb.net/?retryWrites=true&w=majority&appName=MeetDevsDB";
const connectDB = async () => {
    await mongoose.connect(db_URL);
    console.log("conneted to db");
}

module.exports = connectDB;
