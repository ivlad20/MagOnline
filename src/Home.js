import React from "react";
import Carousel from "./Carousel";
import CategoryBox from "./CategoryBox";
import ProductCard from "./ProductCard";
import ProductCardBig from "./ProductCardBig";
import ProductCardSmall from "./ProductCardSmall";

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
      <div className="categories">
        <div className="categories-centerBox">
          <CategoryBox
            category={"Joystick"}
            image={"https://clipground.com/images/joystick-png-2.png"}
          />
          <CategoryBox
            category={"Joystick"}
            image={"https://clipground.com/images/joystick-png-2.png"}
          />
          <CategoryBox
            category={"Joystick"}
            image={"https://clipground.com/images/joystick-png-2.png"}
          />
        </div>
      </div>
      <div className="featured-products-display-homepage">
        <div className="featured-products-text">
          <h1>Featured Products</h1>
        </div>
        <div className="product-cards-container">
          <ProductCard
            image={"https://clipground.com/images/joystick-png-2.png"}
            title={"Joystick Xbox One"}
            category={"GADGETS"}
            price={"300"}
          />
          <ProductCard
            image={"https://clipground.com/images/joystick-png-2.png"}
            title={"Joystick Xbox One"}
            category={"GADGETS"}
            price={"300"}
          />
          <ProductCard
            image={"https://clipground.com/images/joystick-png-2.png"}
            title={"Joystick Xbox One"}
            category={"GADGETS"}
            price={"300"}
          />
          <ProductCard
            image={
              "https://s13emagst.akamaized.net/products/65144/65143527/images/res_1c5b507ce98a513b002787d3b5b00482.jpg"
            }
            title={"Telefon mobil Xiaomi Redmi Note 13 Pro"}
            category={"GADGETS"}
            price={"300"}
          />
          <ProductCard
            image={"https://clipground.com/images/joystick-png-2.png"}
            title={"Joystick Xbox One"}
            category={"GADGETS"}
            price={"300"}
          />
          <ProductCard
            image={"https://clipground.com/images/joystick-png-2.png"}
            title={"Joystick Xbox One"}
            category={"GADGETS"}
            price={"300"}
          />
          <ProductCard
            image={"https://clipground.com/images/joystick-png-2.png"}
            title={"Joystick Xbox One"}
            category={"GADGETS"}
            price={"300"}
          />
          <ProductCard
            image={
              "https://s13emagst.akamaized.net/products/52576/52575496/images/res_0ba52a03add5122a59a59a708c86398a.jpg"
            }
            title={"Samsung S23 Ultra"}
            category={"GADGETS"}
            price={"300"}
          />
        </div>
      </div>
      <Carousel images={images} promoText={promoText} />
      <div className="product-cards-container-2">
        <div className="product-cards-sub-container-2">
          <ProductCardBig
            image={
              "https://s13emagst.akamaized.net/products/52576/52575496/images/res_0ba52a03add5122a59a59a708c86398a.jpg"
            }
            title={"Samsung S23 Ultra"}
            category={"GADGETS"}
            price={"300"}
          />
          <ProductCardSmall
            image={
              "https://s13emagst.akamaized.net/products/52576/52575496/images/res_0ba52a03add5122a59a59a708c86398a.jpg"
            }
            title={"Samsung S23 Ultra"}
            category={"GADGETS"}
            price={"300"}
          />
        </div>
      </div>
    </div>
  );
};

export default Home; // Export the Home component