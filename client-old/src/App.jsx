import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import Home from "./components/Home"; // Import the Home component
import Footer from "./components/Footer";
import { AuthProvider } from "./components/AuthContext";
import Account from "./components/Account"
import ProductPage from "./components/ProductPage";

function App() {
  return (
    <div>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />}></Route> 
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </AuthProvider>
      <Footer />
    </div>
  );
}

export default App;
