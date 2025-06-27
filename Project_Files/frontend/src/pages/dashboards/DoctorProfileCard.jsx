import React from 'react';
import { motion } from 'framer-motion';

const DoctorProfileCard = ({ doctor, onBook }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 w-full md:w-96"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-2">Dr. {doctor.name}</h2>
      <p><strong>Specialization:</strong> {doctor.speciality}</p>
      <p><strong>Qualification:</strong> {doctor.qualification}</p>
      <p><strong>Hospital:</strong> {doctor.hospital}</p>
      <p><strong>Location:</strong> {doctor.location}</p>
      <p><strong>Gender:</strong> {doctor.gender}</p>
      <p><strong>Age:</strong> {doctor.age}</p>
      <p><strong>Address:</strong> {doctor.address}</p>
      <p><strong>Max Morning Appointments:</strong> {doctor.maxAppointments?.morning}</p>
      <p><strong>Max Evening Appointments:</strong> {doctor.maxAppointments?.evening}</p>
      <button
        onClick={onBook}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Book Appointment
      </button>
    </motion.div>
  );
};

export default DoctorProfileCard;
