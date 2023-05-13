import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Burn from "./components/Burn";
import * as buffer from "buffer";
import Leaderboard from "./components/Leaderboard";

window.Buffer = buffer.Buffer;

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Leaderboard></Leaderboard>
    </>
  );
}

export default App;
