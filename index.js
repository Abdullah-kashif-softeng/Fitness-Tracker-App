const express=require("express");
const app=express();
const db=require("./db");
const bodyParser=require("body-parser");
const userRoute=require("./routes/userRoute");
const workoutRoute=require("./routes/workoutRoute");

app.use(bodyParser.json());



app.use("/user",userRoute);
app.use("/workouts",workoutRoute);
app.listen(3000);

