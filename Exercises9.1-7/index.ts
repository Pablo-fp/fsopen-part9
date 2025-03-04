import express, { Request, Response } from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();

// Add JSON parsing middleware
app.use(express.json());

app.get('/ping', (_req, res) => {
  return res.send('pong');
});

// Added hello endpoint
app.get('/hello', (_req, res) => {
  return res.send('Hello Full Stack!');
});

// New bmi endpoint
app.get('/bmi', (req: Request, res: Response) => {
  console.log(req.query);
  const { height, weight } = req.query;

  if (!height || !weight) {
    return res.status(400).json({ error: 'height and weight are required' });
  }

  const h = Number(height);
  const w = Number(weight);

  if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const bmi = calculateBmi(h, w);

  return res.json({ weight: w, height: h, bmi });
});

// New exercises endpoint

app.post('/exercises', (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.log(req.body);
  const body: any = req.body;

  // Check if parameters are missing
  if (!body.daily_exercises || body.target === undefined) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  // Check if parameters are of correct type
  if (!Array.isArray(body.daily_exercises) || typeof body.target !== 'number') {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  // Check if all daily exercises are numbers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invalidExercises = body.daily_exercises.some(
    (exercise: any) => typeof exercise !== 'number'
  );
  if (invalidExercises) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  try {
    const result = calculateExercises(body.daily_exercises, body.target);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'internal server error' });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
