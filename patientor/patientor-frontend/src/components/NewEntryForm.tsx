import React, { useState, useEffect } from 'react';
import {
  Patient,
  EntryWithoutId,
  Entry,
  EntryType,
  Diagnosis,
  HealthCheckRating
} from '../types';
import patientsService from '../services/patients';
import diagnosesService from '../services/diagnoses';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Chip,
  Box,
  SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';

interface Props {
  patient: Patient;
  onEntryAdded: (newEntry: Entry) => void;
  onError: (message: string) => void;
}

const CustomTextField = (props: any) => <TextField {...props} fullWidth />;

const NewEntryForm: React.FC<Props> = ({ patient, onEntryAdded, onError }) => {
  const [type, setType] = useState<EntryType>(EntryType.HealthCheck);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [specialist, setSpecialist] = useState('');
  const [selectedDiagnosisCodes, setSelectedDiagnosisCodes] = useState<
    string[]
  >([]);
  const [allDiagnosisCodes, setAllDiagnosisCodes] = useState<Diagnosis[]>([]);

  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy
  );

  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState<Date | null>(
    null
  );
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState<Date | null>(null);

  const [dischargeDate, setDischargeDate] = useState<Date | null>(null);
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  const [dateError, setDateError] = useState('');
  const [sickLeaveStartDateError, setSickLeaveStartDateError] = useState('');
  const [sickLeaveEndDateError, setSickLeaveEndDateError] = useState('');
  const [dischargeDateError, setDischargeDateError] = useState('');

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const diagnoses = await diagnosesService.getAll();
        setAllDiagnosisCodes(diagnoses);
      } catch (error: any) {
        console.error('Error fetching diagnoses:', error);
      }
    };
    fetchDiagnoses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDateError('');
    setSickLeaveStartDateError('');
    setSickLeaveEndDateError('');
    setDischargeDateError('');

    let newEntry: EntryWithoutId | null = null;

    if (!date) {
      setDateError('Date is required');
      return;
    }

    try {
      switch (type) {
        case EntryType.HealthCheck:
          newEntry = {
            type: EntryType.HealthCheck,
            description,
            date: date.toISOString().slice(0, 10),
            specialist,
            diagnosisCodes: selectedDiagnosisCodes,
            healthCheckRating: healthCheckRating
          };
          break;
        case EntryType.OccupationalHealthcare:
          if (!sickLeaveStartDate) {
            setSickLeaveStartDateError('Sick leave start date is required');
            return;
          }
          if (!sickLeaveEndDate) {
            setSickLeaveEndDateError('Sick leave end date is required');
            return;
          }
          newEntry = {
            type: EntryType.OccupationalHealthcare,
            description,
            date: date.toISOString().slice(0, 10),
            specialist,
            diagnosisCodes: selectedDiagnosisCodes,
            employerName,
            sickLeave: {
              startDate: sickLeaveStartDate.toISOString().slice(0, 10),
              endDate: sickLeaveEndDate.toISOString().slice(0, 10)
            }
          };
          break;
        case EntryType.Hospital:
          if (!dischargeDate) {
            setDischargeDateError('Discharge date is required');
            return;
          }
          newEntry = {
            type: EntryType.Hospital,
            description,
            date: date.toISOString().slice(0, 10),
            specialist,
            diagnosisCodes: selectedDiagnosisCodes,
            discharge: {
              date: dischargeDate.toISOString().slice(0, 10),
              criteria: dischargeCriteria
            }
          };
          break;
        default:
          onError('Invalid entry type');
          return;
      }

      const addedEntry = await patientsService.addEntry(patient.id, newEntry);
      onEntryAdded(addedEntry);

      setDescription('');
      setDate(null);
      setSpecialist('');
      setSelectedDiagnosisCodes([]);
      setHealthCheckRating(HealthCheckRating.Healthy);
      setEmployerName('');
      setSickLeaveStartDate(null);
      setSickLeaveEndDate(null);
      setDischargeDate(null);
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

  const handleDiagnosisCodeChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedDiagnosisCodes(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: '100%', mt: 2 }}>
        <h3>New Entry</h3>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="entry-type-label">Entry Type</InputLabel>
                <Select
                  labelId="entry-type-label"
                  id="entry-type"
                  value={type}
                  label="Entry Type"
                  onChange={(e) => setType(e.target.value as EntryType)}
                >
                  <MenuItem value={EntryType.HealthCheck}>HealthCheck</MenuItem>
                  <MenuItem value={EntryType.OccupationalHealthcare}>
                    OccupationalHealthcare
                  </MenuItem>
                  <MenuItem value={EntryType.Hospital}>Hospital</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <DatePicker
                label="Date"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                slots={{
                  textField: (props) => (
                    <CustomTextField
                      {...props}
                      error={!!dateError}
                      helperText={dateError}
                    />
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Specialist"
                value={specialist}
                onChange={(e) => setSpecialist(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="diagnosis-codes-label">
                  Diagnosis Codes
                </InputLabel>
                <Select
                  labelId="diagnosis-codes-label"
                  id="diagnosis-codes"
                  multiple
                  value={selectedDiagnosisCodes}
                  onChange={handleDiagnosisCodeChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {allDiagnosisCodes.map((diagnosis) => (
                    <MenuItem key={diagnosis.code} value={diagnosis.code}>
                      {diagnosis.name} ({diagnosis.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {type === EntryType.HealthCheck && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="health-check-rating-label">
                    Health Check Rating
                  </InputLabel>
                  <Select
                    labelId="health-check-rating-label"
                    id="health-check-rating"
                    value={healthCheckRating.toString()}
                    label="Health Check Rating"
                    onChange={(e) =>
                      setHealthCheckRating(
                        Number(e.target.value) as HealthCheckRating
                      )
                    }
                  >
                    <MenuItem value={HealthCheckRating.Healthy.toString()}>
                      Healthy
                    </MenuItem>
                    <MenuItem value={HealthCheckRating.LowRisk.toString()}>
                      Low Risk
                    </MenuItem>
                    <MenuItem value={HealthCheckRating.HighRisk.toString()}>
                      High Risk
                    </MenuItem>
                    <MenuItem value={HealthCheckRating.CriticalRisk.toString()}>
                      Critical Risk
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {type === EntryType.OccupationalHealthcare && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Employer Name"
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DatePicker
                    label="Sick Leave Start Date"
                    value={sickLeaveStartDate}
                    onChange={(newValue) => setSickLeaveStartDate(newValue)}
                    slots={{
                      textField: (props) => (
                        <CustomTextField
                          {...props}
                          error={!!sickLeaveStartDateError}
                          helperText={sickLeaveStartDateError}
                        />
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DatePicker
                    label="Sick Leave End Date"
                    value={sickLeaveEndDate}
                    onChange={(newValue) => setSickLeaveEndDate(newValue)}
                    slots={{
                      textField: (props) => (
                        <CustomTextField
                          {...props}
                          error={!!sickLeaveEndDateError}
                          helperText={sickLeaveEndDateError}
                        />
                      )
                    }}
                  />
                </Grid>
              </>
            )}

            {type === EntryType.Hospital && (
              <>
                <Grid item xs={12}>
                  <DatePicker
                    label="Discharge Date"
                    value={dischargeDate}
                    onChange={(newValue) => setDischargeDate(newValue)}
                    slots={{
                      textField: (props) => (
                        <CustomTextField
                          {...props}
                          error={!!dischargeDateError}
                          helperText={dischargeDateError}
                        />
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Discharge Criteria"
                    value={dischargeCriteria}
                    onChange={(e) => setDischargeCriteria(e.target.value)}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </LocalizationProvider>
  );
};

export default NewEntryForm;
