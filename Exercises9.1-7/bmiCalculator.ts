import { isNotNumber } from './utils';

function calculateBmi(height: number, weight: number): string {
  const heightInMeters = height / 100;
  const bmi = weight / heightInMeters ** 2;

  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Normal range';
  } else {
    return 'Overweight';
  }
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error(
    'Error: Please provide height in cm and weight in kg as arguments.'
  );
  process.exit(1);
}

const [heightArg, weightArg] = args;
const height = Number(heightArg);
const weight = Number(weightArg);

if (isNotNumber(height) || isNotNumber(weight)) {
  console.error('Error: Both height and weight must be numbers.');
  process.exit(1);
}

console.log(calculateBmi(height, weight));
