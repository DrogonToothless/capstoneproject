import { useState, useEffect } from "react";
import "./Profile.css";
import "./Misc.css";

// images, it's okay to import images like this manually because this is a small project
import loading_icon from './assets/load.png';
import template_pfp from "./assets/profile_placeholder.png";
import edit_details from "./assets/profile_editdetails.png";

function UserProfilePage() {
  const [display, setDisplay] = useState("Welcome to your profile, JohnDoe");
  const [registeredCourses, setRegisteredCourses] = useState([]);

  useEffect(() => {
    fetch("/profile")
      .then((res) => res.json())
      .then((data) => setDisplay(data.message));

    fetch("/registered-courses")
      .then((res) => res.json())
      .then((data) => setRegisteredCourses(data.courses || []));
  }, []);

  return (
    <>
      <div className="profile_welcome">
        <img src={template_pfp} className="profile_pic" alt="Profile" />
        <h1>{display}</h1>

        <a href="/editprofdetails" className="edit_details">
          <img src={edit_details} alt="Edit Details" />
        </a>
      </div>

      <h2>Your Registered Courses</h2>
      <ul>
        {registeredCourses.length > 0 ? (
          registeredCourses.map((course, index) => (
            <li key={index}>{course}</li>
          ))
        ) : (
          <p>No courses registered yet.</p>
        )}
      </ul>
    </>
  );
}

export default UserProfilePage;
