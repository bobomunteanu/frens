import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Burn from "./components/Burn";
import * as buffer from "buffer";
import Leaderboard from "./components/Leaderboard";
import NFTLeaderboard from "./components/NFTLeaderboard";

window.Buffer = buffer.Buffer;

function App() {
  return (
    <div className="main">
      <Navbar></Navbar>
      <table style={{ marginLeft: "12vw", marginTop: "-20vw" }}>
        <tr>
          <td>
            <Leaderboard></Leaderboard>
          </td>
          <td style={{ paddingLeft: "5vw" }}>
            <NFTLeaderboard></NFTLeaderboard>
          </td>
        </tr>
      </table>
    </div>
  );
}

export default App;
