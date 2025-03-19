import { useState, useEffect } from "react";
import "./App.css";
import "./Courses.css";
import "./Misc.css";
import Navbar from "./Navbar";
import loading_icon from './assets/load.png';

function CoursesList() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getCourses = async () => {
    try {
      const res = await fetch("/courses", { method: "POST" });
      if (!res.ok) {
        throw new Error(`Failed to fetch courses: ${res.statusText}`);
      }
      const json = await res.json();
      console.log("Fetched data:", json);
      const courses = Array.isArray(json) ? json : [];
      setData(courses);
      setFilteredData(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const registerForCourse = async (courseId) => {
    try {
      const res = await fetch(`/courseregister/${courseId}`, { method: "POST" });
      if (!res.ok) {
        throw new Error(`Failed to register: ${res.statusText}`);
      }
      alert("Successfully registered for the course!");
    } catch (error) {
      console.error("Error registering for course:", error);
      alert(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  useEffect(() => {
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = data.filter(course => 
      course.title.toLowerCase().includes(lowercasedSearch) ||
      course.description.toLowerCase().includes(lowercasedSearch) ||
      course.string_id.toLowerCase().includes(lowercasedSearch)
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  return (
    <>
      <Navbar/>
      <h1>Courses</h1>
      <input 
        type="text" 
        placeholder="Search courses..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isLoading ? (
        <img src={loading_icon} className="loading_throbber" alt="Loading..." />
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>String ID</th>
              <th>Course Title</th>
              <th>Description</th>
              <th>Schedule</th>
              <th>Classroom Number</th>
              <th>Maximum Capacity</th>
              <th>Credit Hours</th>
              <th>Tuition Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((course, index) => (
              <tr key={index}>
                <td>{course.string_id}</td>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td>{course.schedule}</td>
                <td>{course.classroom_number}</td>
                <td>{course.maximum_capacity}</td>
                <td>{course.credit_hours}</td>
                <td>{course.tuition_cost}</td>
                <td>
                  <button onClick={() => registerForCourse(course.string_id)}>
                    Register
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default CoursesList;
