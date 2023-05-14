import React, { useState } from "react";
import "../styles/NumericInput.css";

const NumberTextField = ({ value, onChange }) => {
  const handleKeyPress = (e) => {
    const keyCode = e.which || e.keyCode;
    const keyValue = String.fromCharCode(keyCode);

    // Only allow numbers (0-9) and backspace/delete key
    if (!/^\d$/.test(keyValue) && keyCode !== 8 && keyCode !== 46) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <input
      style={{ width: "90%" }}
      type="text"
      placeholder="$FRENS amount"
      className="numericinput"
      value={value}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
    />
  );
};

export default NumberTextField;
