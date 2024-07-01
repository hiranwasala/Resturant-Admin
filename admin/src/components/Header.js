import React, { useContext, useEffect, useState } from 'react';
import '../components/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Avatar from '../assets/header/man.png';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const Header = (props) => {
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem("darkMode")) || false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/signIn');
    });
  };

  return (
    <div className='flex flex-col md:flex-row justify-between w-full h-auto header'>
      <h3 className='title py-4 dark:text-white'>{props.title}</h3>

      <div className="flex md:items-center">
        <div className='moon-icon mt-2 md:mt-0 md:ml-4 mr-6'>
          <FontAwesomeIcon onClick={() => setDarkMode(!darkMode)} icon={darkMode ? faSun : faMoon} size="2x" className='cursor-pointer dark:text-white' />
        </div>
        <div className='gear-icon mt-2 md:mt-0 ml-4 md:mr-10'>
          <FontAwesomeIcon onClick={handleSignOut} icon={faArrowRightFromBracket} size="2x" className='dark:text-white cursor-pointer' />
        </div>
        <img src={user.userProfile || Avatar} alt="avatar" className="avatar mt-2 md:mt-0 rounded-full" />
        <div className="flex flex-col ml-4 mt-3 mr-20 md:mt-0 dark:text-white">
          <h4 className="text-xl font-bold m-0">{user.userName || 'Test'}</h4>
          <p className="text-blue-600 dark:text-blue-400">Admin</p>
        </div>
      </div>
    </div>
  );
}

export default Header;
