import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { adminLogin } from "../../redux/slices/adminSlice";
import { Toaster, toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = {
      emailOrPhone: data.emailOrPhone,
      password: data.password,
    };
    
    try {
      const result = await dispatch(adminLogin(res)).unwrap();
      toast.success('Login successful');
      Cookies.set('token', result.token);
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error('error is here');
      console.log(error)
    }
  };

  return (
    <main>
      <Toaster />
      <div className="flex justify-center p-4 bg-white items-center h-screen">
        <div className="bg-gray-100 p-2 w-full md:w-1/2 xl:w-1/4 rounded-md shadow-md">
          <h2 className="text-2xl font-bold py-3 text-center">
            Login To E-Commerce
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="emailOrPhone"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email Or Phone
              </label>
              <input
                type="text"
                id="emailOrPhone1"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Email Or Phone"
                value={data.emailOrPhone}
                name="emailOrPhone"
                onChange={(e) => setData({ ...data, emailOrPhone: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Password"
                value={data.password}
                name="password"
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>
            <div className="mb-4 flex justify-center">
              <input
                type="submit"
                value="Login"
                className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              />
            </div>
          </form>
          <Link to="/admin/forgot-password" className="text-blue-500">Forgot Password?</Link>
        </div>
      </div>
    </main>
  );
};

export default Login;
