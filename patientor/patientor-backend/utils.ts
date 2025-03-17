import { EntryWithoutId, Diagnosis } from './types'; // Adjust path

const parseDiagnosisCodes = (object: any): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseDescription = (comment: unknown): string => {
  if (!comment || !isString(comment)) {
    throw new Error('Incorrect or missing comment');
  }

  return comment;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || isNaN(Date.parse(date))) {
    throw new Error('Incorrect or missing date: ' + date);
  }

  return date;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrect or missing specialist');
  }

  return specialist;
};

const parseHealthCheckRating = (healthCheckRating: unknown): number => {
  if (
    healthCheckRating === null ||
    healthCheckRating === undefined ||
    isNaN(Number(healthCheckRating))
  ) {
    throw new Error('Incorrect or missing healthCheckRating');
  }

  const rating = Number(healthCheckRating);

  if (rating < 0 || rating > 3) {
    throw new Error('healthCheckRating must be between 0 and 3');
  }

  return rating;
};

// Helper function to check for undefined or null values
const isValuePresent = (value: any): boolean => {
  return value !== undefined && value !== null;
};

export const toNewEntry = (object: any): EntryWithoutId => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (!('type' in object)) {
    throw new Error('Missing entry type');
  }

  const type = object.type;

  switch (type) {
    case 'HealthCheck':
      return {
        type: 'HealthCheck',
        description: parseDescription(object.description),
        date: parseDate(object.date),
        specialist: parseSpecialist(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object),
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
      };
    case 'OccupationalHealthcare':
      const occupationalHealthcareEntry: EntryWithoutId = {
        type: 'OccupationalHealthcare',
        description: parseDescription(object.description),
        date: parseDate(object.date),
        specialist: parseSpecialist(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object),
        employerName: parseDescription(object.employerName) // added check for employerName property
      };

      if (
        isValuePresent(object.sickLeaveStartDate) ||
        isValuePresent(object.sickLeaveEndDate)
      ) {
        occupationalHealthcareEntry.sickLeaveStartDate = parseDate(
          object.sickLeaveStartDate
        );
        occupationalHealthcareEntry.sickLeaveEndDate = parseDate(
          object.sickLeaveEndDate
        );
      }
      return occupationalHealthcareEntry;
    case 'Hospital':
      return {
        type: 'Hospital',
        description: parseDescription(object.description),
        date: parseDate(object.date),
        specialist: parseSpecialist(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object),
        discharge: {
          date: parseDate(object.discharge.date),
          criteria: parseDescription(object.discharge.criteria)
        }
      };
    default:
      throw new Error(`Incorrect entry type: ${type}`);
  }
};
