import { useState, useEffect } from "react";
import "./App.css";
import "./Misc.css";
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
      <form method="POST" action="/">
        <div>
          <label for="username">Enter Username</label>
          <hr></hr>
          <input name="username" id="username" type="text" placeholder="Username here..."></input>
        </div>
        <div>
          <label for="password">Enter Password</label>
          <hr></hr>
          <input name="password" id="password" type="password" placeholder="Password here..."></input>
        </div>
        <button type = "login" value = "Submit">Log In</button>
      </form>
      <a href="/register" className="register_swap">Or register here...</a>
      {/*<img src={loading_icon} className="loading_throbber"></img> */}
      {/* Yes, that's the actual term for the loading icon. Look it up */}
    </>
  );
}

export default App;
