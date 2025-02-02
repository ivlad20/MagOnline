import React, { useState, useEffect, useCallback } from "react";
import "./Carousel.css"; // External CSS for styling

const Carousel = ({ images }) => {
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
      <div className={ca ${fade ? "fade" : ""}}>
        <img src={images[currentIndex]} alt={Slide ${currentIndex + 1}} />
      </div>
      <div className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>
        &#10094;
      </div>
      <div className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>
        &#10095;
      </div>
    </div>
  );
};
