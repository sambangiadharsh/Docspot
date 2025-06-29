# Docspot
# 🏥 DocSpot - Seamless Doctor Appointment Booking System

DocSpot is a full-stack web application that simplifies the process of booking appointments with doctors. The platform supports three user roles: **Admin**, **Doctor**, and **Patient**, offering a streamlined experience for healthcare appointment management.

---

## 🚀 Features

### 👤 Patient
- Search doctors by **speciality**, **location**, or **name**
- View doctor profiles with details and image
- Book appointments (Morning/Evening slots)
- View upcoming and completed appointments
- Login / Logout functionality

### 👨‍⚕️ Doctor
- Login with credentials provided by admin
- View personal profile and assigned appointments
- View appointment details by date and slot

### 🛠️ Admin
- Add, edit, delete doctor profiles (with image upload)
- Search doctors by filters
- View statistics by specialization
- Secure admin login/logout
- Responsive dashboard

---

## 🧑‍💻 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- Framer Motion
- React Router

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- Cookie-based auth (withCredentials)

---

## 📦 Folder Structure
DocSpot/
- ├── backend/
- │ ├── routes/
- │ ├── models/
- │ ├── controllers/
- │ ├── middleware/
- │ └── server.js
- ├── frontend/
- │ ├── pages/
- │ ├── components/
- │ └── App.js
- └── README.md

