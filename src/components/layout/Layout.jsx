import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Container from "../container/Container";

const Layout = () => {
  return (
    <div>
      <div className="p-7 bg-blue-500">
        <Container className="flex justify-end gap-5">
          <NavLink className={({ isActive }) => `text-2xl text-white p-4 ${isActive ? "border border-white rounded-md" : ""}`} to="/">
            Home
          </NavLink>
          <NavLink className={({ isActive }) => `text-2xl text-white p-4 ${isActive ? "border border-white rounded-md" : ""}`} to="/products">
            Products
          </NavLink>
          <NavLink className={({ isActive }) => `text-2xl text-white p-4 ${isActive ? "border border-white rounded-md" : ""}`} to="/categories">
            Categories
          </NavLink>
          <NavLink className={({ isActive }) => `text-2xl text-white p-4 ${isActive ? "border border-white rounded-md" : ""}`} to="/users">
            Users
          </NavLink>
        </Container>
      </div>
      <Container>{<Outlet />}</Container>
    </div>
  );
};

export default Layout;
