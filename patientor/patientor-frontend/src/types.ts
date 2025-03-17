export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export enum EntryType {
  HealthCheck = 'HealthCheck',
  OccupationalHealthcare = 'OccupationalHealthcare',
  Hospital = 'Hospital'
}

export interface BaseEntry {
  id: string;
  date: string;
  type: string;
  description: string;
  specialist: string;
  diagnosisCodes?: Array<string>;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: EntryType.OccupationalHealthcare; //Use the enum
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

export interface HospitalEntry extends BaseEntry {
  type: EntryType.Hospital; //Use the enum
  discharge: {
    date: string;
    criteria: string;
  };
}

export interface HealthCheckEntry extends BaseEntry {
  type: EntryType.HealthCheck; //Use the enum
  healthCheckRating: HealthCheckRating;
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

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

// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;
// Define Entry without the 'id' property
export type EntryWithoutId = UnionOmit<Entry, 'id'>;

// Define NewEntry type that is similar to EntryWithoutId, but allows for the 'id' field to be added later.
export type NewEntry = Omit<Entry, 'id'>;
