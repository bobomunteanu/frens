import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import * as buffer from "buffer";
import Leaderboard from "./components/Leaderboard";
import NFTLeaderboard from "./components/NFTLeaderboard";

window.Buffer = buffer.Buffer;

function App() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div>
      <button
        className="toggle-button"
        onClick={toggleSidebar}
        style={{ marginLeft: "40vw" }}
      >
        <img
          src="https://icon-library.com/images/hamburger-menu-icon-png/hamburger-menu-icon-png-9.jpg"
          width="20px"
        />
      </button>
      <div className="main">
        {showSidebar && <Navbar />}
        <div style={{ marginLeft: "15vw" }}>
          <Leaderboard></Leaderboard>
        </div>
      </div>
    </div>
  );
}

export default App;
