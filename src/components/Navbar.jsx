import React from "react";
import "../styles/Navbar.css";
import Wallet from "./Wallet";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li>
          <Wallet></Wallet>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
