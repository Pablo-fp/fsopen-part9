// Define Gender enum
enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export { Gender };

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
export const assertGender = (gender: any): Gender => {
  if (Object.values(Gender).includes(gender)) {
    return gender as Gender;
  }
  throw new Error(`Invalid gender: ${gender}`);
};

// Utility function to safely parse patient data
export const toPatient = (object: any): Patient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Invalid input: not an object');
  }

  if (
    !('id' in object) ||
    !('name' in object) ||
    !('dateOfBirth' in object) ||
    !('ssn' in object) ||
    !('gender' in object) ||
    !('occupation' in object)
  ) {
    throw new Error('Missing required fields');
  }

  return {
    id: String(object.id),
    name: String(object.name),
    dateOfBirth: String(object.dateOfBirth),
    ssn: String(object.ssn),
    gender: assertGender(object.gender),
    occupation: String(object.occupation)
  };
};

// Export types that could be used for the full data arrays
export type PatientsData = Array<Patient>;
export type PatientData = Patient;
export type DiagnosesData = Array<Diagnosis>;
