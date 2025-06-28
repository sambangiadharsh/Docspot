import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/doctor/appointments?date=${date}`, {
        withCredentials: true,
      });
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(
        `${BASE_URL}/api/doctor/appointment-status/${id}`,
        { status },
        { withCredentials: true }
      );
      fetchAppointments();
    } catch (err) {
      console.error('Status update failed', err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/doctor/logout`, {}, { withCredentials: true });
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  useEffect(() => {
    if (date) fetchAppointments();
  }, [date]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-gray-900 text-white px-4 py-6 relative">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold">🩺 Doctor Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded shadow transition"
          >
            Logout
          </button>
        </div>

        {/* Hero Section (only shown before date selection) */}
        {!date && (
          <div
            className="relative rounded-xl overflow-hidden mb-10 h-[60vh] bg-center bg-cover flex items-center justify-center"
            style={{
              backgroundImage: "url('/assets/doctor.jpg')",
            }}
          >
            <div className="absolute inset-0 bg-black/60 z-0" />
            <motion.div
              className="relative z-10 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-bold mb-4">👨‍⚕️ Welcome, Doctor!</h2>
              <p className="text-lg text-gray-300">Start by selecting a date to view your appointments.</p>
              <motion.div
                className="mt-6 text-white text-3xl animate-bounce"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                ↓
              </motion.div>
            </motion.div>
          </div>
        )}

        {/* Date Picker */}
        <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-md p-4 rounded-lg shadow mb-6">
          <label className="block mb-2 text-sm font-semibold text-white">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full max-w-xs px-4 py-2 rounded bg-white/20 text-white border border-white/30 focus:outline-none placeholder-gray-300"
          />
        </div>

        {/* Appointments */}
        {appointments.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appt, i) => (
  <motion.div
    key={appt._id}
    className="bg-white/5 border border-white/20 rounded-2xl p-6 shadow-lg backdrop-blur-md hover:scale-[1.02] transition-all duration-300"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: i * 0.1 }}
  >
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">{appt.patientId?.name}</h2>
      <span
        className={`text-sm px-3 py-1 rounded-full font-medium capitalize ${
          appt.status === 'completed'
            ? 'bg-green-600/20 text-green-400 border border-green-500'
            : appt.status === 'cancelled'
            ? 'bg-red-600/20 text-red-400 border border-red-500'
            : 'bg-blue-600/20 text-blue-400 border border-blue-500'
        }`}
      >
        {appt.status}
      </span>
    </div>

    <div className="text-sm space-y-1 text-gray-200">
      <p><span className="font-semibold text-white">📅 Date:</span> {new Date(appt.date).toLocaleDateString()}</p>
      <p><span className="font-semibold text-white">⏰ Slot:</span> {appt.slot}</p>
      <p><span className="font-semibold text-white">🎟 Token:</span> {appt.tokenNumber}</p>
    </div>

    <div className="flex flex-wrap gap-3 mt-5">
      <button
        onClick={() => handleStatusUpdate(appt._id, 'scheduled')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm transition"
      >
        Mark Scheduled
      </button>
      <button
        onClick={() => handleStatusUpdate(appt._id, 'completed')}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-full text-sm transition"
      >
        Mark Completed
      </button>
      <button
        onClick={() => handleStatusUpdate(appt._id, 'cancelled')}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-sm transition"
      >
        Mark Cancelled
      </button>
    </div>
  </motion.div>
))}

          </div>
        ) : (
          date && (
            <motion.p
              className="text-center mt-10 text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              📅 No appointments found for <strong>{new Date(date).toDateString()}</strong>
            </motion.p>
          )
        )}
      </motion.div>
    </div>
  );
};

export default DoctorDashboard;
