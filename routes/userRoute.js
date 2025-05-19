const express=require("express");
const User=require("../models/User");
const router=express.Router();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const nutritionPlan=require("./nutritionPlan")
const auth=require("../auth")

router.post('/register', async (req, res) => {
    
    try {
        const { userID, role, name, email, password, ...rest } = req.body;
        if (!role=="User" || !role=="Trainer") {
            return res.status(400).json({ message: "Invalid role. Must be 'User' or 'Trainer'." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            userID,
            name,
            email,
            password: hashedPassword,
            role,
        };
        if (role === "User") {
            const {age,gender,heightCm,weightKg} = rest;
            if (!age||!gender||!heightCm||!weightKg) {
                return res.status(400).json({ message: "Missing required fields for User." });
            }
            newUser.age=age;
            newUser.gender=gender;
            newUser.heightCm =heightCm;
            newUser.weightKg=weightKg;
        } else if (role==="Trainer") {
            const { expertise, experienceYears, certifications } = rest;
            if (!expertise||!experienceYears) {
                return res.status(400).json({ message: "Missing required fields for Trainer." });
            }
            newUser.expertise = expertise;
            newUser.experienceYears = experienceYears;
            newUser.certifications = certifications || [];
        }
        const user = new User(newUser);
        await user.save();

        res.status(201).json({ message: "Registration successful", user });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }
        const payload = {
            userID: user.userID,
            role: user.role,
            name: user.name
        };
        const token = jwt.sign(payload, "%%^&^&*@@!!");
        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                userID: user.userID,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/userprofile/:userID",auth, async (req, res) => {
    try {
        const { userID } = req.params;
        const user = await User.findOne({ userID: userID });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
        }
        const updatedUser = await User.findOneAndUpdate({ userID: userID }, req.body, { new: true });
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});

router.get("/nutritionplan/:userID", auth, async (req, res) => { //UserID
    try {
        const { userID } = req.params;
        if (req.user.userID != userID) {
            return res.status(403).json({ msg: "Unauthorized access" });
        }
        const user = await User.findOne({ userID: userID }).populate("workouts");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        if (!user.heightCm || !user.weightKg || !user.workouts) {
            return res.status(400).json({ msg: "Please update with essential details" });
        }
        const NutPlan = nutritionPlan(user.heightCm, user.weightKg, user.workouts);

        res.status(200).json({
            suggestedPlan: "Here is the suggested nutrition plan as per your height and weight",
            user: user.name,
            height: user.heightCm,
            weight: user.weightKg,
            nutritionPlan: NutPlan
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});

router.put("/assign/:userID/",auth, async (req, res) => { //TrainerID
    try {
        
        
        const { assignedUsers } = req.body;
        console.log(assignedUsers);
        
        const userOne=await User.findById(assignedUsers);
        if(userOne.age<30)
        {
            console.log("ok");
        }
        const trainer = await User.findOneAndUpdate(
            {userID:req.params.userID,role:"Trainer"},
            {$addToSet:{assignedUsers:{$each:assignedUsers}}},
            {new:true}
        );
        return res.status(400).json({ msg: "User age not found" });
    


        if (!trainer) {
            return res.status(400).json({ msg: "Trainer not found" });
        
    }
        res.status(201).json({ msg: "User(s) assigned to trainer", assignedUsers: trainer.assignedUsers });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});
router.get("/userassigned/:userID",auth, async (req, res) => {
    try {
        const trainer = await User.findOne({ userID: req.params.userID, role: "Trainer" })
            .populate("assignedUsers");
        if (!trainer) {
            return res.status(404).json({ msg: "Trainer not found" });
        }
        res.status(200).json({
            msg: "Assigned users retrieved successfully",
            trainerID: trainer.userID,
            trainerName: trainer.name,
            assignedUsers: trainer.assignedUsers,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});
router.put("/addworkout/:userID", auth, async (req, res) => {
    try {
        const { workouts } = req.body; 
        const { userID } = req.params;
        if (!Array.isArray(workouts) || !workouts.every(w => typeof w === 'string')) {
            return res.status(400).json({ msg: "Invalid workouts data. It must be an array of strings." });
        }
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        if (req.user.role !== "User") {
            return res.status(403).json({ msg: "Only users can add workouts" });
        }
        user.workouts = workouts;
        await user.save();
        res.status(200).json({
            message: "Workouts added successfully",
            workouts: user.workouts,
        });
    } catch (err) {
        console.error("Error adding workouts:", err);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});

router.delete("/deleteworkout/:userID",auth,async(req,res)=>{
    try{
 const {userID}=req.params;
 const data=await User.findOne({userID:userID});
 if(data.workouts.length==0){
    res.status(400).json({msg:"Already empty"});
 }
 data.workouts=[];
 await data.save();
 res.status(200).json({deleted:"Workouts deleted"});

    }catch(err){
        console.log(err);
        res.status(500).json(err);


    }
})

router.delete("/deleteuser/:userID",auth,async(req,res)=>{
    try{
 const {userID}=req.params;
 const data=await User.findOneAndDelete({userID:userID});
 res.status(200).json({msg:"uSER deleted",data});
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})
module.exports=router;