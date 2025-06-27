// 📁 server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const adminRoutes = require('./routes/admin');
const doctorRoutes = require('./routes/doctor');
const patientRoutes = require('./routes/patient');
const connectDB = require('./utils/db');

dotenv.config();
const app = express();
// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],  // or wherever your frontend runs
  credentials: true
}));


app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());


// // Routes

app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes);
app.get('/', (req, res) => {
  res.status(200).send('Server is working!');
});

// Connect DB & Start Server
connectDB().then(() => {
  app.listen(8000, () => console.log('Server running on port 8000'));
});