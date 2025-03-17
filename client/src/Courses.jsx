import { useState, useEffect } from "react";
import "./App.css";
import "./Courses.css";
import "./Misc.css";
import loading_icon from './assets/load.png';

function CoursesList() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCourses = async () => {
    try {
      const res = await fetch("/courses", { method: "POST" });
      if (!res.ok) {
        throw new Error(`Failed to fetch courses: ${res.statusText}`);
      }
      const json = await res.json();
      console.log("Fetched data:", json);
      setData(Array.isArray(json) ? json : []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCourses();
  }, []);
  return (
    <>
      <h1>Courses</h1>
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
          </tr>
        </thead>
        <tbody>
          {data.map((course, index) => (
            <tr key={index}>
              <td>{course.string_id}</td>
              <td>{course.title}</td>
              <td>{course.description}</td>
              <td>{course.schedule}</td>
              <td>{course.classroom_number}</td>
              <td>{course.maximum_capacity}</td>
              <td>{course.credit_hours}</td>
              <td>{course.tuition_cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default CoursesList;
