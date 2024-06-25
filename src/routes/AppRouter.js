import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import AdminOrder from "../page/AdminOrder";
import AdminProduct from "../page/AdminProduct";
import Cart from "../page/Cart";
import Login from "../page/Login";
import MainProduct from "../page/MainProduct";
import MyOrder from "../page/MyOrder";
import Order from "../page/Order";
import OrderComplete from "../page/OrderComplete";
import ProductDetail from "../page/ProductDetail";
import Register from "../page/Register";
import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const {user} = useSelector((state) => state.user);

  useEffect(() => {
    if(user && (location.pathname === '/login' || location.pathname === '/register')) {
      navigate(-1); 
    } 
  }, [user, location.pathname, navigate]);
  return (
    <Routes>
      <Route path="/" element={<MainProduct />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route element={<PrivateRoute permissionLevel={user?.level === "customer"} />}>
        <Route path="/cart" element={<Cart/>} />
        <Route path="/order" element={<Order />} />
        <Route path="/order/complete" element={<OrderComplete />} />
        <Route path="/my/order" element={<MyOrder />} />
      </Route>
      <Route element={<PrivateRoute permissionLevel={user?.level === "admin"} />}>
        <Route path="/admin/product" element={<AdminProduct />} />
        <Route path="/admin/order" element={<AdminOrder />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
