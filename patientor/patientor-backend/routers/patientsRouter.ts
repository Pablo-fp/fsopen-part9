import express from 'express';
import { v1 as uuid } from 'uuid';
import { z } from 'zod';

import { Gender, Patient } from '../types';
import patientsData from '../data/patientsData';
const patients: Patient[] = patientsData as unknown as Patient[];

const router = express.Router();

// Zod schema for patient validation
const patientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  ssn: z.string().min(1, 'SSN is required'),
  gender: z.nativeEnum(Gender),
  occupation: z.string().min(1, 'Occupation is required')
});

// Function to get all patients
const getPatients = (): Patient[] => {
  return patients;
};

router.get('/', (_req, res) => {
  res.send(getPatients());
});

// Function to get a single patient by ID
const getPatientById = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

// Endpoint to get a single patient by ID
router.get('/:id', (req, res) => {
  const patient = getPatientById(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.status(404).send({ error: 'Patient not found' });
  }
});

// Function to add a new patient
const addPatient = (patientData: any): Patient => {
  const validatedPatient = patientSchema.parse(patientData);
  const newPatient = { ...validatedPatient, id: uuid(), entries: [] };
  patients.push(newPatient); // Add patient to the array
  return newPatient;
};

router.post('/', (req, res) => {
  try {
    const addedPatient = addPatient(req.body);
    res.status(201).json(addedPatient);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Invalid patient data'
      });
    }
  }
});

export default router;
