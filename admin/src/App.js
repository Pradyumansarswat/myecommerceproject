import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Users from "./pages/users/Users";
import Sidebar from "./components/sidebar/Sidebar";
import Seller from "./pages/sellers/Seller";
import Category from "./pages/categories/Category";
import Product from "./pages/product/Product";
import AdminSettings from "./pages/adminSettings/AdminSettings";
import RootRedirect from "./components/RootRedirect";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SellerProducts from "./pages/sellers/SellerProducts";
import CategoryProducts from "./pages/categories/CategoryProducts";
import Order from "./pages/orders/Order";
import OrderDetails from "./pages/orders/OrderDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminSettings />}>
            <Route path="/admin" element={<Sidebar />}>
              <Route path="/admin/dashboard" element={<Home />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/sellers" element={<Seller />} />
              <Route path="/admin/categories" element={<Category />} />
              <Route path="/admin/products" element={<Product />} />
              <Route path="/admin/orders" element={<Order />} />
              <Route path="/admin/orders/:orderId" element={<OrderDetails />} />
              <Route
                path="/admin/seller-products/:sellerId"
                element={<SellerProducts />}
              />
              <Route
                path="/admin/category-products/:categoryId"
                element={<CategoryProducts />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
