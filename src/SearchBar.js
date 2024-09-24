import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    console.log("Searching for:", query);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search for product..."
        value={query}
        onChange={handleInputChange}
      />
      <button className="search-btn" onClick={handleSearch}>
        <img src="images\search.png" className="search-img" alt="search"></img>
      </button>
    </div>
  );
};

export default SearchBar;
