import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";

const FlashSales = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56,
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products/status/active"
        );
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          const randomProducts = data.products
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);
          setProducts(randomProducts);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const updateCountdown = () => {
    setTimeLeft((prevTimeLeft) => {
      const { seconds, minutes, hours, days } = prevTimeLeft;

      if (seconds > 0) {
        return { ...prevTimeLeft, seconds: seconds - 1 };
      } else if (minutes > 0) {
        return { ...prevTimeLeft, seconds: 59, minutes: minutes - 1 };
      } else if (hours > 0) {
        return { ...prevTimeLeft, seconds: 59, minutes: 59, hours: hours - 1 };
      } else if (days > 0) {
        return {
          ...prevTimeLeft,
          seconds: 59,
          minutes: 59,
          hours: 23,
          days: days - 1,
        };
      }
      return prevTimeLeft;
    });
  };

  const handleProductClick = (id) => {
    navigate(`/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="px-6 py-8 bg-gray-100">
      <div className="text-center mb-8">
        <h3 className="text-xl text-red-600 font-semibold">Today's</h3>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Flash Sales</h1>
        <div className="flex justify-center gap-6 text-white">
          <div className="flex flex-col items-center bg-gradient-to-r from-red-400 to-red-600 p-3 rounded-xl shadow-lg">
            <span className="text-3xl font-bold">{timeLeft.days}</span>
            <span className="text-sm">Days</span>
          </div>
          <div className="flex flex-col items-center bg-gradient-to-r from-orange-400 to-yellow-600 p-3 rounded-xl shadow-lg">
            <span className="text-3xl font-bold">{timeLeft.hours}</span>
            <span className="text-sm">Hours</span>
          </div>
          <div className="flex flex-col items-center bg-gradient-to-r from-green-400 to-teal-600 p-3 rounded-xl shadow-lg">
            <span className="text-3xl font-bold">{timeLeft.minutes}</span>
            <span className="text-sm">Minutes</span>
          </div>
          <div className="flex flex-col items-center bg-gradient-to-r from-blue-400 to-indigo-600 p-3 rounded-xl shadow-lg">
            <span className="text-3xl font-bold">{timeLeft.seconds}</span>
            <span className="text-sm">Seconds</span>
          </div>
        </div>
      </div>

      <Slider {...sliderSettings}>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            name={product.name}
            price={product.price}
            sellPrice={product.sellPrice}
            stock={product.stock}
            imageUrl={`http://localhost:5000/${product.images?.[0]}`}
            description={product.description || "No description available."}
            rating={product.rating || 0}
            onClick={() => handleProductClick(product._id)}
          />
        ))}
      </Slider>

      <div className="flex justify-center mt-8">
        <button
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          onClick={() => navigate("/all-products")}
        >
          View All Products
        </button>
      </div>
    </div>
  );
};

const ProductCard = ({
  name,
  price,
  sellPrice,
  stock,
  imageUrl,
  description,
  // rating,
  onClick,
}) => {
  return (
    <div
      className="bg-white shadow-lg rounded-lg overflow-hidden p-4 transform transition duration-300 hover:scale-105 hover:shadow-xl"
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h4 className="text-xl font-semibold text-gray-800 mb-2">{name}</h4>

      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold text-red-600">${sellPrice}</span>
        <span className="text-sm text-gray-500 line-through">${price}</span>
      </div>

      <p className="text-sm text-gray-600 mb-3">{description}</p>

      <div className="flex items-center justify-between">
        {/* <div className="flex gap-2">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill={index < rating ? "gold" : "gray"}
              className="bi bi-star-fill"
              viewBox="0 0 16 16"
            >
              <path d="M3.612 15.443c-.437.368-.893-.25-.832-.633L4.617 9.72 1.174 6.61c-.36-.331-.172-.887.313-.94l5.338-.52L7.438.793c.177-.356.593-.356.77 0l2.566 4.856 5.338.52c.485.053.674.609.313.94l-3.443 3.11 1.837 5.09c.061.384-.395.748-.832.633l-5.016-3.264L7.438 12.43l-5.016 3.264z" />
            </svg>
          ))}
        </div> */}

        <span
          className={`text-sm font-semibold ${
            stock > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {stock > 0 ? `${stock} in stock` : "Out of stock"}
        </span>
      </div>
    </div>
  );
};

export default FlashSales;
