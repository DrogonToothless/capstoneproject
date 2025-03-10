import { useState, useEffect } from "react";
import "./App.css";

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
    
    </>
  );
}

export default CoursesList;
