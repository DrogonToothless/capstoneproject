import { useState, useEffect } from "react";
import "./App.css";
import "./Courses.css";
import "./Misc.css";

// images, it's okay to import images like this manually because this is a small project
import loading_icon from './assets/load.png';

function CoursesList() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const getCourses = async() => {
    try {
      const res = await fetch("/courses");
      const json = await res.json();
      setData(json);
    } catch(error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     getCourses();
  }, []);

  console.log(data);

  return (
    <>
      <h1>Courses</h1>


      {/*Table will be filled out with javascript*/}
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

        </tbody>
        <tfoot>
          
        </tfoot>
      </table>
    </>
  );
}

export default CoursesList;
