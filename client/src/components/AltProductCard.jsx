import "./AltProductCard.css";
import { FaHeart } from "react-icons/fa";
import StarRating from "./StarRating";
import { FaShoppingCart } from "react-icons/fa";

const AltProductCard = ({ image, title, category, price, rating }) => {
  return (
    <div className="product-card-main-body">
      <div className="product-card-alt-top">
        <div className="product-card-alt-top-a">
          <h6>{category}</h6>
        </div>
        <div className="product-card-alt-top-b">
          <FaHeart className="heart-svg" />
        </div>
      </div>

      <div className="product-card-alt-image-container">
        <img src={image} alt={title} className="product-card-alt-img" />
      </div>

      <div className="product-card-alt-price-title">
        <div className="product-card-alt-title-rating-row">
          <p className="product-card-alt-title">{title}</p>
          <StarRating rating={rating} />
        </div>
        <p className="product-card-alt-price">{price}$</p>
      </div>

      <div className="product-card-alt-sliding-bottom">
        <h4 className="add-to-cart-text">Add to cart</h4>
        <FaShoppingCart className="product-card-cart-icon" />
      </div>
    </div>
  );
};

export default AltProductCard;
