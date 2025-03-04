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

// Safe argument parsing with type checking
const parseArgs = (
  args: string[]
): { target: number; dailyExercises: number[] } => {
  if (args.length < 2) {
    throw new Error(
      'Please provide a target followed by daily exercise numbers.'
    );
  }

  const target = Number(args[0]);
  const dailyExercises = args.slice(1).map((arg) => Number(arg));

  if (isNaN(target) || dailyExercises.some(isNaN)) {
    throw new Error('All provided values must be numbers.');
  }

  return { target, dailyExercises };
};

// Main execution with error handling
const main = () => {
  try {
    const args = process.argv.slice(2);
    const { target, dailyExercises } = parseArgs(args);

    const result = calculateExercises(dailyExercises, target);
    console.log(result);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  }
};

// Only call main if this file is being run directly
if (require.main === module) {
  main();
}

export { calculateExercises };
