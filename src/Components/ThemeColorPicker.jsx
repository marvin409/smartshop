import React, { useState, useEffect } from "react";

const ThemeColorPicker = () => {
  const [color, setColor] = useState(localStorage.getItem("themeColor") || "orange");

  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", color);
    localStorage.setItem("themeColor", color);
  }, [color]);

  return (
    <select 
      className="theme-picker" 
      value={color} 
      onChange={(e) => setColor(e.target.value)}
    >
      <option value="orange">🟠 Orange</option>
      <option value="blue">🔵 Blue</option>
      <option value="green">🟢 Green</option>
      <option value="purple">🟣 Purple</option>
    </select>
  );
};

export default ThemeColorPicker;
