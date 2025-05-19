const nutritionPlan = (height, weight, workout) => {
    const bmi = weight / ((height / 100) ** 2);
    const baseCalories = bmi < 18.5 ? 2000 : bmi < 25 ? 2500 : 3000;
    let protein = 0.3;
    let carbs = 0.5;
    let fats = 0.2;
    workout.forEach(wrk => {
      if (wrk.type === 'Strength') {
        protein += 0.7;
      } else if (wrk.type === 'Cardio') {
        carbs += 0.3;
      } else if (wrk.type === 'Flexibility') {
        protein += 0.3;
        carbs += 0.75;
        fats += 0.01;
      }
    });
    const totalRatio = protein + carbs + fats;
    protein /= totalRatio;
    carbs /= totalRatio;
    fats /= totalRatio;
    const caloriesFromProtein = baseCalories * protein;
    const caloriesFromCarbs = baseCalories * carbs;
    const caloriesFromFats = baseCalories * fats;
  
    return {
      calories: baseCalories,
      protein: caloriesFromProtein / 4, 
      carbs: caloriesFromCarbs / 4,
      fats: caloriesFromFats / 9,
    };
  };
  
  module.exports = nutritionPlan;
  