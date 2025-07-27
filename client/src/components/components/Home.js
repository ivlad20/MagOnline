import React from "react";
import Carousel from "./Carousel";
import CategoryBox from "./CategoryBox";
import ProductCard from "./ProductCard";
import ProductCardBig from "./ProductCardBig";
import ProductCardSmall from "./ProductCardSmall";
import AltProductCard from "./AltProductCard";
import "./Home.css";
import ProductCarousel from "./ProductCarousel";

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

  const sampleProducts = [
  {
    image: "./images/controller.png",
    title: "Wireless Headphones",
    category: "Electronics",
    price: 59.99,
    rating: 4.2,
  },
  {
    image: "https://via.placeholder.com/300?text=Product+2",
    title: "Fitness Tracker",
    category: "Wearables",
    price: 39.95,
    rating: 4.0,
  },
  {
    image: "https://via.placeholder.com/300?text=Product+3",
    title: "Bluetooth Speaker",
    category: "Audio",
    price: 24.99,
    rating: 3.9,
  },
  {
    image: "https://via.placeholder.com/300?text=Product+4",
    title: "Smart Watch",
    category: "Wearables",
    price: 89.99,
    rating: 4.6,
  },
  {
    image: "https://via.placeholder.com/300?text=Product+5",
    title: "Gaming Mouse",
    category: "Peripherals",
    price: 29.99,
    rating: 4.3,
  },
  {
    image: "https://via.placeholder.com/300?text=Product+6",
    title: "Mechanical Keyboard",
    category: "Peripherals",
    price: 74.99,
    rating: 4.8,
  },
  {
    image: "https://via.placeholder.com/300?text=Product+7",
    title: "LED Monitor",
    category: "Displays",
    price: 199.99,
    rating: 4.1,
  },
  {
    image: "https://via.placeholder.com/300?text=Product+8",
    title: "External SSD",
    category: "Storage",
    price: 99.99,
    rating: 4.7,
  },
  {
    image: "https://via.placeholder.com/300?text=Product+9",
    title: "Drone with Camera",
    category: "Gadgets",
    price: 149.99,
    rating: 3.8,
  },
  {
    image: "https://via.placeholder.com/300?text=Product+10",
    title: "VR Headset",
    category: "Gaming",
    price: 299.99,
    rating: 4.4,
  },
];


  return (
    <div className="home-container">
      <Carousel images={images} promoText={promoText} />
      <br />

      <div className="home-products-container">
        {/* <AltProductCard
          rating={3}
          image={"./images/controller.png"}
          title={"Xbox controller"}
          category={"ACCESSORIES"}
          price={"300"}
        /> */}
        <ProductCarousel products={sampleProducts} />
        {/* <CategoryBox 
        category={"Laptops"}
        image={""}/> */}
      </div>
    </div>
  );
};

export default Home; // Export the Home component
