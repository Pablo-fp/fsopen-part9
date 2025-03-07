import { DiagnosesData } from '../types';
import diagnosesData from '../data/diagnosesData';
const diagnoses: DiagnosesData = diagnosesData;

import express from 'express';

const router = express.Router();

const getDiagnoses = (): DiagnosesData => {
  return diagnoses;
};

router.get('/', (_req, res) => {
  res.send(getDiagnoses());
});

export default router;
