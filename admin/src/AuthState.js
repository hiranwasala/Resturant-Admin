import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Navigate, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Orders from './Pages/Orders';
import Suppliers from './Pages/Suppliers';
import Customers from './Pages/Customers';
import Reviews from './Pages/Reviews';
import Reservations from './Pages/Reservations';
import Employees from './Pages/Employees';
import Inventory from './Pages/Inventory';
import Settings from './Pages/Settings';
import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';
import ForgotPassword from './Pages/ForgotPassword';
import '../src/components/SnackBar.css';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MenuList from '../src/Pages/MenuList'

const AuthState = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="spinner-container">
          <FontAwesomeIcon icon={faSpinner} className="spinner-animation w-12 h-12" />
        </div>
      ) : (
        <Routes>
        
          {user ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/menus/menuList" element={<MenuList/>}></Route>
              <Route path="/menus/menuList/page/:pageNumber" element={<MenuList />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/suppliers" element={<Suppliers />}> </Route>
              <Route path="/customers" element={<Customers />}></Route>
              <Route path="/reviews" element={<Reviews />}></Route>
              <Route path="/reservations" element={<Reservations />}></Route>
              <Route path="/employees" element={<Employees />}></Route>
              <Route path='/inventory'  element={<Inventory />}></Route>
              <Route path='/settings' element = {<Settings/>}></Route>
              
            </>
          ) : (
            <>
              <Route path="/signIn" element={<SignIn />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
            </>
          )}

          
          <Route path="*" element={<Navigate to="/signIn" replace />} />

          
        </Routes>
      )}
    </div>
  );
};

export default AuthState;
