import express from 'express';
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
