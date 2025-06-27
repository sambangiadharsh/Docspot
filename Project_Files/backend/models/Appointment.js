const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required']
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor ID is required']
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
    validate: {
      validator: function (v) {
        // Accepts YYYY-MM-DD format
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: props => `${props.value} is not a valid date format (YYYY-MM-DD)`
    }
  },
  slot: {
    type: String,
    enum: {
      values: ['morning', 'evening'],
      message: '{VALUE} is not a valid slot'
    },
    required: [true, 'Slot is required']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'scheduled', 'completed', 'cancelled'],
      message: '{VALUE} is not a valid appointment status'
    },
    default: 'pending'
  },
  tokenNumber: {
    type: Number,
    required: [true, 'Token number is required']
  },
  documents: {
    type: [String],
    validate: {
      validator: function (arr) {
        return arr.every(url => typeof url === 'string' && url.startsWith('http'));
      },
      message: 'Each document must be a valid URL string'
    },
    default: []
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
