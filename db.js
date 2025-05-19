const mongoose=require("mongoose");

const URL="mongodb://localhost:27017/FitnessTracker";
mongoose.connect(URL);

const db=mongoose.connection;

db.on('connected',()=>{console.log("Db Connected")});
db.on("Disconnected",()=>{console.log("Db Disconnected")});
db.on("error",(err)=>{console.log("Error connecting db",err)});

module.exports=db;