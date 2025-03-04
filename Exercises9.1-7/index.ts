import express from 'express';

const app = express();

app.get('/ping', (_req, res) => {
  res.send('pong');
});

// Added hello endpoint
app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
