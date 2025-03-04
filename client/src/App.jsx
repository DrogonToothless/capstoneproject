import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <>
      <h1>Log In</h1>

      <form>
        <div>
        <label for="username">Enter Username</label>
        <hr></hr>
        <input 
        name="username"
        id="username"
        type="text"
        placeholder="Username here..."></input>
        </div>

        <div>
        <label for="password">Enter Password</label>
        <hr></hr>
        <input 
        name="password"
        id="password"
        type="text"
        placeholder="Password here..."></input>
        </div>

        <button
          type = "submit"
          value = "Submit"
        >Log In</button>
      </form>
    </>
  );
}

export default App;
