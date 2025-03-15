import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { Patient } from '../../types';
import patientService from '../../services/patients';

const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const data = await patientService.getById(id);
        setPatient(data);
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
      <h1>{patient.name} {genderIcon()}</h1>
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
            <li key={index}>{/* Render entry details here */}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientPage;
