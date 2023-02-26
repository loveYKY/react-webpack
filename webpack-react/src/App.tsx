import React from "react";
import "./App.scss";
import avatar from "../assets/avatar.jpg";

function App() {
  console.log("NODE_ENV", process.env.NODE_ENV);
  console.log("BASE_ENV", process.env.BASE_ENV);
  return (
    <div>
      <h2>webpack5-react-ts</h2>
      <img src={avatar}></img>
    </div>
  );
}
export default App;
