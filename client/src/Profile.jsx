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
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  useEffect(() => {
    // Fetch profile data with POST request
    fetch("/profile", {
      method: "POST",  // Change to POST
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch profile data");
        }
        return res.json();
      })
      .then((data) => {
        setProfileData(data.userData);
        setUpdatedProfile({
          first_name: data.userData.first_name,
          last_name: data.userData.last_name,
          email: data.userData.email,
        });
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

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission to update user data
  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch("/update-profile", {
      method: "PUT",  // Change to PUT (or POST depending on your backend setup)
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfile),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfileData((prevData) => ({
            ...prevData,
            ...updatedProfile,
          }));
          setIsEditing(false);
        } else {
          setError("Failed to update profile.");
        }
      })
      .catch((err) => {
        setError("Error updating profile");
      });
  };

  return (
    <>
      <div className="profile_welcome">
        <img src={template_pfp} className="profile_pic" alt="Profile" />
        <h1>{profileData ? `Welcome, ${profileData.first_name || profileData.username}` : "Loading..."}</h1>

        <button
          className="edit_details_button"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel Edit" : "Edit Details"}
        </button>
      </div>

      <h2>Your Profile</h2>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="first_name"
              value={updatedProfile.first_name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={updatedProfile.last_name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={updatedProfile.email}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Save Changes</button>
        </form>
      ) : (
        <>
          <p><strong>Username:</strong> {profileData.username}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>First Name:</strong> {profileData.first_name}</p>
          <p><strong>Last Name:</strong> {profileData.last_name}</p>
        </>
      )}

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
