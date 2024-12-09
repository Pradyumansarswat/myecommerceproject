import React, { useState} from "react";
import "./MainBanner.css";
import bannerImage1 from '../../assets/iphone.jpg';
import bannerImage2 from '../../assets/handicraft.jpg';
import bannerImage3 from '../../assets/mens.jpg';
import bannerImage4 from '../../assets/women.jpg';
import bannerImage5 from '../../assets/kid.jpg';


const MainBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    {
      src: bannerImage4,
      alt: "Women's wear Banner",
      title: "Women's wear",
      discount: "Up to 40% off Voucher",
    },
    {
      src: bannerImage5,
      alt: "Kid's Banner",
      title: "Kid's wear",
      discount: "Up to 50% off Voucher",
    },
    {
      src: bannerImage1,
      alt: "iPhone 14 Series Banner",
      title: "iPhone 14 Series",
      discount: "Up to 10% off Voucher",
    },
    {
      src: bannerImage2,
      alt: "HandiCrafts Banner",
      title: "HandiCrafts items",
      discount: "Up to 20% off Voucher",
    },
    {
      src: bannerImage3,
      alt: "Men's wear Banner",
      title: "Mens wear",
      discount: "Up to 30% off Voucher",
    },
   
    
  ];

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <div className="banner-carousel">
        <div className="banner-slide">
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="banner-image"
          

          />
          <div className="banner-content">
            <h2>{images[currentIndex].title}</h2>
            <p>{images[currentIndex].discount}</p>
            <button className="shop-button">Shop Now</button>
          </div>
        </div>

        <div className="carousel-controls">
          <button onClick={handlePrevClick} className="prev-button">
            &#60;
          </button>
          <div className="dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={`dot ${currentIndex === index ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
              ></span>
            ))}
          </div>
          <button onClick={handleNextClick} className="next-button">
            &#62;
          </button>
        </div>
      </div>
    </>
  );
};

export default MainBanner;
