import React from "react";
import "./ProductCardSmall.css"; // Importing CSS file for styles
import { FaHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";

const ProductCardSmall = ({image, title, category, price}) => {
  return (
    <div className="product-card-small">
      <div className="product-card-top-small">
        <div className="product-card-top-1">
          <p className="small">{category}</p>
        </div>
        <div className="product-card-top-2">
          <FaHeart className="heart-svg-small" />
        </div>
      </div>
      <div className="product-card-image-small">
        <img
          src={image}
          alt="product"
          className="product-image-small"
        />
      </div>
      <div className="product-card-bottom-small">
        <div className="product-card-bottom-1-big">
          <p className="product-title">{title}</p>
        </div>
        <div className="product-card-bottom-2-big"> 
          <h3 className="small">${price}</h3>
        </div>
      </div>
      <div className="product-card-popup">
        <h4 className="small">Add to cart</h4>
        <FaShoppingCart className="product-card-cart-icon" />
      </div>
    </div>
  );
};

export default ProductCardSmall;
