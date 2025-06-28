const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth=require("../middleware/auth");
const Appointment=require("../models/Appointment");
const sendEmail=require("../utils/mailer");


// Register a new user
const createTokenAndSetCookie = (user, res) => {
  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });
};

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password, role,age,phone,gender } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already in use' });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, role ,age,gender,phone});
  await user.save();

  createTokenAndSetCookie(user, res); // Set cookie after registration

  res.status(201).json({ message: 'User registered successfully', user: { name: user.name, role: user.role } });
});

// Login route with cookie set
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
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

//search based on location and speaciality

router.get('/search-doctors', auth('patient'), async (req, res) => {
  const { speciality, location } = req.query;

  try {
    const query = {};
    if (speciality) query.speciality = { $regex: speciality, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };

    const doctors = await Doctor.find(query);
    res.json(doctors);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).send('Server error');
  }
});


router.get('/doctors', async (req, res) => {
  try {
    
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Book appointment
router.post('/book', auth('patient'),async (req, res) => {
  const { doctorId, date, slot, documents } = req.body;
  console.log('Cookies:', req.cookies);
console.log('Decoded user:', req.user);

  const patientId = req.user._id;
  console.log(req.user);

  try {
    const doctor = await Doctor.findById(doctorId);
    const patient=await User.findById(patientId);
    if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });
    const count = await Appointment.countDocuments({ doctorId, date, slot });
    const limit = doctor.maxAppointments[slot];
    if (count >= limit) return res.status(400).json({ msg: 'Slot full' });
    const appointment = new Appointment({ patientId, doctorId, date, slot, tokenNumber: count + 1, documents });


    await appointment.save();
    //Email-Template
    const emailHTML = `
      <h2>Appointment Confirmed</h2>
      <p>Dear ${patient.name},</p>
      <p>Your appointment with <strong>Dr. ${doctor.name}</strong> has been successfully booked.</p>
      <ul>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Slot:</strong> ${slot}</li>
        <li><strong>Doctor:</strong> ${doctor.speciality}, ${doctor.hospital}</li>
      </ul>
      <p>Thank you for using DocSpot!</p>
    `;

    await sendEmail(patient.email, 'Your Appointment is Confirmed', emailHTML);
    res.json({ msg: 'Appointment booked', tokenNumber: count + 1 });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/profile', auth('patient'), async (req, res) => {
  try {
    const patient = await User.findById(req.user._id);
    if (!patient) return res.status(404).json({ msg: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update patient profile
router.put('/update-profile', auth('patient'), async (req, res) => {
  try {
    const patient = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
    res.json({ message: 'Profile updated', patient });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all appointments for patient
router.get('/appointments', auth('patient'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id }).populate('doctorId');
    res.json(appointments);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Cancel appointment
router.put('/cancel/:id', auth('patient'), async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, patientId: req.user._id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found or not authorized' });
    res.json({ message: 'Appointment cancelled', appointment });
  } catch (err) {
    res.status(500).send('Server error');
  }
});


module.exports = router;
