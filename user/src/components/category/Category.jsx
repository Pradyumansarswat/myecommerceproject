import React from "react";
import Slider from "react-slick";

import electronicsImage from "../../assets/category/electronics.png";
import fashionImage from "../../assets/category/fashion.png"; 
import homeAppliancesImage from "../../assets/category/homeappliances.png";
import booksImage from "../../assets/category/book.png";
import toysImage from "../../assets/category/toys.png";
import phonesImage from "../../assets/category/phone.png";
import computersImage from "../../assets/category/computer.png";
import smartWatchImage from "../../assets/category/smart-watch.png";
import cameraImage from "../../assets/category/camera.png";
import headphonesImage from "../../assets/category/headphones.png";
import gamingImage from "../../assets/category/gaming.png";

const Category = () => {
  const categories = [
    { id: 1, name: "Phones", image: phonesImage },
    { id: 2, name: "Computers", image: computersImage },
    { id: 3, name: "SmartWatch", image: smartWatchImage },
    { id: 4, name: "Camera", image: cameraImage },
    { id: 5, name: "HeadPhones", image: headphonesImage },
    { id: 6, name: "Gaming", image: gamingImage },
    { id: 7, name: "Electronics", image: electronicsImage },
    { id: 8, name: "Fashion", image: fashionImage },
    { id: 9, name: "Home Appliances", image: homeAppliancesImage },
    { id: 10, name: "Books", image: booksImage },
    { id: 11, name: "Toys", image: toysImage },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="py-12 bg-gray-50">
      <h2 className="text-center text-3xl font-semibold mb-6">Shop by Category</h2>
      <Slider {...settings} className="max-w-screen-lg mx-auto">
        {categories.map((category) => (
          <div key={category.id} className="px-4 py-6 flex flex-col items-center group">
            
            <div className="relative w-32 h-32 bg-gray-200 rounded-lg overflow-hidden shadow-lg group-hover:bg-blue-200 transition-all duration-300">
              <img
                src={category.image}
                alt={category.name}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              {category.name}
            </h3>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Category;
