// gateway.js
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 5000; // API Gateway port
const WORKOUT_SERVICE_URL = 'http://localhost:5001'; // Updated to point to port 5001

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build'))); // Serve React front end

// Route to handle POST requests to /workouts
app.post('/workouts', async (req, res) => {
  try {
    const response = await axios.post(`${WORKOUT_SERVICE_URL}/workouts`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { error: 'Internal server error' });
  }
});

// Route to handle GET requests to /workouts (list all workouts)
app.get('/workouts', async (req, res) => {
  try {
    const response = await axios.get(`${WORKOUT_SERVICE_URL}/workouts`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { error: 'Internal server error' });
  }
});

// Route to handle PUT requests to /workouts/:id (update a workout)
app.put('/workouts/:id', async (req, res) => {
  try {
    const response = await axios.put(`${WORKOUT_SERVICE_URL}/workouts/${req.params.id}`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { error: 'Internal server error' });
  }
});

// Route to handle DELETE requests to /workouts/:id (delete a workout)
app.delete('/workouts/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${WORKOUT_SERVICE_URL}/workouts/${req.params.id}`);
    res.status(response.status).send();
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { error: 'Internal server error' });
  }
});

// Serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});