import { isNotNumber } from './utils';

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

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error(
    'Error: Please provide a target followed by daily exercise numbers.'
  );
  process.exit(1);
}

const target = Number(args[0]);
const dailyExercises = args.slice(1).map((arg) => Number(arg));

if (isNotNumber(target) || dailyExercises.some(isNotNumber)) {
  console.error('Error: All provided values must be numbers.');
  process.exit(1);
}

console.log(calculateExercises(dailyExercises, target));
