import { useState, useEffect } from "react";
import "./App.css";

// images, it's okay to import images like this manually because this is a small project
import loading_icon from './assets/load.png';

function UserProfilePage() {
  const [display, setDisplay] = useState("Welcome to your profile, JohnDoe")

  useEffect(() => {
    fetch("/profile")
      .then((res) => res.json())
      .then((data) => setDisplay(data.message));
  }, []);

  return (
    <>
      <h1>{display}</h1>
      {/* At some point, maybe add profile picture support? Not super necessary though */}
      
      <a href="/" className="register_swap">Or log in here...</a>
      {/*<img src={loading_icon} className="loading_throbber"></img> */}
      {/* Yes, that's the actual term for the loading icon. Look it up */}
    </>
  );
}

export default UserProfilePage;
