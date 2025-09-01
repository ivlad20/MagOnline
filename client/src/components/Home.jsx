import React, { useEffect, useState } from "react";
import Carousel from "./Carousel";
import ProductCarousel from "./ProductCarousel";
import "./Home.css";
import CategoryBox from "./CategoryBox"

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const images = [
    "/images/laptop.png",
    "/images/controller.png",
    "/images/phone.png",
  ];
  const promoText = [
    "Personal computers up to -10% off",
    "Joysticks up to -20% off",
    "Smartphones up to -15% off",
  ];

  useEffect(() => {
    fetch("http://localhost:8080/products/random/20")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => ({
          image: item.mainImage || (item.images.length > 0 ? item.images[0] : "https://via.placeholder.com/300"),
          title: item.description || "Untitled",
          category: item.category,
          price: item.price,
          rating: 4.0, // Add real rating if you store it
        }));
        setProducts(formatted);
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/products/random/3")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => ({
          image: item.mainImage || (item.images.length > 0 ? item.images[0] : "https://via.placeholder.com/300"),
          category: item.category
        }));
        setCategories(formatted);
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  return (
    <div className="home-container">
      <Carousel images={images} promoText={promoText} />
      <div className="home-categories-heading-container">
        <h1>Popular Categories</h1>
      </div>
      <div className="home-categories">
          {categories.map((category, index) => (
          <CategoryBox key={index} {...category} />
        ))}
      </div>
      <div className="home-weekly-offers-heading-container">
        <h1 className="">Weekly Offers</h1>
      </div>
      <div className="home-products-container">
        <ProductCarousel products={products} />
      </div>
      
    </div>
  );
};

export default Home;
