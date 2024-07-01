import React, { useEffect, useState } from 'react';
import login from '../assets/login/register.jpg';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, provider } from '../Firebase';
import logo from '../assets/navbar/Spicy.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../components/SnackBar.css';

const SignIn = () => {
  const [value, setValue] = useState('');
  const [showPassword, setPassword] = useState(false);
  const [load, setLoad] = useState(false);
  const history = useNavigate();


  useEffect(() => {
    setValue(localStorage.getItem('email'));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoad(true);

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(userCredential, 'authData');
        setLoad(false);
        toast.success('Login Success!');
        history('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setLoad(false); 
        toast.error('Invalid email or password');
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-form">
      <ToastContainer />
      <div className="w-full">
        <div className="bg-form h-auto rounded-2xl shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            <div className="col w-full">
              <div className="relative max-h-screen w-full">
                <img src={login} className="max-h-screen w-full" alt="Login Illustration" />
                <div className="absolute inset-0 bg-black opacity-70"></div>
                <div className="flex flex-col items-center justify-center top-10 ml-40 absolute">
                  <div className="flex flex-col justify-center items-center mb-16">
                    <img src={logo} className="w-64 h-64" alt="Login Illustration" />
                    <h1 className="text-white">Spicy Kitchen Resturant</h1>
                  </div>
                  <div className="text-center text-white">
                    <h1 className="text-4xl font-bold">Welcome Back</h1>
                    <p className="text-xl">Please login to continue</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col w-2/3 ml-32 mt-28 pb-4 pr-8 text-white">
              <h1 className="text-center my-8">Login</h1>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-lg font-medium">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  className="bg-input border-none text-lg text-white rounded-xl block w-full p-2.5"
                  placeholder="email"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2 text-lg font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="bg-input border-none text-lg text-white rounded-xl block w-full p-2.5"
                    placeholder="password"
                    required
                  />
                  <FontAwesomeIcon
                    onClick={() => setPassword(!showPassword)}
                    icon={showPassword ? faEyeSlash : faEye}
                    className="absolute inset-y-0 top-1/3 right-0 flex items-center px-3 focus:outline-none text-gray-500"
                  />
                </div>
                <div className="flex justify-end mb-4 mt-2">
                  <NavLink to="/forgotPassword" className="text-lg text-decoration-none text-form-buttons">
                    Forgot password
                  </NavLink>
                </div>
              </div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-form-buttons text-white rounded-xl focus:outline-none py-2 text-xl mt-2"
              >
                {load ? <FontAwesomeIcon icon={faSpinner} className="spinner-animation" /> : 'Sign In'}
              </button>
              <p className="mt-3 text-center font-medium">
                Do not have an account?{' '}
                <NavLink to="/signUp" className="text-form-buttons cursor-pointer text-decoration-none">
                  Create One
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
