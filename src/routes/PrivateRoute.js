import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ permissionLevel }) => {
  const {user} = useSelector((state) => state.user);

  return user && permissionLevel ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
