import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { Patient, Diagnosis } from '../../types';
import patientService from '../../services/patients';
import diagnosesService from '../../services/diagnoses';

const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnosisMap, setDiagnosisMap] = useState<
    Record<string, Diagnosis | null>
  >({});

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
      <h2>Entries</h2>
      {patient.entries.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        <ul>
          {patient.entries.map((entry, index) => (
            <li key={index}>
              <p>Date: {entry.date}</p>
              <p>Description: {entry.description}</p>
              {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
                <>
                  <p>Diagnosis Codes:</p>
                  <ul>
                    {entry.diagnosisCodes.map((code, codeIndex) => {
                      const diagnosis = diagnosisMap[code];
                      return (
                        <li key={codeIndex}>
                          {code}{' '}
                          {diagnosis
                            ? diagnosis.name
                            : '(Diagnosis Name Not Found)'}
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientPage;
