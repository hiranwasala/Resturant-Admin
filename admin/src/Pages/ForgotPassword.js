import React, { useState } from 'react';
import login from '../assets/login/register.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Firebase';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import logo from '../assets/navbar/Spicy.png';

const ForgotPassword = () => {

    const [ load, setLoad] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const history = useNavigate(); 

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoad(true);
        if (!email) {
            setError('Please enter your email address.');
            return;
        }
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert('Password reset email sent. Check your inbox.');
                setEmail('');
                setError('');
                setLoad(false);
                history('/signIn');
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-form'>
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
                               
                            </div>
                        </div>

                    </div>
                        <div className='col w-2/3 ml-32 mt-28 pb-4 pr-8 text-white'>
                            <h1 className='text-center my-8'>Forgot Password</h1>
                            <p className='mb-4'>
                                Kindly enter the email address tied to your account, we would help you to reset your
                                password.
                            </p>
                            <div className='mb-4'>
                                <label htmlFor='email' className='block mb-2 text-lg font-medium'>
                                    Email
                                </label>
                                <input
                                    type='email'
                                    id='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='bg-input border-none text-lg text-white rounded-xl block w-full p-2.5'
                                    placeholder='Email'
                                    required
                                />
                                {error && <p className='text-form-buttons'>{error}</p>}
                                <div className='flex justify-end mb-4 mt-2'>
                                    <NavLink to='/signIn' className='text-lg text-decoration-none text-form-buttons'>
                                        Back to Login page
                                    </NavLink>
                                </div>
                            </div>
                            <button
                                onClick={handleSubmit}
                                className='w-full bg-form-buttons text-white rounded-xl focus:outline-none py-2 text-xl mt-2'
                            >
                                {load ? <FontAwesomeIcon icon={faSpinner} className="spinner-animation"/> : 'Recover my Password'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
