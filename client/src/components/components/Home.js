import React from "react";
import Carousel from "./Carousel";
import CategoryBox from "./CategoryBox";
import ProductCard from "./ProductCard";
import ProductCardBig from "./ProductCardBig";
import ProductCardSmall from "./ProductCardSmall";
import "./Home.css";

const Home = () => {
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

  return (
    <div>
      <Carousel images={images} promoText={promoText} />
      <br />
      <ProductCard image={"./images/controller.png"} title={"Xbox controller"} category={"ACCESSORIES"} price={"300"}/>
      <div className="home-products-container">

      </div>
    </div>
  );
};

export default Home; // Export the Home component