import React, { useState } from 'react';
import { Patient, EntryWithoutId, HealthCheckRating } from '../types';
import patientsService from '../services/patients';
import { apiBaseUrl } from '../constants';
import axios from 'axios';

interface Props {
  patient: Patient;
  onEntryAdded: (newEntry: EntryWithoutId) => void; // Callback to update patient data
  onError: (message: string) => void; //Callback to update the user in case of an error
}

const NewEntryForm: React.FC<Props> = ({ patient, onEntryAdded, onError }) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEntry: EntryWithoutId = {
      type: 'HealthCheck',
      description,
      date,
      specialist,
      diagnosisCodes: diagnosisCodes.split(',').map((code) => code.trim()), // Split comma-separated codes
      healthCheckRating: parseInt(healthCheckRating.toString(), 10) // Parse to number
    };

    try {
      const addedEntry = await patientsService.addEntry(patient.id, newEntry);
      onEntryAdded(addedEntry); // Notify parent component of the new entry
      // Reset form fields if successful (optional)
      setDescription('');
      setDate('');
      setSpecialist('');
      setDiagnosisCodes('');
      setHealthCheckRating(HealthCheckRating.Healthy);
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
      <h3>New HealthCheck entry</h3>
      <form onSubmit={handleSubmit}>
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
        <div>
          <label>Healthcheck rating:</label>
          <select
            value={healthCheckRating}
            onChange={(e) => setHealthCheckRating(parseInt(e.target.value, 10))}
          >
            <option value={HealthCheckRating.Healthy}>Healthy</option>
            <option value={HealthCheckRating.LowRisk}>Low Risk</option>
            <option value={HealthCheckRating.HighRisk}>High Risk</option>
            <option value={HealthCheckRating.CriticalRisk}>
              Critical Risk
            </option>
          </select>
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default NewEntryForm;
