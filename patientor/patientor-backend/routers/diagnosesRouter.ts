import { Diagnosis } from '../types';
import diagnosesData from '../data/diagnosesData';

// Cast the imported data to the DiagnosesData type
const diagnoses: Diagnosis[] = diagnosesData as Diagnosis[];

import express from 'express';

const router = express.Router();

// Get all diagnoses
const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

router.get('/', (_req, res) => {
  res.send(getDiagnoses());
});

// Get diagnosis by code
const getDiagnosisByCode = (code: string): Diagnosis | undefined => {
  return diagnoses.find((d) => d.code === code);
};

router.get('/:code', (req, res) => {
  const code = req.params.code;
  const diagnosis = getDiagnosisByCode(code);

  if (diagnosis) {
    res.json(diagnosis);
  } else {
    res.status(404).send('Diagnosis not found');
  }
});

export default router;
