import React from "react";
import "./ProductCard.css"; // Importing CSS file for styles
import { FaHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";

const ProductCard = ({image, title, category, price}) => {
  return (
    <div className="product-card">
      <div className="product-card-top">
        <div className="product-card-top-1">
          <p>{category}</p>
        </div>
        <div className="product-card-top-2">
          <FaHeart className="heart-svg" />
        </div>
      </div>
      <div className="product-card-image">
        <img
          src={image}
          alt="product"
          className="product-image"
        />
      </div>
      <div className="product-card-bottom">
        <div className="product-card-bottom-1">
          <p className="product-title">{title}</p>
        </div>
        <div className="product-card-bottom-2"> 
          <h3>${price}</h3>
        </div>
      </div>
      <div className="product-card-popup">
        <h4>Add to cart</h4>
        <FaShoppingCart className="product-card-cart-icon" />
      </div>
    </div>
  );
};

export default ProductCard;
