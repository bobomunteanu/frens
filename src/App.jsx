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
    <div className="main">
      <button
        className="toggle-button"
        onClick={toggleSidebar}
        style={{ marginLeft: "22.5vw" }}
      >
        Menu
      </button>
      {showSidebar && <Navbar />}
      <div style={{ marginLeft: "15vw" }}>
        <Leaderboard></Leaderboard>
      </div>
    </div>
  );
}

export default App;
