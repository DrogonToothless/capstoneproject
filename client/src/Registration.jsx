import { useState, useEffect } from "react";
import "./App.css";

// images, it's okay to import images like this manually because this is a small project
import loading_icon from './assets/load.png';

function RegistrationPage() {
  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <>
      <h1>Register</h1>

      {/*I don't know if forms are the best way to do this but we'll figure it out*/}

      <form method="POST" action="/register">
        <div>
          <label for="firstname">First Name</label>
          <hr></hr>
          <input name="firstname" id="firstname" type="text" placeholder="First Name"></input>
        </div>
        <div>
          <label for="lastname">Last Name</label>
          <hr></hr>
          <input name="lastname" id="lastname" type="text" placeholder="Last Name"></input>
        </div>
        <div>
          <label for="email">Email</label>
          <hr></hr>
          <input name="email" id="email" type="text" placeholder="email"></input>
        </div>
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
        <button type="register" value="Submit">Register</button>
      </form>
      <a href="/" className="register_swap">Or log in here...</a>
      {/*<img src={loading_icon} className="loading_throbber"></img> */}
      {/* Yes, that's the actual term for the loading icon. Look it up */}
    </>
  );
}

export default RegistrationPage;
