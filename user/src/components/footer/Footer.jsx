import React from "react";
import "./Footer.css";
import { CiFacebook } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa6";

const Footer = () => {
  return (
    <>
      <footer className="footer-container">
        <div className="footer-section">
          <div className="footer-column">
            <h3>Exclusive</h3>
            <p>Subscribe</p>
            <p>Get 10% off your first order</p>
            <div className="subscribe-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="subscribe-input"
              />
              <button type="submit" className="subscribe-button">
                ➤
              </button>
            </div>
          </div>

          <div className="footer-column">
            <h3>Support</h3>
            <p>110/89 Vijay path, Mansrovar, Jaipur, Rajasthan, India</p>
            <p>ShopEase@gmail.com</p>
            <p>+01567-222-222</p>
          </div>

          <div className="footer-column">
            <h3>Account</h3>
            <ul>
              <li>
                <a href="/myaccount">My Account</a>
              </li>
              <li>
                <a href="/login">Login</a>
              </li>
              <li>
                <a href="/signup">SignUp</a>
              </li>
              <li>
                <a href="/cart">Cart</a>
              </li>
              <li>
                <a href="/wishlist">Wishlist</a>
              </li>
              <li>
                <a href="/">Shop</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Quick Link</h3>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms Of Use</li>
              <li>FAQ</li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Download App</h3>
            <p>Save $3 with App New User Only</p>
            <div className="app-icons">
              <img
                src="https://w7.pngwing.com/pngs/859/487/png-transparent-google-play-computer-icons-android-google-text-label-logo.png"
                alt="Google Play"
                className="app-store-icon"
              />
              <img
                src="https://w7.pngwing.com/pngs/1015/380/png-transparent-app-store-logo-iphone-app-store-google-play-apple-app-store-electronics-text-logo.png"
                alt="App Store"
                className="app-store-icon"
              />
            </div>
            <div className="social-media">
              <a href="https://www.facebook.com/amazon" target="_blank">
                <CiFacebook />
              </a>
              <a href="https://x.com/amazon" target="_blank">
                <FaXTwitter />
              </a>
              <a href="https://www.instagram.com/amazon/" target="_blank">
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/company/amazon/"
                target="_blank"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© Copyright 2024. All rights reserved</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
