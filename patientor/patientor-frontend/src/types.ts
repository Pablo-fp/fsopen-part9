export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export enum EntryType {
  OccupationalHealthcare = 'OccupationalHealthcare',
  Hospital = 'Hospital'
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: EntryType.OccupationalHealthcare;
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

interface HospitalEntry extends BaseEntry {
  type: EntryType.Hospital;
  discharge: {
    date: string;
    criteria: string;
  };
}

export type Entry = OccupationalHealthcareEntry | HospitalEntry;

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[];
}

export type PatientFormValues = Omit<Patient, 'id' | 'entries'>;
