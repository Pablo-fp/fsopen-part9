// components/EntryDetails.tsx
import React from 'react';
import {
  Entry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
  HealthCheckRating,
  EntryType
} from '../types';
import { Typography, Box, Icon } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssessmentIcon from '@mui/icons-material/Assessment';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface EntryDetailsProps {
  entry: Entry;
}

const EntryDetails: React.FC<EntryDetailsProps> = ({ entry }) => {
  switch (entry.type) {
    case EntryType.Hospital:
      const hospitalEntry = entry as HospitalEntry;
      return (
        <Box border={1} borderColor="grey.500" p={2} m={2}>
          <Typography variant="h6">
            <Icon>
              <LocalHospitalIcon />
            </Icon>{' '}
            Hospital Visit
          </Typography>
          <Typography>Date: {entry.date}</Typography>
          <Typography>Description: {entry.description}</Typography>
          <Typography>Specialist: {entry.specialist}</Typography>
          <Typography>
            Discharge Date: {hospitalEntry.discharge.date}
          </Typography>
          <Typography>
            Discharge Criteria: {hospitalEntry.discharge.criteria}
          </Typography>
        </Box>
      );
    case EntryType.OccupationalHealthcare:
      const occupationalEntry = entry as OccupationalHealthcareEntry;
      return (
        <Box border={1} borderColor="grey.500" p={2} m={2}>
          <Typography variant="h6">
            <Icon>
              <BusinessCenterIcon />
            </Icon>{' '}
            Occupational Healthcare
          </Typography>
          <Typography>Date: {entry.date}</Typography>
          <Typography>Description: {entry.description}</Typography>
          <Typography>Specialist: {entry.specialist}</Typography>
          <Typography>Employer: {occupationalEntry.employerName}</Typography>
          {occupationalEntry.sickLeave && (
            <>
              <Typography>
                Sick Leave Start: {occupationalEntry.sickLeave.startDate}
              </Typography>
              <Typography>
                Sick Leave End: {occupationalEntry.sickLeave.endDate}
              </Typography>
            </>
          )}
        </Box>
      );
    case EntryType.HealthCheck:
      const healthCheckEntry = entry as HealthCheckEntry;

      const ratingToString = (rating: HealthCheckRating): string => {
        switch (rating) {
          case HealthCheckRating.Healthy:
            return 'Healthy';
          case HealthCheckRating.LowRisk:
            return 'Low Risk';
          case HealthCheckRating.HighRisk:
            return 'High Risk';
          case HealthCheckRating.CriticalRisk:
            return 'Critical Risk';
          default:
            return 'Unknown';
        }
      };

      return (
        <Box border={1} borderColor="grey.500" p={2} m={2}>
          <Typography variant="h6">
            <Icon>
              <AssessmentIcon />
            </Icon>{' '}
            Health Check
          </Typography>
          <Typography>Date: {entry.date}</Typography>
          <Typography>Description: {entry.description}</Typography>
          <Typography>Specialist: {entry.specialist}</Typography>
          <Typography>
            Health Check Rating:{' '}
            {ratingToString(healthCheckEntry.healthCheckRating)}
          </Typography>
        </Box>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
