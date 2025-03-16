import { DiagnosesData, Diagnosis } from '../types';
import diagnosesData from '../data/diagnosesData';

const diagnoses: DiagnosesData = diagnosesData;

import express from 'express';

const router = express.Router();

// Get all diagnoses
const getDiagnoses = (): DiagnosesData => {
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
