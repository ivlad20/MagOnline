import React from "react";
import "./App.css";
import Navbar from "./components/components/Navbar";
import Login from "./components/components/Login";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import Home from "./components/components/Home"; // Import the Home component
import Footer from "./components/components/Footer";
import { AuthProvider } from "./components/components/AuthContext";
import Account from "./components/components/Account"

function App() {
  return (
    <div>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />}></Route> 
        </Routes>
      </AuthProvider>
      <Footer />
    </div>
  );
}

export default App;
