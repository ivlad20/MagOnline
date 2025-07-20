import React from "react";
import "./ProductCardBig.css"; // Importing CSS file for styles
import { FaHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";

const ProductCardBig = ({image, title, category, price}) => {
  return (
    <div className="product-card-big">
      <div className="product-card-top-big">
        <div className="product-card-top-1">
          <p>{category}</p>
        </div>
        <div className="product-card-top-2">
          <FaHeart className="heart-svg" />
        </div>
      </div>
      <div className="product-card-image-big">
        <img
          src={image}
          alt="product"
          className="product-image-big"
        />
      </div>
      <div className="product-card-bottom-big">
        <div className="product-card-bottom-1-big">
          <p className="product-title">{title}</p>
        </div>
        <div className="product-card-bottom-2-big"> 
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

export default ProductCardBig;
