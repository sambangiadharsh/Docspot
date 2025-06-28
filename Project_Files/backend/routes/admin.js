const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth=require("../middleware/auth");

const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Register admin
const createTokenAndSetCookie = (user, res) => {
  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });
};

// Register 
router.post('/register', async (req, res) => {
  const { name, email, password, role,phone,gender,age } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already in use' });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, role ,gender,age,phone});
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
// Add doctor


router.post('/add-doctor', auth('admin'), async (req, res) => {
  const {
    name,
    age,
    gender,
    speciality,
    qualification,
    hospital,
    address,
    email,
    password,
    maxAppointments,
    location,
    image_url, 
  } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    const doctor = new Doctor({
      name,
      age,
      gender,
      speciality,
      qualification,
      hospital,
      address,
      email,
      password: hashed,
      maxAppointments,
      location,
      image_url, 
    });

    await doctor.save();
    res.json({ msg: 'Doctor added' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});


// admin can search 
router.get('/search-doctors', auth('admin'), async (req, res) => {
  const { speciality, location, name } = req.query;
  const query = {};
  if (speciality) query.speciality = { $regex: speciality, $options: 'i' };
  if (location) query.location = { $regex: location, $options: 'i' };
  if (name) query.name = { $regex: name, $options: 'i' };

  try {
    const doctors = await Doctor.find(query);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Error searching doctors' });
  }
});

// Update doctor details
router.put('/update-doctor/:id', auth('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor updated', doctor });
  } catch (err) {
    res.status(500).json({ message: 'Error updating doctor' });
  }
});

// Delete doctor
router.delete('/delete-doctor/:id', auth('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting doctor' });
  }
});
 

//get all doctors
router.get('/doctors', auth('admin'), async (req, res) => {
  try {
    const doctors = await Doctor.find(); // You can add `.select('-password')` if needed
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all appointments
// router.get('/appointments', async (req, res) => {
//   try {
//     const appointments = await Appointment.find().populate('patientId doctorId');
//     res.json(appointments);
//   } catch (err) {
//     res.status(500).send('Server error');
//   }
// });

module.exports = router;