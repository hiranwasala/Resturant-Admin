import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import '../Pages/style.css';
import SideMenu from '../components/SideMenu';
import { useGetUsersQuery, useDeleteUserMutation, useGetUserDetailsQuery, useUpdateUserMutation } from '../slices/usersApiSlice';
import PopUp from '../components/PopUp';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../components/Spinner';

const Customers = () => {
  const [popup, setPopUp] = useState(false);
  const [popupDelete, setDelete] = useState(false);
  const [popupEdit, setEdit] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const { data, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();
  const { data: user, refetch: refetchUser } = useGetUserDetailsQuery(selectedUserId, {
    skip: !selectedUserId
  });
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  if (isLoading) 
  return <div className='flex justify-center items-center min-h-screen'>
           <Spinner/>
         </div>;

  if (error) return <h2>{error.message}</h2>;

  const handleRowClick = (userId) => {
    setSelectedUserId(userId);
    setPopUp(true);
  };

  const handleDelete = async () => {
    try {
      await deleteUser(selectedUserId);
      refetch();
      setPopUp(false);
      toast.success('User deleted successfully');
      setDelete(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId: selectedUserId, name, email, phone });
      refetchUser();
      setEdit(false);
      toast.success('User updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = () => {
    refetchUser();
    setEdit(true);
    setPopUp(false);
  }

  return (
    <div>
      <ToastContainer />
      <Header title='Customers' />
      <SideMenu />
      <div className="p-4 sm:ml-64">
        <div className="grid grid-cols-1 gap-4 mb-4 text-start">
          <h2>Restaurant Customers</h2>
        </div>

        <div className="relative overflow-x-auto shadow-xl sm:rounded-xl">
          <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-table-blue dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 text-xl">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-xl">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-xl">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-xl">
                  Phone number
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr
                  key={user._id}
                  onClick={() => handleRowClick(user._id)}
                  className="odd:bg-blue-200 bg-opacity-17 odd:dark:bg-gray-900 even:bg-table-blue even:dark:bg-gray-800 border-b dark:border-gray-700 cursor-pointer"
                >
                  <td className="px-6 py-4 text-lg font-medium dark:text-white">{user._id}</td>
                  <td className="px-6 py-4 text-lg font-medium dark:text-white">{user.name}</td>
                  <td className="px-6 py-4 text-lg font-medium dark:text-white">{user.email}</td>
                  <td className="px-6 py-4 text-lg font-medium dark:text-white">{user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* delete user */}
        <PopUp trigger={popupDelete} setTrigger={setDelete}>
        <FontAwesomeIcon icon={faXmark} className='cursor-pointer' onClick={() => setDelete(false)} />
          <h3 className='text-center mb-6'>Delete Customer</h3>
          <p className='text-lg'>Are you sure you need to delete this customer?</p>
           <div className="flex justify-center mt-6">
            <button
              onClick={handleDelete}
              className="w-1/2 bg-black text-white font-medium text-xl rounded-2xl p-2.5 mr-4"
            >
              Delete
            </button>
            <button
              onClick={() => setDelete(false)}
              className="w-1/2 bg-gray-200 text-gray-900 font-medium text-lg rounded-2xl p-2.5"
            >
              Cancel
            </button>
          </div>
        </PopUp>
        {/* update user */}
        <PopUp trigger={popupEdit} setTrigger={setEdit} width="w-1/3">
        <FontAwesomeIcon icon={faXmark} className='cursor-pointer' onClick={() => setEdit(false)} />
          <h3 className='text-center mb-8'>Update Customer</h3>
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
                <label htmlFor="name" className="block mb-2 text-xl font-medium text-gray-900">Name</label>
                <input type="text" id="name" value={name} onChange={(e)=> setName(e.target.value)}  className="bg-gray-100 border border-gray-300 text-gray-900 text-lg rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name"  />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-xl font-medium text-gray-900">Email</label>
                <input type="email" id="email" value={email} onChange={(e)=> setEmail(e.target.value)}  className="bg-gray-100 border border-gray-300 text-gray-900 text-lg rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="email"  />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block mb-2 text-xl font-medium text-gray-900">Phone number</label>
                <input type="number" id="phone" value={phone} onChange={(e)=> setPhone(e.target.value)}  className="bg-gray-100 border border-gray-300 text-gray-900 text-lg rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="phone number"  />
              </div>
              <button className='w-full p-2.5 mt-4 bg-black text-white font-medium rounded-xl text-xl' >Update Customer</button>
          </form>
        </PopUp>
        {/* select update or delete user */}
        <PopUp trigger={popup} setTrigger={setPopUp}>
        <FontAwesomeIcon icon={faXmark} className='cursor-pointer' onClick={() => setPopUp(false)} />
          <h3 className='text-center mb-8'>Select your preference</h3>
          <div className="text-center">
            <p className='text-lg'>Do you need to delete customer or update customer?</p>
            <div className="flex justify-center mt-8">
              <button
                onClick={() => { setDelete(true); setPopUp(false); }}
                className="w-1/2 bg-black text-white font-medium text-xl rounded-2xl p-2.5 mr-4"
              >
                Delete
              </button>
              <button
                onClick={handleEdit}
                className="w-1/2 bg-gray-200 text-gray-900 font-medium text-lg rounded-2xl p-2.5"
              >
                Update
              </button>
            </div>
          </div>
        </PopUp>
      </div>
    </div>
  );
};

export default Customers;
