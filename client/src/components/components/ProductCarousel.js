import React, { useRef } from "react";
import AltProductCard from "./AltProductCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./ProductCarousel.css";

const ProductCarousel = ({ products }) => {
  const carouselRef = useRef();

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -carouselRef.current.offsetWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: carouselRef.current.offsetWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="carousel-container-products">
      <button className="carousel-arrow-product left" onClick={scrollLeft}>
        <FaArrowLeft />
      </button>

      <div className="carousel-track" ref={carouselRef}>
        {products.map((product, index) => (
          <AltProductCard key={index} {...product} />
        ))}
      </div>

      <button className="carousel-arrow-product right" onClick={scrollRight}>
        <FaArrowRight />
      </button>
    </div>
  );
};

export default ProductCarousel;
