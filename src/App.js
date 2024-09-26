import "./App.css";
import React from "react";
import SearchBar from "./SearchBar";
import Dropdown from "./Dropdown";
import Carousel from "./Carousel";
import CategoryBox from "./CategoryBox";
import ProductCard from "./ProductCard";

function App() {
  const images = [
    "https://clipground.com/images/joystick-png-2.png",
    "https://clipground.com/images/joystick-png-2.png",
    "https://via.placeholder.com/800x400?text=Image+3",
  ];

  return (
    <div>
      <nav className="navbar1">
        <div className="logo">
          <img src="images/logo.png" alt="logo" className="logo-img" />
        </div>
        <div className="searchBar">
          <Dropdown />
          <SearchBar />
        </div>
        <div className="nav-icons">
          <div className="icon-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="user-icon"
              width="25"
              height="25"
            >
              <path d="M15.996094 1.0039062C11.589664 1.0039062 8.0019573 4.5916469 8.0019531 8.9980469C8.0019557 11.774941 9.4291681 14.22817 11.585938 15.664062C5.4606227 17.55205 0.99608756 23.262484 0.99609375 30A1.0001 1.0001 0 0 0 2 31.003906L30 31.003906A1.0001 1.0001 0 0 0 30.996094 30C30.9961 23.263163 26.534518 17.552631 20.410156 15.664062C22.569029 14.228159 23.998044 11.774891 23.998047 8.9980469C23.998043 4.5916469 20.402524 1.0039062 15.996094 1.0039062zM15.996094 2.9960938C19.321645 2.9960938 21.998044 5.6725162 21.998047 8.9980469C21.998044 12.323615 19.321645 15 15.996094 15C12.670543 15 10.001956 12.323615 10.001953 8.9980469C10.001956 5.6725162 12.670543 2.9960938 15.996094 2.9960938zM15.996094 17C22.834013 17 28.271717 22.305487 28.804688 29.003906L3.1972656 29.003906C3.7302358 22.305487 9.1581737 17 15.996094 17z" />
            </svg>
          </div>

          <div className="icon-wrapper">
            <svg
              viewBox="0 0 24 24"
              className="fav-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
            >
              <path
                d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="icon-wrapper">
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              className="cart-icon"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1 1C0.447715 1 0 1.44772 0 2C0 2.55228 0.447715 3 1 3H3.20647L5.98522 14.9089C6.39883 16.6816 7.95486 17.9464 9.76471 17.9983V18H17.5874C19.5362 18 21.2014 16.5956 21.5301 14.6747L22.7857 7.33734C22.9947 6.11571 22.0537 5 20.8143 5H5.72686L4.97384 1.77277C4.86824 1.32018 4.46475 1 4 1H1ZM6.19353 7L7.9329 14.4545C8.14411 15.3596 8.95109 16 9.88058 16H17.5874C18.5618 16 19.3944 15.2978 19.5588 14.3373L20.8143 7H6.19353Z"
                fill="#000000"
              />
              <path
                d="M8 23C9.10457 23 10 22.1046 10 21C10 19.8954 9.10457 19 8 19C6.89543 19 6 19.8954 6 21C6 22.1046 6.89543 23 8 23Z"
                fill="#000000"
              />
              <path
                d="M19 23C20.1046 23 21 22.1046 21 21C21 19.8954 20.1046 19 19 19C17.8954 19 17 19.8954 17 21C17 22.1046 17.8954 23 19 23Z"
                fill="#000000"
              />
            </svg>
          </div>
        </div>
      </nav>

      <nav className="navbar2">
        <div className="navbar2-links">
          <div className="nav-link">
            <b>Home</b>
          </div>
          <div className="nav-link">
            <b>Pages</b>
          </div>
          <div className="nav-link">
            <b>Shop</b>
          </div>
          <div className="nav-link">
            <b>Offers</b>
          </div>
        </div>
      </nav>

      <Carousel images={images} />

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
        </div>
        <Carousel images={images} />
      </div>
    </div>
  );
}

export default App;
