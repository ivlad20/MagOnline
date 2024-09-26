import React, { useState, useEffect, useCallback } from "react";
import "./Carousel.css"; // External CSS for styling

const Carousel = ({ promoText, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const nextSlide = useCallback(() => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setFade(false);
    }, 500); // Fade transition duration
  }, [images.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Image switch interval

    return () => clearInterval(interval);
  }, [nextSlide]);

  const prevSlide = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length
      );
      setFade(false);
    }, 500);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-middle">
        <div className="carousel-middle-left">
          <div className="promo-container">
            <p className={`promo-text ${fade ? "fade" : ""}`}>Computers up to -15% off</p>
            <button className="shop-now-promo-button">Shop now</button>
          </div>
          
        </div>
        <div className={`carousel-middle-right ${fade ? "fade" : ""}`}>
          <img src={images[currentIndex]} alt="" className="promo-image"/>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
