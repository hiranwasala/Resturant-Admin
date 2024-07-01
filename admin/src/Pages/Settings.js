import React, { useState, useContext } from 'react';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '../assets/header/man.png';
import { faPencil, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { updatePassword, updateEmail, updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../Firebase'; 
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../components/SnackBar.css';
import { UserContext } from '../contexts/UserContext';

const Settings = () => {
  const { user, setUser } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleProfileImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setUser({ ...user, userProfile: URL.createObjectURL(file) });
    }
  };

  const handleProfileImageUpload = async () => {
    if (profileImage) {
      setLoading(true);
      try {
        const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, profileImage);
        const photoURL = await getDownloadURL(storageRef);
        await updateProfile(auth.currentUser, { photoURL });
        setUser({ ...user, userProfile: photoURL });
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { photoURL });
      
      } catch (error) {
        toast.error('Error updating profile image: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePasswordUpdate = async (newPassword) => {
    setLoading(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
  
    } catch (error) {
      toast.error('Error updating password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameUpdate = async (newUsername) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { username: newUsername });
      await updateProfile(auth.currentUser, { displayName: newUsername });
      setUser({ ...user, userName: newUsername });
  
    } catch (error) {
      toast.error('Error updating username: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async (newEmail) => {
    setLoading(true);
    try {
      await updateEmail(auth.currentUser, newEmail);
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { email: newEmail });
      setUser({ ...user, userEmail: newEmail });

    } catch (error) {
      toast.error('Error updating email: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newUsername = event.target.elements.username.value;
    const newEmail = event.target.elements.email.value;
    const newPassword = event.target.elements.newPassword.value;

    await handleUsernameUpdate(newUsername);
    await handleEmailUpdate(newEmail);
    if (newPassword) {
      await handlePasswordUpdate(newPassword);
    }
    await handleProfileImageUpload();
    toast.success('Settings updated successfully!');
  };

  return (
    <div>
      <ToastContainer />
      <Header title="Settings" />
      <SideMenu />
      <div className="p-4 sm:ml-64">
        <div className="container total rounded-xl shadow-xl w-full h-auto">
          <div>
            <form onSubmit={handleSubmit} className="p-12">
              <div className="w-1/2 ml-64">
                <div className="flex flex-col items-center pb-10">
                  <div className="relative">
                    <img className="w-24 h-24 mb-3 rounded-full shadow-lg cursor-pointer" src={user.userProfile || Avatar} alt="Profile" />
                    <input type="file" onChange={handleProfileImageChange} className="absolute bottom-2 right-5 opacity-0 w-full h-full cursor-pointer" />
                    <div className="absolute bottom-2 right-5 bg-blue-200 w-6 h-6 rounded-lg">
                      <FontAwesomeIcon className="ml-1.5 w-3 h-3 text-gray-600 cursor-pointer" icon={faPencil} />
                    </div>
                  </div>
                  <h4 className="mb-1 font-medium text-gray-900 dark:text-white">{user.userName || 'Test'}</h4>
                </div>
              </div>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                  <label htmlFor="username" className="block mb-2 text-xl font-semibold text-gray-900 dark:text-white">Username</label>
                  <input type="text" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={user.userName} onChange={(e) => setUser({ ...user, userName: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-xl font-semibold text-gray-900 dark:text-white">Email Address</label>
                  <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={user.userEmail} onChange={(e) => setUser({ ...user, userEmail: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="oldPassword" className="block mb-2 text-xl font-semibold text-gray-900 dark:text-white">Old Password</label>
                  <input type="password" id="oldPassword" className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" value='•••••••••' />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block mb-2 text-xl font-semibold text-gray-900 dark:text-white">New Password</label>
                  <input type="password" id="newPassword" className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" />
                </div>
              </div>
              <button type="submit" className="text-white mr-4 bg-update hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl text-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{loading ?  <FontAwesomeIcon icon={faSpinner} className="spinner-animation" /> : 'Update'}</button>
              <button type="button" className="text-white bg-update hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl text-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cancel</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
