import express, { Request, Response } from 'express';
import { calculateBmi } from './bmiCalculator';

const app = express();

// Add JSON parsing middleware
app.use(express.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

// Added hello endpoint
app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
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

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
