import React, { useRef, useState, useEffect } from "react";
import AltProductCard from "./AltProductCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./ProductCarousel.css";

const ProductCarousel = ({ products }) => {
  const carouselRef = useRef();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = carouselRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -carouselRef.current.offsetWidth, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: carouselRef.current.offsetWidth, behavior: "smooth" });
  };

  useEffect(() => {
    updateScrollButtons();
    const el = carouselRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  return (
    <div className="carousel-container-products">
      {canScrollLeft && (
        <button className="carousel-arrow-product left" onClick={scrollLeft}>
          <FaArrowLeft />
        </button>
      )}

      <div className="carousel-track" ref={carouselRef}>
        {products.map((product, index) => (
          <AltProductCard key={index} {...product} />
        ))}
      </div>

      {canScrollRight && (
        <button className="carousel-arrow-product right" onClick={scrollRight}>
          <FaArrowRight />
        </button>
      )}
    </div>
  );
};

export default ProductCarousel;
