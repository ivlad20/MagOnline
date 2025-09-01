import React, { useRef, useEffect, useState } from "react";
import "./TestCarousel.css";

const TestCarousel = () => {
  const ref = useRef();
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Simulăm un fetch
    setTimeout(() => {
      const newItems = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        title: `Item ${i + 1}`,
      }));
      setItems(newItems);
    }, 500);
  }, []);

  const scrollLeft = () => {
    ref.current?.scrollBy({
      left: -ref.current.offsetWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    ref.current?.scrollBy({
      left: ref.current.offsetWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="test-carousel-container">
      <button onClick={scrollLeft}>⬅️</button>
      <div className="test-carousel-track" ref={ref}>
        {items.map((item) => (
          <div className="test-card" key={item.id}>
            {item.title}
          </div>
        ))}
      </div>
      <button onClick={scrollRight}>➡️</button>
    </div>
  );
};

export default TestCarousel;
