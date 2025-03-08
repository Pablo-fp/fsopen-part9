import express from 'express';
import { v1 as uuid } from 'uuid';

import { Gender } from './../../patientor-frontend/src/types';
import { PatientsData, PatientData } from '../types';
import patientsData from '../data/patientsData';
const patients: PatientsData = patientsData as unknown as PatientsData;

const router = express.Router();

// Function to get all patients
const getPatients = (): PatientsData => {
  return patients;
};

router.get('/', (_req, res) => {
  res.send(getPatients());
});

// Function to add a new patient
const addPatient = (
  name: string,
  dateOfBirth: string,
  ssn: string,
  gender: Gender,
  occupation: string
): PatientData => {
  const id = uuid(); // Generate a new id
  const newPatient = {
    id: String(id),
    name,
    dateOfBirth,
    ssn,
    gender,
    occupation
  };

  patients.push(newPatient); // Add patient to the array
  return newPatient;
};

router.post('/', (req, res) => {
  const { name, dateOfBirth, ssn, gender, occupation } = req.body;
  const addedPatient = addPatient(name, dateOfBirth, ssn, gender, occupation);
  res.json(addedPatient); // Send the added patient as a response
});

export default router;
