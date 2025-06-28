import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Footer from '../../components/Footer';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [showDoctors, setShowDoctors] = useState(true);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [editDoctorId, setEditDoctorId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctorStats, setDoctorStats] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    speciality: '',
    hospital: '',
    location: '',
    qualification: '',
    gender: '',
    age: '',
    image_url: '',
    maxAppointments: { morning: 5, evening: 5 },
  });

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/doctors`, { withCredentials: true });
      setDoctors(res.data);
      const stats = res.data.reduce((acc, doctor) => {
        acc[doctor.speciality] = (acc[doctor.speciality] || 0) + 1;
        return acc;
      }, {});
      setDoctorStats(stats);
    } catch (err) {
      console.error('Failed to fetch doctors', err);
      alert('Failed to fetch doctors');
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/search-doctors`, {
        params: { specialization, location, name },
        withCredentials: true,
      });
      setDoctors(res.data);
      if (res.data.length === 0) alert('No doctors found');
    } catch (err) {
      console.error('Search failed', err);
      alert('Doctor search failed');
    }
  };

  const handleAddOrUpdateDoctor = async () => {
    try {
      if (editDoctorId) {
        await axios.put(`${BASE_URL}/api/admin/update-doctor/${editDoctorId}`, formData, {
          withCredentials: true,
        });
        alert('Doctor updated successfully');
        setEditDoctorId(null);
      } else {
        await axios.post(`${BASE_URL}/api/admin/add-doctor`, formData, {
          withCredentials: true,
        });
        alert('Doctor added successfully');
      }
      fetchDoctors();
      setFormData({
        name: '',
        email: '',
        password: '',
        address: '',
        speciality: '',
        hospital: '',
        location: '',
        qualification: '',
        gender: '',
        age: '',
        image_url: '',
        maxAppointments: { morning: 5, evening: 5 },
      });
      setShowAddDoctor(false);
    } catch (err) {
      console.error('Add/Update doctor failed', err);
      alert('Failed to add/update doctor');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this doctor?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/delete-doctor/${id}`, {
        withCredentials: true,
      });
      alert('Doctor deleted');
      fetchDoctors();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleEdit = (doctor) => {
    setEditDoctorId(doctor._id);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      password: '',
      address: doctor.address,
      speciality: doctor.speciality,
      hospital: doctor.hospital,
      location: doctor.location,
      qualification: doctor.qualification,
      gender: doctor.gender,
      age: doctor.age,
      image_url: doctor.image_url,
      maxAppointments: doctor.maxAppointments,
    });
    setShowAddDoctor(true);
    
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    axios.post(`${BASE_URL}/api/admin/logout`, {}, { withCredentials: true })
      .then(() => navigate('/login'))
      .catch((err) => console.error('Logout failed', err));
  };

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-gray-900 text-white p-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="relative h-130 rounded-b-lg overflow-hidden shadow-lg">
        <img src="/assets/admin.jpg" alt="admin banner" className="w-full h-full object-cover opacity-40" />
        <div className="absolute top-4 right-4 z-20">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="bg-white/10 p-2 rounded-full hover:bg-white/20">
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          {sidebarOpen && (
            <div className="mt-2 flex flex-col gap-2 items-end">
              <button onClick={() => navigate('/admin/profile')} className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition">Profile</button>
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition">Logout</button>
            </div>
          )}
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-xl">👨‍💼 Welcome, Admin!</h1>
          <p className="text-sm text-gray-200">Manage your doctors efficiently and view statistics</p>
        </div>
      </div>

      {Object.keys(doctorStats).length > 0 && (
        <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          {Object.entries(doctorStats).map(([spec, count]) => (
            <div key={spec} className="bg-white/10 p-4 rounded-lg shadow text-center">
              <p className="text-lg font-semibold">{spec}</p>
              <p className="text-2xl font-bold text-green-400">{count}</p>
            </div>
          ))}
        </motion.div>
      )}

      <div className="flex gap-4 mb-6">
        <button onClick={() => setShowDoctors(!showDoctors)} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
          {showDoctors ? 'Hide Doctors' : 'View Doctors'}
        </button>
        <button onClick={() => {
          setShowAddDoctor(!showAddDoctor);
          setEditDoctorId(null);
          setFormData({
            name: '',
            email: '',
            password: '',
            address: '',
            speciality: '',
            hospital: '',
            location: '',
            qualification: '',
            gender: '',
            age: '',
            image_url: '',
            maxAppointments: { morning: 5, evening: 5 },
          });
        }} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition">
          {showAddDoctor ? 'Cancel' : 'Add Doctor'}
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <input type="text" placeholder="Specialization" className="border p-2 rounded w-full" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
        <input type="text" placeholder="Location" className="border p-2 rounded w-full" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input type="text" placeholder="Doctor Name" className="border p-2 rounded w-full" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 transition" onClick={handleSearch}>Search</button>
      </div>

      {showAddDoctor && (
        <motion.div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
          <h2 className="text-xl font-semibold mb-4 text-white">{editDoctorId ? 'Update Doctor' : 'Add Doctor'}</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(formData).map((key) => {
              if (key === 'maxAppointments') return null;
              return (
                <input
                  key={key}
                  name={key}
                  type={key === 'email' ? 'email' : key === 'password' ? 'password' : 'text'}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  className="border p-2 rounded"
                  value={formData[key]}
                  onChange={handleChange}
                />
              );
            })}
            <input type="number" placeholder="Max Morning Appointments" className="border p-2 rounded" value={formData.maxAppointments.morning} onChange={(e) => setFormData({ ...formData, maxAppointments: { ...formData.maxAppointments, morning: parseInt(e.target.value) } })} />
            <input type="number" placeholder="Max Evening Appointments" className="border p-2 rounded" value={formData.maxAppointments.evening} onChange={(e) => setFormData({ ...formData, maxAppointments: { ...formData.maxAppointments, evening: parseInt(e.target.value) } })} />
          </div>
          <button onClick={handleAddOrUpdateDoctor} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            {editDoctorId ? 'Update' : 'Submit'}
          </button>
        </motion.div>
      )}

      {showDoctors && (
        <>
          <h2 className="text-xl font-semibold mb-4">All Registered Doctors</h2>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {doctors.length === 0 ? (
              <p className="text-center text-gray-400 col-span-full">No doctors available</p>
            ) : (
              doctors.map((doctor) => (
                <div key={doctor._id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-white shadow hover:shadow-lg transition">
                  {doctor.image_url && (
                    <img
                      src={doctor.image_url}
                      alt={doctor.name}
                      className="w-24 h-24 round-full mx-auto object-cover rounded-md mb-3 border border-white/20"
                    />
                  )}
                  <h3 className="text-xl font-bold mb-2">{doctor.name}</h3>
                  <p><strong>Speciality:</strong> {doctor.speciality}</p>
                  <p><strong>Hospital:</strong> {doctor.hospital}</p>
                  <p><strong>Location:</strong> {doctor.location}</p>
                  <p><strong>Qualification:</strong> {doctor.qualification}</p>
                  <p><strong>Gender:</strong> {doctor.gender}</p>
                  <p><strong>Age:</strong> {doctor.age}</p>
                  <p><strong>Email:</strong> {doctor.email}</p>
                  <p><strong>Address:</strong> {doctor.address}</p>
                  <div className="flex gap-4 mt-4">
                    <button type="button" onClick={() => handleEdit(doctor)} className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(doctor._id)} className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-1 rounded">Delete</button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </>
      )}

      <div className="mt-12">
        <Footer />
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
