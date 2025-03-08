// Define Gender type as a union of string literals
export type Gender = 'male' | 'female' | 'other';

// Interface for Patient data
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
}

// Interface for Diagnosis data
export interface Diagnosis {
  code: string;
  name: string;
  latin?: string; // Optional since some entries don't have a latin property
}

// Type assertion function to safely convert string gender to Gender type
export const assertGender = (gender: string): Gender => {
  if (gender === 'male' || gender === 'female' || gender === 'other') {
    return gender as Gender;
  }
  throw new Error(`Invalid gender: ${gender}`);
};

// Utility function to safely parse patient data
export const toPatient = (object: any): Patient => {
  return {
    id: object.id,
    name: object.name,
    dateOfBirth: object.dateOfBirth,
    ssn: object.ssn,
    gender: assertGender(object.gender),
    occupation: object.occupation
  };
};

// Export types that could be used for the full data arrays
export type PatientsData = Array<Patient>;
export type PatientData = Patient;
export type DiagnosesData = Array<Diagnosis>;
