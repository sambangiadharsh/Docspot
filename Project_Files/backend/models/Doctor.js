const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
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
  age: {
    type: Number,
    min: [25, 'Age must be at least 25'],
    max: [100, 'Age seems too high'],
    required: [true, 'Age is required']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required']
  },
  speciality: {
    type: String,
    required: [true, 'Speciality is required']
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required']
  },
  hospital: {
    type: String,
    required: [true, 'Hospital name is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  image_url: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    validate: {
      validator: function (url) {
        return url.startsWith('http');
      },
      message: 'Image URL must be a valid link'
    }
  },
  maxAppointments: {
    morning: {
      type: Number,
      default: 0,
      min: [0, 'Morning appointments must be ≥ 0']
    },
    evening: {
      type: Number,
      default: 0,
      min: [0, 'Evening appointments must be ≥ 0']
    }
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  role:{
    type:String,
    default:'doctor'
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);
