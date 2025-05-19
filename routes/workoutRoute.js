const express=require("express");
const User=require("../models/User");
const router=express.Router();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const Workout=require("../models/Workout");
const auth=require("../auth");
const workoutPlanfunction=require("../workoutplan")

router.post("/create/:userID",auth,async(req,res)=>{
    try {
        const { userID } = req.params;
        if (req.user.role !== "Trainer") {
            return res.status(403).json({ msg: "Access denied: Only trainers can assign workout plans" });
        }
        const trainer = await User.findOne({ userID: req.user.userID, role: "Trainer" });
        if (!trainer) {
            return res.status(404).json({ msg: "Trainer not found" });
        }
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        if (!trainer.assignedUsers.includes(user._id)) {
            return res.status(403).json({ msg: "This user is not assigned to you. You cannot assign a workout plan to them." });
        }
        const { heightCm, weightKg, joinedAt } = user;
        const workoutPlan = workoutPlanfunction(heightCm, weightKg, joinedAt);
        user.workoutPlans = workoutPlan;
        await user.save();
        res.status(200).json({
            message: "Workout plan assigned successfully",
            user,
        });
    } catch (err) {
        console.error("Error assigning workout plan:", err);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
})

router.put("/updateplan/:userID", auth, async (req, res) => {
    try {
        const { userID } = req.params;
        if (req.user.role !== "Trainer") {
            return res.status(403).json({ msg: "Access denied: Only trainers can update workout plans" });
        }
        const trainer = await User.findOne({ userID: req.user.userID, role: "Trainer" });
        if (!trainer) {
            return res.status(404).json({ msg: "Trainer not found" });
        }
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        if (!trainer.assignedUsers.includes(user._id)) {
            return res.status(403).json({ msg: "This user is not assigned to you. You cannot update their workout plan." });
        }
        const { heightCm, weightKg, joinedAt } = user;
        const workoutPlan = workoutPlanfunction(heightCm, weightKg, joinedAt);
        user.workoutPlans = workoutPlan;
        await user.save();
        res.status(200).json({
            message: "Workout plan updated successfully",
            user,
        });
    } catch (err) {
        console.error("Error updating workout plan:", err);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});

router.get("/getplan/:userID", auth, async (req, res) => {
    try {
        const { userID } = req.params;
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        if(user.workoutPlans.length===0){
        res.status(200).json({
            
            message: "There are no plans, currently",
            workoutPlans: user.workoutPlans,
        });
    } else{
        res.status(200).json({
            
            message: "Workout plan fetched successfully",
            workoutPlans: user.workoutPlans,
        })
    }
    } catch (err) {
        console.error("Error fetching workout plan:", err);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});

router.delete("/deleteplan/:userID", auth, async (req, res) => {
    try {
        const { userID } = req.params;
        if (req.user.role !== "Trainer") {
            return res.status(403).json({ msg: "Access denied: Only trainers can delete workout plans" });
        }
        const trainer = await User.findOne({ userID: req.user.userID, role: "Trainer" });
        if (!trainer) {
            return res.status(404).json({ msg: "Trainer not found" });
        }
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        if (!trainer.assignedUsers.includes(user._id)) {
            return res.status(403).json({ msg: "This user is not assigned to you. You cannot delete their workout plan." });
        }
        user.workoutPlans = [];
        await user.save();

        res.status(200).json({
            message: "Workout plan deleted successfully",
        });
    } catch (err) {
        console.error("Error deleting workout plan:", err);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});

module.exports=router;