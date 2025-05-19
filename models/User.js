const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({
    userID: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Trainer", "User"], required: true },
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    heightCm: { type: Number },
    weightKg: { type: Number },
    expertise: { type: [String] },
    experienceYears: { type: Number },
    certifications: { type: [String] },
    assignedUsers: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTrainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    workouts: { type: [String] },
    workoutPlans: {
        type: Array,
        default: [],
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }

})

const User=new mongoose.model("User",UserSchema);
module.exports=User;

