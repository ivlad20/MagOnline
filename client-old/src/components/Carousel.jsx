import React, { useState, useEffect, useCallback, useRef } from "react";
import "./Carousel.css";

const Carousel = ({ promoText, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const intervalRef = useRef(null); // Ref to hold the interval ID

  const clearAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const startAutoSlide = useCallback(() => {
    clearAutoSlide();
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 3000);
  }, []); // will be refreshed on mount and reset

  const nextSlide = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setFadeOut(false);
    }, 500);
  }, [images.length]);

  const prevSlide = () => {
    setFadeOut(true);
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length
      );
      setFadeOut(false);
    }, 500);
  };

  // On mount: start the auto-slide
  useEffect(() => {
    startAutoSlide();
    return () => clearAutoSlide(); // Cleanup
  }, [startAutoSlide]);

  // Handlers that reset the timer after manual change
  const handleNextClick = () => {
    clearAutoSlide();
    nextSlide();
    startAutoSlide();
  };

  const handlePrevClick = () => {
    clearAutoSlide();
    prevSlide();
    startAutoSlide();
  };

  return (
    <div className="carousel-container">
      <div
        className="carousel-arrow carousel-arrow-left"
        onClick={handlePrevClick}
      >
        ‹
      </div>
      <div
        className="carousel-arrow carousel-arrow-right"
        onClick={handleNextClick}
      >
        ›
      </div>

      <div className="carousel-middle">
        <div className="carousel-middle-left">
          <div className="promo-container">
            <p className={`promo-text ${fadeOut ? "fade-out" : ""}`}>
              {promoText[currentIndex]}
            </p>
          </div>
        </div>
        <div className="carousel-middle-right">
          <img
            src={images[currentIndex]}
            alt=""
            className={`promo-image ${fadeOut ? "fade-out" : ""}`}
          />
        </div>
      </div>
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <div
            key={index}
            className={`indicator-dot ${
              index === currentIndex ? "active" : ""
            }`}
            onClick={() => {
              setFadeOut(true);
              clearAutoSlide();
              setTimeout(() => {
                setCurrentIndex(index);
                setFadeOut(false);
                startAutoSlide();
              }, 500);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
