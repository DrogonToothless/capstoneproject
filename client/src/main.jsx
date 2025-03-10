import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import RegistrationPage from './Registration.jsx'
import UserProfilePage from "./Profile.jsx"
import AdminPanel from "./Admin.jsx"
import CoursesList from "./Courses.jsx"

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path ="/register" element={<RegistrationPage/>} />
      <Route path="/profile" element={<UserProfilePage/>} />
      <Route path="/admin" element={<AdminPanel/>}/>
      <Route path="/courses" element={<CoursesList/>}/>
    </Routes>
  </Router>
)
