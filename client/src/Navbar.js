import React, {useState, useEffect} from "react";
import Dropdown from "./Dropdown";
import SearchBar from "./SearchBar";
import "./Navbar.css";
import { Link, UNSAFE_ViewTransitionContext } from "react-router-dom";
import GradientBorder from "./GradientBorder";
import UserIcon from "./UserIcon";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {

  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username); // store username in state
        console.log("Username:", decoded.username);
      } catch (e) {
        console.error("Invalid token", e);
      }
    }
  }, []);

  return (
    <div>
      <nav className="navbar1">
        <div className="logo">
          <img src="images/logo.png" alt="logo" className="logo-img" />
        </div>
        <div className="searchBar"></div>
        <div className="nav-icons">
          <GradientBorder
            width="5vw"
            height="3vh"
            speed={4}
            colors={["#1e40af", "#2453d4", "#3b82f6"]}
            className="username-border"
          >
            <b className="username-text-style">{username}</b>
            <UserIcon></UserIcon>
          </GradientBorder>
        </div>
      </nav>

      <nav className="navbar2">
        <div className="navbar2-links">
          <Link to="/">
            <div className="nav-link">
              <b>Home</b>
            </div>
          </Link>
          <div className="nav-link">
            <b>Pages</b>
          </div>
          <div className="nav-link">
            <b>Shop</b>
          </div>
          <div className="nav-link">
            <b>Offers</b>
          </div>
          <Link to="/login">
            <div className="nav-link">Login</div>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
