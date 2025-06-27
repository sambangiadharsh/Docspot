const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const auth=require("../middleware/auth");

// Doctor login
const createTokenAndSetCookie = (user, res) => {
  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });
};



// Login route with cookie set
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await Doctor.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  createTokenAndSetCookie(user, res); // Set cookie after login

  res.json({ message: 'Logged in successfully', user: { name: user.name, role: user.role } });
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Get appointments
// GET /api/doctor/appointments?date=YYYY-MM-DD
router.get('/appointments', auth('doctor'), async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { date } = req.query; // e.g., 2025-06-26
    
    // Build query
    const query = { doctorId };
    if (date) {
      // Validate format on backend as well (optional if schema already does)
      const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
      if (!isValidDate) {
        return res.status(400).json({ msg: 'Invalid date format (use YYYY-MM-DD)' });
      }
      query.date = date;
    }

    const appointments = await Appointment.find(query).populate('patientId');
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// Update appointment status
router.patch('/appointment-status/:id', auth('doctor'),async (req, res) => {
  const { status } = req.body;
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });
    appointment.status = status;
    await appointment.save();
    res.json({ msg: 'Status updated' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
