import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth, provider, db } from '../Firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Google from '../assets/login/icons8-google-48.png';
import login from '../assets/login/register.jpg';
import '../components/SnackBar.css';
import logo from '../assets/navbar/Spicy.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const navigate = useNavigate();

  const handleGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (data) => {
        console.log("Google sign-in successful:", data);
        const user = data.user;
        await setDoc(doc(db, 'users', user.uid), {
          username: user.displayName,
          email: user.email,
        });
        toast.success('Google sign-in successful!');
        navigate('/');
      })
      .catch((error) => {
        console.error("Google sign-in error:", error);
        toast.error('Google sign-in error: ' + error.message);
      });
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const name = document.getElementById('name').value;

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      setLoading(false);
      toast.error('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        username: name,
        email: user.email,
      });
      await sendEmailVerification(userCredential.user);
      console.log(userCredential, "authData");
      setLoading(false);
      toast.success('Account created successfully');
      navigate('/');
    } catch (error) {
      console.error("Error signing up:", error);
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-form'>
      <ToastContainer />
      <div className='w-full'>
        <div className=' bg-form h-auto rounded-2xl shadow-xl'>
          <div className='grid grid-cols-2 gap-2'>
            <div className='col w-full'>
              <div className="relative max-h-screen w-full">
                <img src={login} className="max-h-screen w-full" alt="Login Illustration"/>
                <div className='absolute inset-0 bg-black opacity-70'></div>
                <div className=" flex flex-col items-center justify-center top-10 ml-40 absolute">
                  <div className='flex flex-col justify-center items-center mb-16'>
                    <img src={logo} className="w-64 h-64" alt="Login Illustration"/>
                    <h1 className='text-white'>Spicy Kitchen Resturant</h1>
                  </div>
                  <div className="text-center text-white">
                    <h1 className="text-4xl font-bold">Welcome Back</h1>
                    <p className="text-xl">Please enter your details</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='col w-2/3 ml-32 pb-4 pr-8 text-white'>
              <h1 className='text-center my-4'>Register</h1>
              <div className='mb-3'>
                <label htmlFor="name" className="block mb-2 text-lg font-medium ">Username</label>
                <input type="text" id="name" className="bg-input border-none text-lg text-white rounded-xl block w-full p-2.5" placeholder="username" required />
              </div>
              <div className='mb-3'>
                <label htmlFor="email" className="block mb-2 text-lg font-medium ">Email</label>
                <input type="email" id="email" className="bg-input border-none text-lg text-white rounded-xl block w-full p-2.5" placeholder="email" required />
              </div>
              <div className='mb-3'>
                <label htmlFor="password" className="block mb-2 text-lg font-medium ">Password</label>
                <div className='relative'>
                  <input type={showPassword ? "text" : "password"} id="password" className="bg-input border-none text-lg text-white rounded-xl block w-full p-2.5" placeholder="password" required />
                  <FontAwesomeIcon onClick={() => setShowPassword(!showPassword)} icon={showPassword ? faEyeSlash : faEye} className='absolute inset-y-0 top-1/3 right-0 flex items-center px-3 focus:outline-none text-gray-500' />
                </div>
              </div>
              <div className='mb-3'>
                <label htmlFor="confirmPassword" className="block mb-2 text-lg font-medium ">Confirm Password</label>
                <div className='relative'>
                  <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" className="bg-input border-none text-lg text-white rounded-xl block w-full p-2.5" placeholder="confirm password" required />
                  <FontAwesomeIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)} icon={showConfirmPassword ? faEyeSlash : faEye} className='absolute inset-y-0 top-1/3 right-0 flex items-center px-3 focus:outline-none text-gray-500' />
                </div>
              </div>
              <div className="flex items-center h-5 mt-4">
                <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" required />
                <label htmlFor="remember" className="ms-2 text-sm font-normal ">Remember me</label>
              </div>
              <button type='submit' onClick={(e) => handleSubmit(e)} className='w-full bg-form-buttons text-white rounded-xl focus:outline-none py-2 text-xl mt-4'>{loading ? <FontAwesomeIcon icon={faSpinner} className="spinner-animation" /> : 'Sign Up'}</button>
              <p className='mt-3 text-center  font-medium'>Already have an account? <NavLink to="/signIn" className='text-form-buttons cursor-pointer text-decoration-none'>Log In</NavLink></p>
              <p className=' text-center my-3'>Or</p>
              <button onClick={handleGoogle} className='py-2 border-2 border-gray-300 border-solid rounded-xl bg-transparent w-full font-medium mb-2 items-center flex px-4 justify-center'><img src={Google} className='w-8 h-8 mr-4' alt="Google Icon"/>Sign Up with Google</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
