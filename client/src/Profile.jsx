import { useState, useEffect } from "react";
import "./Profile.css";
import "./Misc.css";

// images, it's okay to import images like this manually because this is a small project
import loading_icon from './assets/load.png';

import template_pfp from "./assets/profile_placeholder.png";
import edit_details from "./assets/profile_editdetails.png";

function UserProfilePage() {
  const [display, setDisplay] = useState("Welcome to your profile, JohnDoe")

  useEffect(() => {
    fetch("/profile")
      .then((res) => res.json())
      .then((data) => setDisplay(data.message));
  }, []);

  return (
    <>
      <div className="profile_welcome">
        <img src={template_pfp} className="profile_pic"></img>
        <h1>{display}</h1>

        <a href="/editprofdetails" className="edit_details"><img src={edit_details}></img></a>
      </div>
      {/* At some point, maybe add profile picture support? Not super necessary though */}
      
      {/*<img src={loading_icon} className="loading_throbber"></img> */}
      {/* Yes, that's the actual term for the loading icon. Look it up */}
    </>
  );
}

export default UserProfilePage;
