import express from 'express';
const cors = require('cors');
import diagnosesRouter from './routers/diagnosesRouter';
import patientsRouter from './routers/patientsRouter';

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

// fetching all diagnoses
app.use('/api/diagnoses', diagnosesRouter);

//fetching all patients
app.use('/api/patients', patientsRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
