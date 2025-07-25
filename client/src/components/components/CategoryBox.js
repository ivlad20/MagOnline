import React, { useState, useEffect } from "react";
import "./CategoryBox.css";

const CategoryBox = ({ category, image }) => {
  return (
    <div className="shopNow-category-container">
      <div className="shopNow-category-container-1">
        <div className="category-box-title">
          <h2>Game Joysticks</h2>
        </div>
        <div className="category-box-shop-now-container">
          <div className="category-box-shop-now-link">
            <h3>SHOP NOW</h3>
          </div>
        </div>
      </div>
      <div className="category-box-image-container">
        <img src="./images/controller.png" alt="category-image" className="category-box-image" />
      </div>
    </div>
  );
};

export default CategoryBox;
