import { useState, useEffect } from "react";
import "./Profile.css";
import "./Misc.css";

// images, it's okay to import images like this manually because this is a small project
import loading_icon from './assets/load.png';
import template_pfp from "./assets/profile_placeholder.png";
import edit_details from "./assets/profile_editdetails.png";

function UserProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch profile data with POST request
    fetch("/profile", {
      method: "POST",  // Change to POST
      headers: {
        "Content-Type": "application/json",
      },
      // Optionally, include token in headers if needed
      // headers: {
      //   "Content-Type": "application/json",
      //   "Authorization": `Bearer ${yourToken}`
      // }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch profile data");
        }
        return res.json();
      })
      .then((data) => {
        setProfileData(data.userData);
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Error fetching profile data");
        setIsLoading(false);
      });
  
    // Fetch registered courses
    fetch("/registered-courses")
      .then((res) => res.json())
      .then((data) => setRegisteredCourses(data.courses || []))
      .catch((err) => setError("Error fetching registered courses"));
  }, []);
  // If loading, display the loading spinner
  if (isLoading) {
    return <img src={loading_icon} alt="Loading..." />;
  }

  // If there's an error, display an error message
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      <div className="profile_welcome">
        <img src={template_pfp} className="profile_pic" alt="Profile" />
        <h1>{profileData ? `Welcome, ${profileData.first_name || profileData.username}` : "Loading..."}</h1>

        <a href="/editprofdetails" className="edit_details">
          <img src={edit_details} alt="Edit Details" />
        </a>
      </div>

      <h2>Your Profile</h2>
      <p><strong>Username:</strong> {profileData.username}</p>
      <p><strong>Email:</strong> {profileData.email}</p>
      <p><strong>First Name:</strong> {profileData.first_name}</p>
      <p><strong>Last Name:</strong> {profileData.last_name}</p>

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
