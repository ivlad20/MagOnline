import React from "react";
import "./App.css";
import Navbar from "./Navbar";
import Login from "./Login";
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import Home from "./Home"; // Import the Home component

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route 
          path="/login" 
          element={<Login />} 
          />
      </Routes>
    </div>
  );
}

export default App;