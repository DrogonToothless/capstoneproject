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

      {/*I don't know if forms are the best way to do this but we'll figure out out*/}

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
          type = "login"
          value = "Submit"
        >Log In</button>
         <button
          type = "register"
          value = "Submit"
        >Sign Up</button>
      </form>
    </>
  );
}

export default App;
