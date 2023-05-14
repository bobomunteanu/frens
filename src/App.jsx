import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import * as buffer from "buffer";
import Leaderboard from "./components/Leaderboard";
import NFTLeaderboard from "./components/NFTLeaderboard";

window.Buffer = buffer.Buffer;

function App() {
  return (
    <div className="main">
      <Navbar></Navbar>
      <div style={{ marginLeft: "15vw" }}>
        <Leaderboard></Leaderboard>
      </div>
    </div>
  );
}

export default App;
