import { useState, useEffect } from "react";
import "./App.css";
import "./Courses.css";
import "./Misc.css";

// images, it's okay to import images like this manually because this is a small project
import loading_icon from './assets/load.png';

function CoursesList() {
  useEffect(() => {
    fetch("/courses")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <>
      <h1>Courses</h1>


      {/*Table will be filled out with javascript*/}
      <table>
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
      </table>
    </>
  );
}

export default CoursesList;
