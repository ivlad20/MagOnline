import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating, className }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className={className} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <div style={{ display: "flex", color: "#ffc107", fontSize: "18px" }}>
        {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} />)}
        {hasHalfStar && <FaStarHalfAlt key="half" />}
        {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} />)}
      </div>
      <span style={{ fontSize: "14px", color: "#333" }}>{rating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;