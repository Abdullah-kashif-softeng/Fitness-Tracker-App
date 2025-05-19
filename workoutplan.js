const workoutPlan = (height, weight, joinedAt) => {
    const now = new Date(); // Current date
    const joinedDate = new Date(joinedAt); // Convert joinedAt to a Date object
    const monthsDifference = (now.getFullYear() - joinedDate.getFullYear()) * 12 + (now.getMonth() - joinedDate.getMonth());

    if (monthsDifference >= 6) {
        return {
            message: "6+ months member: Advanced workout plan",
            plan: [
                "Day 1: Strength Training - Upper Body",
                "Day 2: HIIT Cardio",
                "Day 3: Rest",
                "Day 4: Strength Training - Lower Body",
                "Day 5: Core and Balance",
                "Day 6: Cardio Endurance",
                "Day 7: Rest or Yoga"
            ]
        };
    } else if (monthsDifference >= 3) {
        return {
            message: "3+ months member: Intermediate workout plan",
            plan: [
                "Day 1: Full Body Strength Training",
                "Day 2: Cardio - Moderate Intensity",
                "Day 3: Rest",
                "Day 4: Upper Body Strength Training",
                "Day 5: Lower Body Strength Training",
                "Day 6: Cardio or Yoga",
                "Day 7: Rest"
            ]
        };
    } else {
        return {
            message: "New member: Beginner workout plan",
            plan: [
                "Day 1: Light Cardio - 20 minutes",
                "Day 2: Full Body Circuit - Bodyweight Exercises",
                "Day 3: Rest",
                "Day 4: Light Cardio - 30 minutes",
                "Day 5: Strength Training - Basic Movements",
                "Day 6: Rest or Stretching",
                "Day 7: Rest"
            ]
        };
    }
};
module.exports=workoutPlan