import React, { useState } from 'react';
import {
  Patient,
  EntryWithoutId,
  HealthCheckRating,
  Entry,
  EntryType
} from '../types'; //Import EntryType
import patientsService from '../services/patients';
import axios from 'axios';

interface Props {
  patient: Patient;
  onEntryAdded: (newEntry: Entry) => void;
  onError: (message: string) => void;
}

const NewEntryForm: React.FC<Props> = ({ patient, onEntryAdded, onError }) => {
  const [type, setType] = useState<EntryType>(EntryType.HealthCheck); //use the enum
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState('');

  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy
  );

  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState('');
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState('');

  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let newEntry: EntryWithoutId | null = null;

    try {
      switch (type) {
        case EntryType.HealthCheck:
          newEntry = {
            type: EntryType.HealthCheck, //use the enum
            description,
            date,
            specialist,
            diagnosisCodes: diagnosisCodes
              .split(',')
              .map((code) => code.trim()),
            healthCheckRating: parseInt(healthCheckRating.toString(), 10)
          };
          break;
        case EntryType.OccupationalHealthcare:
          newEntry = {
            type: EntryType.OccupationalHealthcare, //use the enum
            description,
            date,
            specialist,
            diagnosisCodes: diagnosisCodes
              .split(',')
              .map((code) => code.trim()),
            employerName,
            sickLeave: {
              startDate: sickLeaveStartDate,
              endDate: sickLeaveEndDate
            }
          };
          break;
        case EntryType.Hospital:
          newEntry = {
            type: EntryType.Hospital, //use the enum
            description,
            date,
            specialist,
            diagnosisCodes: diagnosisCodes
              .split(',')
              .map((code) => code.trim()),
            discharge: {
              date: dischargeDate,
              criteria: dischargeCriteria
            }
          };
          break;
        default:
          onError('Invalid entry type');
          return;
      }

      if (!newEntry) {
        onError('Failed to create entry');
        return;
      }

      const addedEntry = await patientsService.addEntry(patient.id, newEntry);
      onEntryAdded(addedEntry);

      // Reset form fields if successful (optional)
      setDescription('');
      setDate('');
      setSpecialist('');
      setDiagnosisCodes('');
      setHealthCheckRating(HealthCheckRating.Healthy);
      setEmployerName('');
      setSickLeaveStartDate('');
      setSickLeaveEndDate('');
      setDischargeDate('');
      setDischargeCriteria('');
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        onError(
          (error.response?.data as string) || 'An unexpected error occurred.'
        );
      } else {
        onError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div>
      <h3>New Entry</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Entry Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as EntryType)} //cast to the enum
          >
            <option value={EntryType.HealthCheck}>HealthCheck</option>
            <option value={EntryType.OccupationalHealthcare}>
              OccupationalHealthcare
            </option>
            <option value={EntryType.Hospital}>Hospital</option>
          </select>
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label>Specialist:</label>
          <input
            type="text"
            value={specialist}
            onChange={(e) => setSpecialist(e.target.value)}
          />
        </div>
        <div>
          <label>Diagnosis codes (comma-separated):</label>
          <input
            type="text"
            value={diagnosisCodes}
            onChange={(e) => setDiagnosisCodes(e.target.value)}
          />
        </div>

        {type === EntryType.HealthCheck && (
          <div>
            <label>Healthcheck rating:</label>
            <select
              value={healthCheckRating}
              onChange={(e) =>
                setHealthCheckRating(parseInt(e.target.value, 10))
              }
            >
              <option value={HealthCheckRating.Healthy}>Healthy</option>
              <option value={HealthCheckRating.LowRisk}>Low Risk</option>
              <option value={HealthCheckRating.HighRisk}>High Risk</option>
              <option value={HealthCheckRating.CriticalRisk}>
                Critical Risk
              </option>
            </select>
          </div>
        )}

        {type === EntryType.OccupationalHealthcare && (
          <>
            <div>
              <label>Employer Name:</label>
              <input
                type="text"
                value={employerName}
                onChange={(e) => setEmployerName(e.target.value)}
              />
            </div>
            <div>
              <label>Sick Leave Start Date:</label>
              <input
                type="text"
                value={sickLeaveStartDate}
                onChange={(e) => setSickLeaveStartDate(e.target.value)}
              />
            </div>
            <div>
              <label>Sick Leave End Date:</label>
              <input
                type="text"
                value={sickLeaveEndDate}
                onChange={(e) => setSickLeaveEndDate(e.target.value)}
              />
            </div>
          </>
        )}

        {type === EntryType.Hospital && (
          <>
            <div>
              <label>Discharge Date:</label>
              <input
                type="text"
                value={dischargeDate}
                onChange={(e) => setDischargeDate(e.target.value)}
              />
            </div>
            <div>
              <label>Discharge Criteria:</label>
              <input
                type="text"
                value={dischargeCriteria}
                onChange={(e) => setDischargeCriteria(e.target.value)}
              />
            </div>
          </>
        )}

        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default NewEntryForm;
