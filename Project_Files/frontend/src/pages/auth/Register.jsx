import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    gender: '',
    role: 'patient',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8000/api/${formData.role}/register`,
        { ...formData, age: Number(formData.age) }
      );
      if (res.status === 200 || res.status === 201) {
        navigate(`/dashboard/${formData.role}`);
      }
    } catch (error) {
      console.error(error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-gray-900">
      <motion.div
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-8 w-[90%] max-w-md text-white"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-extrabold text-center mb-6">📝 Register on DocSpot</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-white/20 text-white border border-white/30 focus:outline-none"
            >
              <option value="admin">Admin</option>
              <option value="patient">Patient</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full px-3 py-2 rounded bg-white/20 text-white border border-white/30 placeholder-gray-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@docspot.com"
              required
              className="w-full px-3 py-2 rounded bg-white/20 text-white border border-white/30 placeholder-gray-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full px-3 py-2 rounded bg-white/20 text-white border border-white/30 placeholder-gray-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              required
              className="w-full px-3 py-2 rounded bg-white/20 text-white border border-white/30 placeholder-gray-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              required
              className="w-full px-3 py-2 rounded bg-white/20 text-white border border-white/30 placeholder-gray-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded bg-white/20 text-white border border-white/30 focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-24 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition"
            >
              Register
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
