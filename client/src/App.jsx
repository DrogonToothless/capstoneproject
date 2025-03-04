import { useState, useEffect } from "react";
import "./App.css";

// images, it's okay to import images like this manually because this is a small project
import loading_icon from './assets/load.png';

function App() {
  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <>
      <h1>Log In</h1>

      {/*I don't know if forms are the best way to do this but we'll figure it out*/}

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
      {/*<img src={loading_icon} className="loading_throbber"></img> */}
      {/* Yes, that's the actual term for the loading icon. Look it up */}
    </>
  );
}

export default App;
