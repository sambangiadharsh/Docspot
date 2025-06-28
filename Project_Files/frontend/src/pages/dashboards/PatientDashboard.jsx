import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Footer from '../../components/Footer';
import { ChevronDown, ChevronUp } from 'lucide-react';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [speciality, setSpeciality] = useState('');
  const [location, setLocation] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('morning');
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/patient/appointments', {
        withCredentials: true,
      });
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/patient/search-doctors', {
        params: { speciality, location },
        withCredentials: true,
      });
      setDoctors(res.data);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  const handleBookAppointment = async () => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/patient/book',
        {
          doctorId: selectedDoctor._id,
          date,
          slot,
          documents: [],
        },
        { withCredentials: true }
      );
      alert(res.data.msg + ' | Token: ' + res.data.tokenNumber);
      setSelectedDoctor(null);
      fetchAppointments();
    } catch (err) {
      console.error('Booking failed', err);
      alert('Booking failed.');
    }
  };

  const upcoming = appointments.filter((a) => new Date(a.date) >= new Date());
  const completed = appointments.filter((a) => new Date(a.date) < new Date());

  const handleLogout = () => {
    axios
      .post('http://localhost:8000/api/patient/logout', {}, { withCredentials: true })
      .then(() => navigate('/login'))
      .catch((err) => console.error('Logout failed', err));
  };

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-gray-900 text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      
      <div className="relative h-130 rounded-b-lg overflow-hidden shadow-lg">
       <div className="relative h-[500px] md:h-[550px] lg:h-[600px] w-full overflow-hidden rounded-b-lg shadow-lg">
  <img
    src="/assets/patient-hero.jpg"
    alt="banner"
    className="absolute inset-0 w-full h-full object-cover opacity-50"
  />
</div>

        <div className="absolute top-4 right-4 z-20">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition duration-300">
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          {sidebarOpen && (
            <motion.div className="mt-2 flex flex-col gap-2 items-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <button onClick={() => navigate('/patient/profile')} className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition">Profile</button>
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition">Logout</button>
            </motion.div>
          )}
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-xl">👤 Welcome, Patient!</h1>
          <p className="text-sm text-gray-200">Search doctors and manage your appointments</p>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-8 flex flex-col md:flex-row gap-4">
  <input
    type="text"
    placeholder="Speciality"
    value={speciality}
    onChange={(e) => setSpeciality(e.target.value)}
    className="border border-gray-300 p-2 text-sm rounded-md w-full md:w-1/3 text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
  />
  <input
    type="text"
    placeholder="Location"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    className="border border-gray-300 p-2 text-sm rounded-md w-full md:w-1/3 text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
  />
  <motion.button
    onClick={handleSearch}
    className="bg-blue-600 text-white text-sm px-2 py-1 rounded-md hover:bg-blue-700 transition w-full mr-100 md:w-1/4"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    Search
  </motion.button>
</div>


        {selectedDoctor ? (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="flex flex-col items-center gap-4">
            <div className="bg-white text-black p-6 rounded-xl shadow-md w-full max-w-xl">
              <h2 className="text-2xl font-bold mb-2">Dr. {selectedDoctor.name}</h2>
              <p><strong>Specialization:</strong> {selectedDoctor.speciality}</p>
              <p><strong>Qualification:</strong> {selectedDoctor.qualification}</p>
              <p><strong>Hospital:</strong> {selectedDoctor.hospital}</p>
              <p><strong>Location:</strong> {selectedDoctor.location}</p>
              <p><strong>Gender:</strong> {selectedDoctor.gender}</p>
              <p><strong>Age:</strong> {selectedDoctor.age}</p>
              <p><strong>Address:</strong> {selectedDoctor.address}</p>
              <p><strong>Max Morning Appointments:</strong> {selectedDoctor.maxAppointments?.morning}</p>
              <p><strong>Max Evening Appointments:</strong> {selectedDoctor.maxAppointments?.evening}</p>
              <div className="flex gap-4 mt-4">
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2 rounded text-black" />
                <select value={slot} onChange={(e) => setSlot(e.target.value)} className="border p-2 rounded text-black">
                  <option value="morning">Morning</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
              <div className="flex gap-4 mt-4">
                <motion.button onClick={handleBookAppointment} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Book Appointment</motion.button>
                <motion.button onClick={() => setSelectedDoctor(null)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition w-full" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Back</motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          doctors.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-4">Search Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doc) => (
                  <motion.div
                    key={doc._id}
                    onClick={() => setSelectedDoctor(doc)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="cursor-pointer bg-white/10 border border-white/20 p-5 rounded-xl shadow-lg hover:bg-white/20 transition-all"
                  >
                    {doc.image_url && (
                      <div className="flex justify-center mb-4">
                        <img
                          src={doc.image_url}
                          alt={doc.name}
                          className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
                        />
                      </div>
                    )}
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-1"> {doc.name}</h3>
                      <p className="text-sm text-gray-200">
                        <strong>Speciality:</strong> {doc.speciality}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )
        )}

         <div className=" mt-12 flex flex-col gap-4">
          <motion.button
            onClick={() => setShowUpcoming(!showUpcoming)}
            className="bg-indigo-600 hover:bg-indigo-700 transition px-6 py-3 rounded shadow flex items-center gap-2 self-start"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showUpcoming ? 'Hide Upcoming Appointments' : 'Show Upcoming Appointments'}
            {showUpcoming ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </motion.button>

          {showUpcoming && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              {upcoming.length === 0 ? (
                <p className="text-gray-300">No upcoming appointments.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcoming.map((appt) => (
                    <motion.div key={appt._id} className="bg-white/10 border border-white/20 p-6 rounded-xl shadow-md hover:shadow-lg transition">
                      <p><strong>Doctor:</strong> {appt.doctorId.name}</p>
                      <p><strong>Date:</strong> {appt.date}</p>
                      <p><strong>Slot:</strong> {appt.slot}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          <motion.button
            onClick={() => setShowCompleted(!showCompleted)}
            className="bg-indigo-600 hover:bg-indigo-700 transition px-6 py-3 rounded shadow flex items-center gap-2 self-start"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showCompleted ? 'Hide Completed Appointments' : 'Show Completed Appointments'}
            {showCompleted ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </motion.button>

          {showCompleted && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              {completed.length === 0 ? (
                <p className="text-gray-300">No completed appointments.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completed.map((appt) => (
                    <motion.div key={appt._id} className="bg-white/10 border border-white/20 p-6 rounded-xl shadow-md hover:shadow-lg transition">
                      <p><strong>Doctor:</strong> {appt.doctorId.name}</p>
                      <p><strong>Date:</strong> {appt.date}</p>
                      <p><strong>Slot:</strong> {appt.slot}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </motion.div>
  );
};

export default PatientDashboard;
