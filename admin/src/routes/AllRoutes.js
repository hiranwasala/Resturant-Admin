import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../Pages/Dashboard';
import Orders from '../Pages/Orders';
import Suppliers from '../Pages/Suppliers';
import Customers from '../Pages/Customers';
import Reviews from '../Pages/Reviews';
import Reservations from '../Pages/Reservations';
import Employees from '../Pages/Employees';
import Inventory from '../Pages/Inventory';
import Settings from '../Pages/Settings';
import SignUp from '../Pages/SignUp';
import SignIn from '../Pages/SignIn';
import ForgotPassword from '../Pages/ForgotPassword';
import MenuList from '../Pages/MenuList';

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/menus/menuList" element={<MenuList />} />
        <Route path="/menus/menuList/page/:pageNumber" element={<MenuList />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
};

export default AllRoutes;
