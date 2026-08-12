import React, { useState } from "react";
import "./Dropdown.css";

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All categories");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="dropdown">
      <button onClick={toggleDropdown} className="dropdown-toggle">
        {selectedOption}
      </button>

      {/* Add or remove the 'open' class based on state */}
      <ul className={`dropdown-menu ${isOpen ? "open" : ""}`}>
        <li
          onClick={() => handleSelect("All categories")}
          className="dropdown-item"
        >
          All categories
        </li>
        <li onClick={() => handleSelect("Option 1")} className="dropdown-item">
          Option 1
        </li>
        <li onClick={() => handleSelect("Option 2")} className="dropdown-item">
          Option 2
        </li>
        <li onClick={() => handleSelect("Option 3")} className="dropdown-item">
          Option 3
        </li>
      </ul>
    </div>
  );
}

export default Dropdown;
