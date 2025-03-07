import { PatientsData } from '../types';
import patientsData from '../data/patientsData';
const patients: PatientsData = patientsData as unknown as PatientsData;

import express from 'express';

const router = express.Router();

const getPatients = (): PatientsData => {
  return patients;
};

router.get('/', (_req, res) => {
  res.send(getPatients());
});

export default router;
