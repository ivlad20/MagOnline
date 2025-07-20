import React, { useState } from "react";
import Dropdown from "./Dropdown";
import SearchBar from "./SearchBar";
import "./Navbar.css";
import { Link } from "react-router-dom";
import GradientBorder from "./GradientBorder";
import UserIcon from "../logos/UserIcon";
import MainLogo from "../logos/MainLogo";
import { useAuth } from "./AuthContext";
import CartIcon from "../logos/CartIcon";

const Navbar = () => {
  const { isLoggedIn, username } = useAuth();
  const [showSlideBox, setShowSlideBox] = useState(false);

  return (
    <div>
      <nav className="navbar1">
        <div className="logo">
          <MainLogo />
        </div>
        <div className="search-bar-container">
          <SearchBar />
        </div>
        <div className="nav-icons">
          {isLoggedIn ? (
            <Link to="/account" className="account-link">
              <div className="username-box">
                <div className="username-position-box">
                  <p className="username-text-style">Hi, {username}</p>
                  <UserIcon />
                </div>
              </div>
            </Link>
          ) : (
            <div className="username-box-alternate">
              <Link to="/login" className="account-link">
                <div className="username-box">
                  <div className="username-position-box-alternate">
                    <UserIcon />
                  </div>
                </div>
              </Link>
            </div>
          )}
          <div className="nav-fav-cart">
            <CartIcon />
          </div>
        </div>
      </nav>

      <nav className="navbar2">
        <div className="navbar2-links">
          <Link to="/" className="login-redirect">
            <div className="nav-link">
              <b>Home</b>
            </div>
          </Link>
          <div
            className="nav-link-products"
            onMouseEnter={() => setShowSlideBox(true)}
            onMouseLeave={() => setShowSlideBox(false)}
          >
            <b>Products</b>
          </div>
          <div className="nav-link">
            <b>Support</b>
          </div>
          <div className="nav-link">
            <b>Offers</b>
          </div>
        </div>
      </nav>

      {/* Sliding category box shown on hover */}
      <div
        className={`sliding-category-box ${showSlideBox ? "visible" : ""}`}
        onMouseEnter={() => setShowSlideBox(true)}
        onMouseLeave={() => setShowSlideBox(false)}
      >
        <div className="dropdown-links">
          <div className="first-dropdown-category">
            <h2>Laptop and PC</h2>
            <ul className="category-link-list">
              <li className="category-list-item">Gaming Laptops</li>
              <li className="category-list-item">Ultrabooks</li>
              <li className="category-list-item">Desktops</li>
              <li className="category-list-item">Mini PCs</li>
              <li className="category-list-item">All-in-One PCs</li>
              <li className="category-list-item">PC Components</li>
            </ul>
          </div>

          <div className="first-dropdown-category">
            <h2>Peripherals</h2>
            <ul className="category-link-list">
              <li className="category-list-item">Monitors</li>
              <li className="category-list-item">Keyboards</li>
              <li className="category-list-item">Mice</li>
              <li className="category-list-item">Headsets</li>
              <li className="category-list-item">Webcams</li>
            </ul>
          </div>

          <div className="first-dropdown-category">
            <h2>Smartphones</h2>
            <ul className="category-link-list">
              <li className="category-list-item">Android Phones</li>
              <li className="category-list-item">iPhones</li>
              <li className="category-list-item">Smartphone Accessories</li>
              <li className="category-list-item">Chargers & Cables</li>
              <li className="category-list-item">Phone Cases</li>
            </ul>
          </div>

          <div className="first-dropdown-category">
            <h2>Tablets</h2>
            <ul className="category-link-list">
              <li className="category-list-item">iPads</li>
              <li className="category-list-item">Android Tablets</li>
              <li className="category-list-item">Tablet Accessories</li>
              <li className="category-list-item">Styluses</li>
            </ul>
          </div>

          <div className="first-dropdown-category">
            <h2>Consoles</h2>
            <ul className="category-link-list">
              <li className="category-list-item">PlayStation</li>
              <li className="category-list-item">Xbox</li>
              <li className="category-list-item">Nintendo Switch</li>
              <li className="category-list-item">Game Controllers</li>
              <li className="category-list-item">Console Accessories</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
