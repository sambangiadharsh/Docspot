const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name must be at most 50 characters']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    match: [/\S+@\S+\.\S+/, 'Email format is invalid'],
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required']
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [120, 'Age seems too high'],
    required: [true, 'Age is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Phone number must be 10 digits']
  },
  role: {
    type: String,
    enum: ['admin', 'patient'],
    required: [true, 'Role is required']
  }
});

module.exports = mongoose.model('User', userSchema);

