import express from 'express';
import { v1 as uuid } from 'uuid';

import { toPatient, Patient } from '../types';
import patientsData from '../data/patientsData';
const patients: Patient[] = patientsData as unknown as Patient[];

const router = express.Router();

// Function to get all patients
const getPatients = (): Patient[] => {
  return patients;
};

router.get('/', (_req, res) => {
  res.send(getPatients());
});

// Function to add a new patient
const addPatient = (patientData: any): Patient => {
  const newPatient = toPatient({ ...patientData, id: uuid() });
  patients.push(newPatient); // Add patient to the array
  return newPatient;
};

router.post('/', (req, res) => {
  try {
    const addedPatient = addPatient(req.body);
    res.status(201).json(addedPatient);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Invalid patient data'
    });
  }
});

export default router;
