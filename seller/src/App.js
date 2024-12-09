import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/auth/signup/Signup";
import Login from "./pages/auth/login/Login";
import Home from "./pages/home/Home";
import SideBar from "./components/SideBar";
import Profile from "./pages/profile/Profile";
import SellerProducts from "./pages/sellerProduct/SellerProducts";
import ProductDetails from "./pages/sellerProduct/ProductDetails";
import AllProducts from "./pages/sellerProduct/AllProducts";
import UpdateProduct from "./pages/sellerProduct/UpdateProduct"; // Import the new component
import RootRedirect from "./components/RootRedirect";
import ProtectedRoute from "./components/ProtectedRoute";
import Order from "./pages/orders/Order";
import OrderDetails from "./pages/orders/OrderDetails";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/seller/signup" element={<Signup />} />
        <Route path="/seller/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/seller" element={<SideBar />}>
            <Route path="dashboard" element={<Home />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="all-products" element={<AllProducts />} />
            <Route path="orders" element={<Order />} />
            <Route path="orders/:orderId" element={<OrderDetails />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<div>Settings Page</div>} />
            <Route path="products/:productId" element={<ProductDetails />} />
            <Route
              path="products/update/:productId"
              element={<UpdateProduct />}
            />{" "}
            {/* New route for updating product */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
