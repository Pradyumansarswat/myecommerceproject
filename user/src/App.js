import React, { useState } from 'react';
import './App.css';
import Topbar from './components/topbar/Topbar';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import { Route, Routes, useNavigate } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import LogInPage from './pages/LogInPage';
import MyAccount from './components/myaccount/MyAccount';
import { Toaster } from 'react-hot-toast';
import Error from './pages/Error';
import CheckOut from './components/checkout/CheckOut';
import ProductDetails from './pages/ProductDetails';
import Cart from './components/cart/Cart';
import WishList from './components/wishlist/WishList';
import Sidebar from './components/sidebar/Sidebar';
import OurProducts from './components/outproducts/OurProducts';
import AllProducts from './pages/AllProducts';
import ProductCateogry from './pages/ProductCateogry';
import CategoriesProduct from './components/sidebar/CategoriesProduct';
import CategoryProduct from './components/categorypage/CategoryProduct';
import FlashSales from './components/flashsales/FlashSales';
import OrderDetails from './pages/OrderDetails';
import ConfirmOrder from './components/confirmorder/ConfirmOrder';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleCategorySelect = (category) => {
        navigate(`/product/${category._id}`);
    };

  return (
    <>
      <Toaster />
      <div>
        <Topbar />
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <Sidebar isOpen={isSidebarOpen} onCategorySelect={handleCategorySelect} />

        <Routes>
         
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path='flashsales'element={<FlashSales/>}/>
            <Route path="login" element={<LogInPage />} />
            <Route path="myaccount/:section?" element={<MyAccount />} />
            <Route path="checkout" element={<CheckOut />} />
            <Route path="confirm-order/:orderId" element={<ConfirmOrder />} />
            <Route path="cart" element={<Cart />} />
            <Route path="products" element={<OurProducts />} />
        
            <Route path="/:id" element={<ProductDetails />} />
            <Route path="all-products" element={<AllProducts />} />
            <Route path="order-details/:orderId" element={<OrderDetails />} />
            <Route path="wishlist" element={<WishList />} />
            <Route path="product/:categoryId" element={<ProductCateogry/>} />

            <Route path="*" element={<Error />} />
       
        </Routes>

        <Footer />
      </div>
    </>
  );
};

export default App;
