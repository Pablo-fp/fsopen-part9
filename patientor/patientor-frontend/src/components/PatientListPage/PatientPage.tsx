import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { Patient, EntryWithoutId, Diagnosis } from '../../types';
import patientService from '../../services/patients';
import diagnosesService from '../../services/diagnoses';
import EntryDetails from '../EntryDetails';
import NewEntryForm from '../NewEntryForm';

const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | undefined>(undefined);
  const [diagnosisMap, setDiagnosisMap] = useState<
    Record<string, Diagnosis | null>
  >({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const data = await patientService.getById(id);
        setPatient(data);

        // Immediately fetch all diagnoses when the patient data is available
        if (data?.entries) {
          const diagnosisCodes = new Set<string>();
          data.entries.forEach((entry) => {
            if (entry.diagnosisCodes) {
              entry.diagnosisCodes.forEach((code) => diagnosisCodes.add(code));
            }
          });

          // Fetch all diagnoses and create a map
          const newDiagnosisMap: Record<string, Diagnosis | null> = {};
          for (const code of Array.from(diagnosisCodes)) {
            try {
              const diagnosis = await diagnosesService.getByCode(code);
              newDiagnosisMap[code] = diagnosis;
            } catch (error) {
              console.error(`Error fetching diagnosis ${code}:`, error);
              newDiagnosisMap[code] = null; // Or handle the error as needed
            }
          }
          setDiagnosisMap(newDiagnosisMap);
        }
      }
    };
    fetchPatient();
  }, [id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  const handleEntryAdded = (newEntry: EntryWithoutId) => {
    // Update the patient's entries with the new entry
    setPatient({
      ...patient,
      entries: [...patient!.entries, newEntry]
    } as Patient); // Type assertion here is safe
  };

  const handleError = (message: string) => {
    setError(message);
    // Clear the error after a few seconds (optional)
    setTimeout(() => setError(null), 5000);
  };

  const genderIcon = () => {
    switch (patient.gender) {
      case 'male':
        return <MaleIcon />;
      case 'female':
        return <FemaleIcon />;
      case 'other':
        return <TransgenderIcon />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>
        {patient.name} {genderIcon()}
      </h1>
      <p>Date of Birth: {patient.dateOfBirth}</p>
      <p>SSN: {patient.ssn}</p>
      <p>Gender: {patient.gender}</p>
      <p>Occupation: {patient.occupation}</p>

      <NewEntryForm
        patient={patient}
        onEntryAdded={handleEntryAdded}
        onError={handleError}
      />

      <h2>Entries</h2>
      {patient.entries.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        <ul>
          {patient.entries.map((entry, index) => (
            <li key={index}>
              <EntryDetails entry={entry} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientPage;
