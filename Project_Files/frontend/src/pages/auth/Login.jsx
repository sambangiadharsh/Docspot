import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/api/${role}/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate(`/dashboard/${role}`);
      }
    } catch (error) {
      console.error(error);
      alert('Login failed. Please check your credentials.');
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
        <h2 className="text-3xl font-extrabold text-center mb-6">🔐 Login to DocSpot</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Select Role</label>
            <select
              className="w-full px-3 py-2 rounded bg-white/20 text-white border border-white/30 focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded bg-white/20 text-white border border-white/30 placeholder-gray-300 focus:outline-none"
              placeholder="example@docspot.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-white/20 text-white border border-white/30 placeholder-gray-300 focus:outline-none"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className='flex items-center justify-center'>
            <button
            type="submit"
            className="w-20 bg-green-500 content-center hover:bg-green-600 text-white font-semibold py-2 rounded transition"
          >
            Login
          </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
