import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="newsletter-container-signup">
        <div className="newsletter-container-signup-1">
          <span className="newsletter-signup-text">
            <b>Sign up to our newsletter: </b>
          </span>
        </div>
        <div className="newsletter-container-signup-2">
          <input
            type="text"
            placeholder="   Your Email Address:"
            className="newsletter-email-input"
          />
        </div>
        <div className="newsletter-container-signup-3">
          <div className="newsletter-container-signup-3a">
            <b className="follow-text">Follow us on:</b>
          </div>
          <div className="newsletter-container-signup-3b">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="50"
              height="50"
              viewBox="0,0,256,256"
              className="yt-icon"
              style={{ mixBlendMode: "normal", cursor: "pointer" }} // Optional: cursor effect
            >
              <g
                fillOpacity="0.6"
                fill="#000000"
                fillRule="nonzero"
                stroke="none"
                strokeWidth="1"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                strokeMiterlimit="10"
                strokeDasharray=""
                strokeDashoffset="0"
                fontFamily="none"
                fontWeight="none"
                fontSize="none"
                textAnchor="none"
              >
                <g transform="scale(5.12,5.12)">
                  <path
                    d="M44.89844,14.5c-0.39844,-2.19922 -2.29687,-3.80078 -4.5,-4.30078c-3.29687,-0.69922 -9.39844,-1.19922 -16,-1.19922c-6.59766,0 -12.79687,0.5 -16.09766,1.19922c-2.19922,0.5 -4.10156,2 -4.5,4.30078c-0.40234,2.5 -0.80078,6 -0.80078,10.5c0,4.5 0.39844,8 0.89844,10.5c0.40234,2.19922 2.30078,3.80078 4.5,4.30078c3.5,0.69922 9.5,1.19922 16.10156,1.19922c6.60156,0 12.60156,-0.5 16.10156,-1.19922c2.19922,-0.5 4.09766,-2 4.5,-4.30078c0.39844,-2.5 0.89844,-6.10156 1,-10.5c-0.20312,-4.5 -0.70312,-8 -1.20312,-10.5zM19,32v-14l12.19922,7z"
                    fill="#000000"
                    className="yt-path"
                  ></path>
                </g>
              </g>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="50"
              height="50"
              viewBox="0 0 30 30"
              className="x-icon"
              style={{ mixBlendMode: "normal", cursor: "pointer" }}
            >
              <path
                d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"
                fill="#000000"
                className="x-path"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      <div className="separation-bar-1"></div>
      <div className="footer-container-quick-links">
        <div className="footer-container-quick-links-1">
          <ul className="links-list">
            <li>
              <b className="quick-link-title">Privacy Policy</b>
            </li>
            <br />
            <li>Returns & Exhanges</li>
            <li>Payment Terms</li>
            <li>Delivery Terms</li>
            <li>Payment & Pricing</li>
            <li>Terms Of Use</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-container-quick-links-2">
          <ul className="links-list">
            <li>
              <b className="quick-link-title">Get Involved</b>
            </li>
            <br />
            <li>About Us</li>
            <li>Our Vision</li>
            <li>Orders & Shipping</li>
            <li>Office Supplies</li>
            <li>Contact Us</li>
            <li>Customer Service</li>
          </ul>
        </div>
        <div className="footer-container-quick-links-3">
          <ul className="links-list">
            <li>
              <b className="quick-link-title">Quick Links</b>
            </li>
            <br />
            <li>Smartphones</li>
            <li>Headphones</li>
            <li>Laptop & Tablet</li>
            <li>Monitors</li>
            <li>Printers</li>
            <li>Gadgets</li>
          </ul>
        </div>
        <div className="footer-container-quick-links-4">
          <ul className="links-list">
            <li>
              <b className="quick-link-title">Customer Care</b>
            </li>
            <br />
            <li>My Account</li>
            <li>Store Locator</li>
            <li>Customer Service</li>
            <li>Returns/Exhange</li>
            <li>Product Support</li>
            <li>FAQs</li>
          </ul>
        </div>
      </div>
      <div className="separation-bar-2"></div>
      <div className="footer-container-contact">
        <div className="footer-container-contact-1">
          <img src="images/logo.png" alt="logo" className="logo-img" />
        </div>
        <div className="footer-container-contact-2">
          <div className="footer-container-contact-2a">
            <svg
              fill="#ffffff"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 569.859 569.858"
            >
              <g>
                <path
                  d="M155.716,569.858h258.426c21.221,0,38.432-17.203,38.432-38.441V38.441C452.574,17.212,435.371,0,414.142,0H155.716
		c-21.238,0-38.432,17.212-38.432,38.441v492.976C117.285,552.655,134.478,569.858,155.716,569.858z M284.294,546.392
		c-13.378,0-24.203-10.815-24.203-24.184c0-13.359,10.825-24.184,24.203-24.184c13.331,0,24.184,10.824,24.184,24.184
		C308.478,535.576,297.625,546.392,284.294,546.392z M169.151,74.004c0-5.843,4.733-10.576,10.586-10.576h210.375
		c5.852,0,10.586,4.733,10.586,10.576v379.517c0,5.843-4.734,10.586-10.586,10.586H179.737c-5.853,0-10.586-4.743-10.586-10.586
		V74.004L169.151,74.004z"
                />
                <path
                  d="M284.925,269.939c28.448,0,51.512-23.074,51.512-51.494c0-28.468-23.064-51.542-51.512-51.542
		c-28.468,0-51.504,23.084-51.504,51.542C233.421,246.856,256.467,269.939,284.925,269.939z"
                />
                <path
                  d="M281.1,350.36c39.435,0,60.587-7.21,70.783-12.488c4.828-2.496,8.309-9.754,7.945-15.071
		c-0.889-12.804-4.752-36.127-20.32-55.998c-2.352-3.002-6.646-6.292-10.805-8.54c-10.768,12.059-26.375,19.699-43.778,19.699
		c-17.385,0-32.991-7.631-43.749-19.679c-4.064,2.314-8.243,5.594-10.519,8.577c-7.392,9.649-18.791,28.344-20.617,53.521
		c-0.383,5.308,2.151,13.426,6.588,16.533C225.054,342.815,243.242,350.36,281.1,350.36z"
                />
              </g>
            </svg>
          </div>
          <div className="footer-container-contact-2b">
            <b>+0080 1234 56 789</b>
          </div>
        </div>
        <div className="footer-container-contact-3">
          <div className="footer-container-contact-3a">
            <svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3 3C1.34315 3 0 4.34315 0 6V15C0 16.3121 0.842366 17.4275 2.01581 17.8348C2.18436 19.6108 3.67994 21 5.5 21C7.26324 21 8.72194 19.6961 8.96456 18H15.0354C15.2781 19.6961 16.7368 21 18.5 21C20.3201 21 21.8156 19.6108 21.9842 17.8348C23.1576 17.4275 24 16.3121 24 15V10.7515C24 10.0248 23.7362 9.32283 23.2577 8.77596L20.8502 6.02449C20.2805 5.37344 19.4576 5 18.5925 5H16.8293C16.4175 3.83481 15.3062 3 14 3H3ZM4 17.4361V17.5639C4.03348 18.3634 4.69224 19.0013 5.5 19.0013C6.30776 19.0013 6.96652 18.3634 7 17.5639V17.4361C6.96652 16.6366 6.30776 15.9987 5.5 15.9987C4.69224 15.9987 4.03348 16.6366 4 17.4361ZM5.5 14C6.8962 14 8.10145 14.8175 8.66318 16H15.3368C15.8985 14.8175 17.1038 14 18.5 14C19.8245 14 20.9771 14.7357 21.5716 15.8207C21.8306 15.64 22 15.3398 22 15V11H17C15.8954 11 15 10.1046 15 9V6C15 5.44772 14.5523 5 14 5H3C2.44772 5 2 5.44772 2 6V15C2 15.3398 2.16945 15.64 2.42845 15.8207C3.02292 14.7357 4.17555 14 5.5 14ZM17 7V8C17 8.55229 17.4477 9 18 9H20.7962L19.345 7.34149C19.1552 7.12448 18.8808 7 18.5925 7H17ZM17 17.4361V17.5639C17.0335 18.3634 17.6922 19.0013 18.5 19.0013C19.3078 19.0013 19.9665 18.3634 20 17.5639V17.4361C19.9665 16.6366 19.3078 15.9987 18.5 15.9987C17.6922 15.9987 17.0335 16.6366 17 17.4361Z"
                fill="#ffffff"
              />
            </svg>
          </div>
          <div className="footer-container-contact-3b">
            <b>Free shipping for orders above 100$</b>
          </div>
        </div>
        <div className="footer-container-contact-4">
          <div className="footer-container-contact-4a">
            <svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.0498 7.0498H7.0598M10.5118 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V10.5118C3 11.2455 3 11.6124 3.08289 11.9577C3.15638 12.2638 3.27759 12.5564 3.44208 12.8249C3.6276 13.1276 3.88703 13.387 4.40589 13.9059L9.10589 18.6059C10.2939 19.7939 10.888 20.388 11.5729 20.6105C12.1755 20.8063 12.8245 20.8063 13.4271 20.6105C14.112 20.388 14.7061 19.7939 15.8941 18.6059L18.6059 15.8941C19.7939 14.7061 20.388 14.112 20.6105 13.4271C20.8063 12.8245 20.8063 12.1755 20.6105 11.5729C20.388 10.888 19.7939 10.2939 18.6059 9.10589L13.9059 4.40589C13.387 3.88703 13.1276 3.6276 12.8249 3.44208C12.5564 3.27759 12.2638 3.15638 11.9577 3.08289C11.6124 3 11.2455 3 10.5118 3ZM7.5498 7.0498C7.5498 7.32595 7.32595 7.5498 7.0498 7.5498C6.77366 7.5498 6.5498 7.32595 6.5498 7.0498C6.5498 6.77366 6.77366 6.5498 7.0498 6.5498C7.32595 6.5498 7.5498 6.77366 7.5498 7.0498Z"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div className="footer-container-contact-4b">
            <b>Save up to 20%</b>
          </div>
        </div>
      </div>
      <div className="separation-bar-3"></div>
      <div className="footer-anpc-container">
        
      </div>
    </div>
  );
};

export default Footer;
