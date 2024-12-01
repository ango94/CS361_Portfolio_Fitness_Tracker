const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001; // Workout Service port
const dataPath = path.join(__dirname, '../data/workouts.json'); // Path to JSON data file

app.use(express.json());

// Helper function to read data from JSON file
const readData = () => {
  if (!fs.existsSync(dataPath)) return [];
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data || '[]');
};

// Helper function to write data to JSON file
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// POST route to add a new workout
app.post('/workouts', (req, res) => {
  const { activityName, activityDate, exerciseType, detail1, detail2, additionalNotes } = req.body;
  if (!activityName || !activityDate || !exerciseType || detail1 === undefined || detail2 === undefined) {
    return res.status(400).json({ error: 'All required workout fields are needed.' });
  }

  const workouts = readData();
  const newWorkout = {
    id: Date.now(),
    activityName,
    activityDate,
    exerciseType,
    detail1,
    detail2,
    additionalNotes: additionalNotes || '', // Optional field
    date: new Date().toISOString(),
  };
  workouts.push(newWorkout);
  writeData(workouts);

  res.status(201).json(newWorkout);
});

// GET route to list all workouts
app.get('/workouts', (req, res) => {
  const workouts = readData();
  res.json(workouts);
});

// PUT route to update an existing workout by ID
app.put('/workouts/:id', (req, res) => {
  const { id } = req.params;
  const { activityName, activityDate, exerciseType, detail1, detail2, additionalNotes } = req.body;

  const workouts = readData();
  const workoutIndex = workouts.findIndex(workout => workout.id === parseInt(id));
  if (workoutIndex === -1) {
    return res.status(404).json({ error: 'Workout not found' });
  }

  // Update the workout with new values, maintaining optional additionalNotes
  workouts[workoutIndex] = { 
    ...workouts[workoutIndex], 
    activityName, 
    activityDate, 
    exerciseType, 
    detail1, 
    detail2, 
    additionalNotes: additionalNotes || workouts[workoutIndex].additionalNotes 
  };
  writeData(workouts);

  res.json(workouts[workoutIndex]);
});

// GET route to specific workout
app.get('/workouts/:id', (req, res) => {
  const { id } = req.params;
  const workouts = readData();
  const workout = workouts.find(workout => workout.id === parseInt(id));

  if (!workout) {
    return res.status(404).json({ error: 'Workout not found' });
  }

  res.json(workout);
});

// DELETE route to remove a workout by ID
app.delete('/workouts/:id', (req, res) => {
  const { id } = req.params;

  const workouts = readData();
  const updatedWorkouts = workouts.filter(workout => workout.id !== parseInt(id));
  if (workouts.length === updatedWorkouts.length) {
    return res.status(404).json({ error: 'Workout not found' });
  }

  writeData(updatedWorkouts);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Workout Service is running on http://localhost:${PORT}`);
});
