import React from "react";
import "./style/About.css";
import FeatureSection from "../components/featuresection/FeatureSection";
import { BsTwitterX } from "react-icons/bs";

const About = () => {
  return (
    <>
      <div className="about-container">
  
        <div className="breadcrumb">
          <span>Home</span> / <span>About</span>
        </div>

      
        <section className="our-story">
          <div className="text">
            <h2>Our Story</h2>
            <p>
              Launched in 2019, ShopEase is South Asia’s premier online
              shopping marketplace with a strong presence in India. Our
              platform connects sellers and buyers from all over the region,
              offering an unparalleled selection of tailored marketing, data,
              and service solutions.
            </p>

            <p>
              Join us on this incredible journey as we revolutionize the way
              people shop and sellers grow their businesses, empowering everyone
              to experience a world of limitless choices at their fingertips.
            </p>
          </div>
          <div className="image">
            <img
              src="https://media.licdn.com/dms/image/D4D12AQHc6er7l4TJww/article-cover_image-shrink_720_1280/0/1672916160679?e=2147483647&v=beta&t=IbXVw-DGMJum7nlYaRvqR43Eq7EoxYQac5FdOPDArnQ"
              alt="Our Story"
            />
          </div>
        </section>

      
        <section className="statistics">
          <div className="stat-item">
            <i className="fas fa-store"></i>
            <h3>10.5k</h3>
            <p>Sellers active on our site</p>
          </div>
          <div className="stat-item highlight">
            <i className="fas fa-money-bill"></i>
            <h3>33k</h3>
            <p>Monthly Product Sale</p>
          </div>
          <div className="stat-item">
            <i className="fas fa-users"></i>
            <h3>45.5k</h3>
            <p>Customer active on our site</p>
          </div>
          <div className="stat-item">
            <i className="fas fa-chart-bar"></i>
            <h3>25k</h3>
            <p>Annual gross sale in our site</p>
          </div>
        </section>

   
        <section className="team ">
          <div className="team-member">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMANk4zCTICONmY1Fg3QUYqcvp0xSfJ8zrRg&s"
              alt="Tom Cruise"
            />
            <h4>Tom Cruise</h4>
            <p>Founder & Chairman</p>
            <div className="social-icons">
              <a href="https://x.com/tomcruise">
                <i>
                  <BsTwitterX className="fab fa-twitter" />
                </i>
              </a>
              <a href="https://www.instagram.com/tomcruise">
            
                <i className="fab fa-instagram"></i>
              </a>
              <i className="fab fa-linkedin"></i>
            </div>
          </div>
          <div className="team-member ">
            <img
              src="https://cdn.britannica.com/29/215029-050-84AA8F39/British-actress-Emma-Watson-2017.jpg"
              alt="Emma Watson"
            />
            <h4>Emma Watson</h4>
            <p>Managing Director</p>
            <div className="social-icons">
              <a href="https://x.com/emmawatson">
                <i>
                  <BsTwitterX className="fab fa-twitter" />
                </i>
              </a>

              <a href="https://www.instagram.com/emmawatson/">
                <i className="fab fa-instagram"></i>
              </a>
              <i className="fab fa-linkedin"></i>
            </div>
          </div>
          <div className="team-member">
            <img
              src="https://www.koimoi.com/wp-content/new-galleries/2023/05/when-robert-downey-jr-revealed-that-he-jrked-off-compulsively-said-rode-it-for-everything-it-was-worth.jpg"
              alt="Robert Downy Jr."
            />
            <h4>Robert Downy Jr.</h4>
            <p>Product Designer</p>
            <div className="social-icons">
              <a href="https://x.com/robertdowneyjr">
                <i>
                  <BsTwitterX className="fab fa-twitter" />
                </i>
              </a>
              <a href="https://www.instagram.com/robertdowneyjr/">
                <i className="fab fa-instagram"></i>
              </a>
              <i className="fab fa-linkedin"></i>
            </div>
          </div>
        </section>
      </div>

      <FeatureSection />
    </>
  );
};

export default About;
