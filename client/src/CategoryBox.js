import React, { useState, useEffect } from "react";
import "./CategoryBox.css";

const CategoryBox = ({ category, image }) => {
  return (
    <div className="shopNow-category-container">
      <div className="shopNow-category-left">
        <div className="shopNow-category-container-category">
          <b className="bold-Category">{category}</b>
        </div>
        <div className="shopNow-category-container-shopNow">
          <b className="bold-ShopNow">SHOP NOW</b>
        </div>
      </div>
      <div className="shopNow-category-image-container">
        <img src={image} alt="Joysticks" />
      </div>
    </div>
  );
};

export default CategoryBox;
