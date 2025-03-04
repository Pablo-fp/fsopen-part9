interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (
  dailyExercises: number[],
  target: number
): ExerciseResult => {
  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.filter((hours) => hours > 0).length;
  const totalHours = dailyExercises.reduce((sum, hours) => sum + hours, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = "Excellent work! You've met your target.";
  } else if (average >= target * 0.8) {
    rating = 2;
    ratingDescription = 'Not too bad but could be better.';
  } else {
    rating = 1;
    ratingDescription = 'Target not reached. Try to exercise more.';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

// Hard-coded call for testing purpose
const dailyExercises = [3, 0, 2, 4.5, 0, 3, 1];
const target = 2;
console.log(calculateExercises(dailyExercises, target));
