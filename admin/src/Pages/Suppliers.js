import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CustomText from '../components/CustomText';
import Supply from '../assets/suppliers/supply-chain.png';
import { faCirclePlus, faXmark, faEllipsis, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../Pages/style.css';
import SideMenu from '../components/SideMenu';
import PopUp from '../components/PopUp';
import Spinner from '../components/Spinner';
import { useGetSuppliersQuery, useDeleteSupplierMutation, useCreateSupplierMutation, useUpdateSupplierMutation} from '../slices/supplierApiSlice';
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Suppliers = () => {
  const [popup, setPopUp] = useState(false);
  const [ deletePopup ,setDeletePopup] = useState(false);
  const [addPopup, setAddPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [search, setSearch] = useState('');

  const [name, setName] = useState('');
  const [item, setItem] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');


  const { data: suppliersData, refetch, isLoading } = useGetSuppliersQuery();
  const [deleteSupplier, {isLoading: loadingDelete}] = useDeleteSupplierMutation();
  const [createSupplier, {isLoading: loadingCreate}] = useCreateSupplierMutation();
  const [updateSupplier, {isLoading: loadingUpdate}] = useUpdateSupplierMutation();

  useEffect(()=> {
    if(suppliersData){
      setSuppliers(suppliersData);
    }
  }, [suppliersData]);

  useEffect(()=> {
    if(selectedSupplier){
      setName(selectedSupplier.name);
      setItem(selectedSupplier.item);
      setPhone(selectedSupplier.phone);
      setStatus(selectedSupplier.status);
    }
  },[selectedSupplier]);

  
    const approvedSuppliers = suppliers.filter((supplier)=>supplier.status === 'Approved').length;
    const pendingSuppliers = suppliers.filter((supplier)=>supplier.status === 'pending').length;
    const rejectedSuppliers = suppliers.filter((supplier)=>supplier.status === 'Rejected').length;
    const totalSuppliers = suppliers.length;

  

  const handleDelete = async() => {
    try {
      await deleteSupplier(selectedSupplier._id);
      setDeletePopup(false);
      refetch();
      toast.success('Supplier deleted successfully');
    } catch (err) {
      console.log('Error response:', err.response);
      toast.error(err.response.data.message);
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const existingSupplier = suppliers.find(supplier => supplier.name.toLowerCase() === name.toLowerCase());
    const existingItem = suppliers.find(supplier => supplier.item.toLowerCase() === item.toLowerCase());

    if (existingSupplier) {
      setError('Supplier name already exists');
      return;
    }

    if (existingItem) {
      setError('Item already exists');
      return;
    }


    const newSupplier = {
        name,
        item,
        phone,
        status: 'pending'
    };

    try {
      await createSupplier(newSupplier);
      setAddPopup(false);
      refetch();
      setName('');
      setItem('');
      setPhone('');
      toast.success(
        'Supplier added successfully'
      )
        
    } catch (err) {
        console.log('Error response:', err.response);
        toast.error(err.response.data.message);
    }
};

const handleUpdate = async (e) => {
  e.preventDefault();
  setError('');

  
  const existingSupplier = suppliers.find(supplier => supplier.name.toLowerCase() === name.toLowerCase() && supplier._id !== selectedSupplier._id);
  const existingItem = suppliers.find(supplier => supplier.item.toLowerCase() === item.toLowerCase() && supplier._id !== selectedSupplier._id);

  if (existingSupplier) {
    setError('Supplier name already exists');
    return;
  }

  if (existingItem) {
    setError('Item already exists');
    return;
  }

  try {
    if (!selectedSupplier._id) {
      console.log('Please select a supplier');
      return;
    }

    await updateSupplier({ id: selectedSupplier._id, name, item, phone, status });
    setEditPopup(false);
    refetch();
    toast.success('Supplier updated successfully');
    setSelectedSupplier(null);
    setName('');
    setItem('');
    setPhone('');
    setStatus('');
  
  } catch (err) {
    console.log('Error response:', err.response);
    toast.error(err.response.data.message);
  }
}



  return (
    <div>
      <ToastContainer />
      <Header title='Suppliers' />
      <SideMenu />
      <div className="p-4 sm:ml-64">
        <div className='grid ml-2 mr-2 grid-cols-4 gap-4'>
          <div className='w-56 h-24 rounded-2xl shadow-xl total'>
            <div className='flex flex-row items-center'>
              <div className='col-span-2 ml-4 mr-2'>
                <CustomText title={`${approvedSuppliers}`} color="rgb(74 222 128)" fontSize="28px" fontWeight="600" />
                <CustomText title="Approved" color="#ADA9A9" fontSize="25px" fontWeight="600" />
              </div>
              <FontAwesomeIcon icon={faCircleCheck} className='w-12 h-12 ml-4 text-supply-green' />
            </div>
          </div>
          <div className='w-56 h-24 rounded-2xl shadow-xl total'>
            <div className='flex flex-row items-center'>
              <div className='col-span-2 ml-4'>
                <CustomText title={`${pendingSuppliers}`} color="#F5CE00" fontSize="28px" fontWeight="600" />
                <CustomText title="Pending" color="#ADA9A9" fontSize="25px" fontWeight="600" />
              </div>
              <FontAwesomeIcon icon={faEllipsis} className='w-12 h-12 ml-8 text-supply-yellow' />
            </div>
          </div>
          <div className='w-56 h-24 rounded-2xl shadow-xl total'>
            <div className='flex flex-row items-center'>
              <div className='col-span-2 ml-4'>
                <CustomText title={`${rejectedSuppliers}`} color="#FF3030" fontSize="28px" fontWeight="600" />
                <CustomText title="Rejected" color="#ADA9A9" fontSize="25px" fontWeight="600" />
              </div>
              <FontAwesomeIcon icon={faCircleXmark} className='w-12 h-12 ml-8 text-supply-red' />
            </div>
          </div>
          <div className='w-72 h-24 rounded-2xl shadow-xl total'>
            <div className='flex flex-row items-center'>
              <div className='col-span-2 ml-4'>
                <CustomText title={`${totalSuppliers}`} color="rgb(14 165 233)" fontSize="28px" fontWeight="600" />
                <CustomText title="Total Suppliers" color="#ADA9A9" fontSize="25px" fontWeight="600" />
              </div>
              <img src={Supply} alt='supply' className='ml-4' />
            </div>
          </div>
        </div>

        <div className='flex flex-row items-center justify-between mt-20 ml-2 mr-2'>
          <div className='total w-52 h-12 rounded-xl shadow-xl flex space-around items-center cursor-pointer' onClick={()=> setAddPopup(true)}>
            <div className='flex flex-row'>
              <FontAwesomeIcon icon={faCirclePlus} className='w-8 h-8 text-supply-green ml-4 mr-5' />
              <h5 className='mt-1'>Add Supplier</h5>
            </div>
          </div>
          <input type="text" id="search" onChange={(e)=> setSearch(e.target.value)} class=" bg-gray-50 text-gray-900 text-lg rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-52 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-2" placeholder="Search" required />

        </div>

        <div className="relative overflow-x-auto shadow-xl mt-12 sm:rounded-xl">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-green-300 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 text-xl">
                  Supplier
                </th>
                <th scope="col" className="px-6 py-3 text-xl">
                  Item
                </th>
                <th scope="col" className="px-6 py-3 text-xl">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-xl">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
            {isLoading ? (
                <tr>
                  <td colSpan="5" className='text-center flex justify-center'>
                    <Spinner />
                  </td>
                </tr>
              ) : (
                <>
                  {suppliersData?.filter((supplier) => {
                    const searchLower = search.toLowerCase();
                    return searchLower === '' ? supplier : supplier.name.toLowerCase().includes(searchLower);
                  }).length === 0 ? (
                    <tr>
                      <td colSpan="5" className='text-center text-xl text-gray-700'>
                        Supplier not found
                      </td>
                    </tr>
                  ) : (
                    suppliersData?.filter((supplier) => {
                      const searchLower = search.toLowerCase();
                      return searchLower === '' ? supplier : supplier.name.toLowerCase().includes(searchLower);
                    }).map((supplier, index) => (
                      <tr key={index} onClick={() => { setSelectedSupplier(supplier); setPopUp(true) }} className={`odd:bg-green-100 cursor-pointer bg-opacity-17 odd:dark:bg-gray-900 even:bg-green-300 even:dark:bg-gray-800 border-b dark:border-gray-700`}>
                        <th scope="row" className="px-6 py-4 font-medium text-lg text-gray-900 whitespace-nowrap dark:text-white">
                          {supplier.name}
                        </th>
                        <td className="px-6 py-4 text-lg font-medium">
                          {supplier.item}
                        </td>
                        <td className="px-6 py-4 text-lg font-medium">
                          {supplier.phone}
                        </td>
                        <td className="px-6 py-4 text-lg font-medium">
                          {supplier.status === 'Approved' && <FontAwesomeIcon icon={faCircleCheck} className='w-10 h-10 ml-6 text-supply-green' />}
                          {supplier.status === 'pending' && <FontAwesomeIcon icon={faEllipsis} className='w-10 h-10 ml-6 text-supply-yellow' />}
                          {supplier.status === 'Rejected' && <FontAwesomeIcon icon={faCircleXmark} className='w-10 h-10 ml-6 text-supply-red' />}
                        </td>
                      </tr>
                    ))
                  )}
                </>
              )}
            </tbody>
          </table>

            {/* add supplier */}

            <PopUp trigger={addPopup} setTrigger={setAddPopup} width='w-1/3'>
            <FontAwesomeIcon icon={faXmark} className='cursor-pointer' onClick={() => setAddPopup(false)} />
            <h3 className='text-center mb-8'>Add Supplier</h3>
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
              <div className="mb-3">
                <label htmlFor="name" className="block mb-2 text-lg font-medium text-gray-900">Supplier Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="John Steve"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(''); 
                  }}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="item" className="block mb-2 text-lg font-medium text-gray-900">Item</label>
                <input
                  type="text"
                  id="item"
                  name="item"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder='Sea food'
                  value={item}
                  onChange={(e) => {
                    setItem(e.target.value);
                    setError('');
                  }}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="phone" className="block mb-2 text-lg font-medium text-gray-900">Phone number</label>
                <input
                  type="number"
                  id="phone"
                  name="phone"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder='+1 555-123-4567'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              {error && <p className='mt-2 text-red-400'>{error}</p>}
              <button type="submit" className="w-full bg-black text-white font-medium text-lg rounded-lg py-2.5 my-6">Add Supplier</button>
            </form>
          </PopUp>

          {/* edit supplier */}
          <PopUp trigger={editPopup} setTrigger={setEditPopup} width='w-1/3'>
            <FontAwesomeIcon icon={faXmark} className='cursor-pointer' onClick={() => setEditPopup(false)} />
            <h3 className='text-center mb-8'>Edit Supplier</h3>
            {selectedSupplier && (
              <form onSubmit={handleUpdate} className="max-w-sm mx-auto">
                <div className="mb-3">
                  <label htmlFor="name" className="block mb-2 text-lg font-medium text-gray-900">Supplier Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    placeholder="John Steve" 
                    value={name} 
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }} 
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="item" className="block mb-2 text-lg font-medium text-gray-900">Item</label>
                  <input 
                    type="text" 
                    id="item" 
                    name="item" 
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    placeholder='Sea food'
                    value={item}
                    onChange={(e) => {
                      setItem(e.target.value);
                      setError('');
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="block mb-2 text-lg font-medium text-gray-900">Phone number</label>
                  <input 
                    type="number" 
                    id="phone" 
                    name="phone" 
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    placeholder='+1 555-123-4567' 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="status" className="block mb-2 text-lg font-medium text-gray-900">Status</label>
                  <select 
                    id="status" 
                    name="status" 
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}>
                    <option value="Rejected">Rejected</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>
                {error && <p className='mt-2 text-red-400'>{error}</p>}
                <div className="mb-3 flex justify-around">
                  <button type="submit" className="w-full bg-black text-white font-medium text-lg rounded-lg py-2.5 my-6">Update Supplier</button>
                </div>
              </form>
            )}
          </PopUp>

        
          

           {/* delete supplier */}
           <PopUp trigger={deletePopup} setTrigger={setDeletePopup}>
            <div className="text-center">
                  <p className='text-xl'>Are you sure you want to delete this supplier?</p>
                  <div className="flex justify-around mt-8">
                    
                      <button onClick={handleDelete} className="w-1/2 bg-black text-white font-medium text-lg rounded-lg py-2.5 mr-4">Delete</button>
                    
                    <button onClick={() => setDeletePopup(false)} className="w-1/2 bg-gray-500 text-white font-medium text-lg rounded-lg py-2.5">Cancel</button>
                  </div>
                </div>
          </PopUp>

          {/* select delete or update supplier */}
          <PopUp trigger={popup} setTrigger={setPopUp} width="w-2/5">
            <FontAwesomeIcon icon={faXmark} className='cursor-pointer' onClick={() => setPopUp(false)} />
             <h3 className='text-center mb-8'>Select your preference</h3>
             <div className="text-center">
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => { setDeletePopup(true); setPopUp(false); }}
                  className="w-1/2 bg-black text-white font-medium text-xl rounded-2xl p-2.5 mr-4"
                >
                  Delete
                </button>
                <button
                  onClick={() => { setEditPopup(true); setPopUp(false); }}
                  className="w-1/2 bg-gray-200 text-gray-900 font-medium text-lg rounded-2xl p-2.5"
                >
                  Update
                </button>
              </div>
            </div>
        
          </PopUp>

        </div>
      </div>
    </div>
  );
};

export default Suppliers;
