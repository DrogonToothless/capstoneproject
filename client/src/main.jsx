import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import RegistrationPage from './Registration.jsx'
import UserProfilePage from "./Profile.jsx"
import CoursesList from "./Courses.jsx"
import AdminLogin from "./adminlogin.jsx"
import AdminDashboard from './Admin.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" element={<RegistrationPage/>}/>
      <Route path="/profile" element={<UserProfilePage/>}/>
      <Route path="/admin" element={<AdminDashboard/>}/>
      <Route path="/courses" element={<CoursesList/>}/>
      <Route path="/adminlogin" element={<AdminLogin/>}/>
    </Routes>
  </Router>
)
