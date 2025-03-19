import { useState, useEffect } from "react";
import "./App.css";
import "./Misc.css";

// images, it's okay to import images like this manually because this is a small project
import loading_icon from './assets/load.png';

function AdminPanel() {
  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <>
        <h1>
          Admin Panel
        </h1>
    </>
  );
}

export default AdminPanel;
