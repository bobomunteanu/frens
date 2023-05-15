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
            <ul style={{ marginLeft: "10vw" }}>
                <li>
                    <h1>$FRENS</h1>
                </li>
                <li>
                    <button className="toggle-button" onClick={toggleSidebar}>
                        <img
                            src="https://icon-library.com/images/hamburger-menu-icon-png/hamburger-menu-icon-png-9.jpg"
                            width="20px"
                        />
                    </button>
                </li>
            </ul>
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
