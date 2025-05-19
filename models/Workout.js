const mongoose=require("mongoose");

const workoutSchema=new mongoose.Schema({
    workoutID:{type:Number,require:true,unique:true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
    workoutType: {type: String, enum: ['Cardio', 'Strength', 'Flexibility', 'Balance', 'Other'], required: true },
    exercises: [{name: { type: String, required: true },sets: { type: Number, required: true },reps: { type: Number, required: true },weight: { type: Number }}],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    caloriesBurned: { type: Number },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})
const Workout=new mongoose.model("Workout",workoutSchema);
module.exports=Workout;