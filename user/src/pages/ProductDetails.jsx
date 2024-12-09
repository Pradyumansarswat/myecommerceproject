import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style/ProductDetails.css";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { fetchWishlistItems, fetchCartItems } from "../store/userSlice";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartIds, setcartIds] = useState([]);
  const [wishlistIds, setwishlistIds] = useState([]);
  const [inCart, setInCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken?.userId;
  const dataGet = async () => {
    try {
      const item = await dispatch(fetchWishlistItems());
      // console.log("item is in wishlist", item.payload);
    } catch (error) {
      console.log(error);
    }
  };
  const datacart = async () => {
    try {
      const item = await dispatch(fetchCartItems());
      // console.log("item is in cart", item.payload);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        const data = response.data;
        setProduct(data.product || {});
        setMainImage(`http://localhost:5000/${data.product?.images?.[0]}`);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const checkCartStatus = async () => {
      if (!userId) return;

      try {
        const cartResponse = await axios.get(
          `http://localhost:5000/api/cart/${userId}`
        );
        const cartProducts = cartResponse.data.products;
        setcartIds(cartProducts);
        // console.log(cartProducts);
        const cartProductIds = cartProducts.map((item) => item.product._id);
        // console.log(cartProductIds)
        const isInCart = cartProductIds.includes(id);
        setInCart(isInCart);
        // console.log(isInCart)
      } catch (error) {
        console.error("Failed to check cart status:", error);
      }
    };

    checkCartStatus();
  }, [id, userId]);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!userId) return;

      try {
        const wishlistResponse = await axios.get(
          `http://localhost:5000/api/wishlist/${userId}`
        );
        const wishlistProducts = wishlistResponse.data.products;
        // console.log(wishlistProducts)
        // console.log(wishlistResponse.data.products)
        setwishlistIds(wishlistProducts);

        const wishlistProductIds = wishlistProducts.map((item) => item._id);

        // console.log(wishlistProductIds)
        const isInWishlist = wishlistProductIds.includes(id);
        setInWishlist(isInWishlist);
        // console.log(isInWishlist)
      } catch (error) {
        console.error("Failed to check wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [id, userId]);

  const handleThumbnailClick = (img) => {
    setMainImage(`http://localhost:5000/${img}`);
  };

  const handleQuantityChange = (type) => {
    setQuantity((prevQuantity) =>
      type === "increment" ? prevQuantity + 1 : Math.max(1, prevQuantity - 1)
    );
  };

  const notifyLogin = (action) => {
    toast.error(`Please signup to ${action}.`);
    setTimeout(() => {
      navigate("/signup");
    }, 1000);
  };

  const addToWishlist = async (productId) => {
    if (!userId) {
      notifyLogin("add items to your wishlist");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/wishlist/add", {
        userId,
        productId,
      });
      setInWishlist(true);
      dataGet()
      toast.success("Added to wishlist!");
    } catch (error) {
      toast.error("Failed to add to wishlist.");
    }
  };

  const addToCart = async (productId) => {
    if (!userId) {
      notifyLogin("add items to your cart");
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/cart/add`, {
        userId,
        productId,
        quantity,
      });
      setInCart(true);
      datacart()
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart.");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details-container">
      <ToastContainer />
      <div className="breadcrumbs">
        <span onClick={() => navigate("/")}>
          {product.categories?.name || "Home"}
        </span>{" "}
        / <span>{product.name}</span>
      </div>

      <div className="product-details">
        <div className="product-images">
          <div className="main-image-container">
            <img
              src={mainImage}
              alt={product.name}
              className="main-image"
              onMouseEnter={(e) => e.target.classList.add("zoom")}
              onMouseLeave={(e) => e.target.classList.remove("zoom")}
            />
          </div>
          <div className="thumbnail-container">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5000/${img}`}
                alt={`Thumbnail ${index}`}
                className="thumbnail"
                onClick={() => handleThumbnailClick(img)}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-reviews">⭐⭐⭐⭐ (150 Reviews) | In Stock</p>
          <p className="product-price">${product.sellPrice}</p>
          <p className="product-description">{product.description}</p>

          {/* <div className="product-options">
            <div className="size-options">
              <span>Size:</span>
              {(product.sizes || ["XS", "S", "M", "L", "XL"]).map(
                (size, index) => (
                  <button key={index} className="size-btn">
                    {size}
                  </button>
                )
              )}
            </div>
          </div>  */}

          <div className="quantity">
            <label>Quantity:</label>
            <button onClick={() => handleQuantityChange("decrement")}>-</button>
            <input type="number" min="1" value={quantity} readOnly />
            <button onClick={() => handleQuantityChange("increment")}>+</button>
          </div>

          {inCart ? (
            <button className="go-cart-btn" onClick={() => navigate("/cart")}>
              Go to Cart
            </button>
          ) : (
            <button
              className="add-to-cart-btn"
              onClick={() => addToCart(product._id)}
            >
              Add to Cart
            </button>
          )}

          {inWishlist ? (
            <button
              className="go-wishlist-btn"
              onClick={() => navigate("/wishlist")}
            >
              Go to Wishlist
            </button>
          ) : (
            <button
              className="wishlist-btn"
              onClick={() => addToWishlist(product._id)}
            >
              Add to Wishlist
            </button>
          )}

          <div className="delivery-info">
            <p>
              <b>Free Delivery</b> (Enter your postal code for Delivery
              Availability)
            </p>
            <p>
              <b>Return Delivery:</b> Free 30 Days Delivery Returns.{" "}
              <a href="/">Details</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
