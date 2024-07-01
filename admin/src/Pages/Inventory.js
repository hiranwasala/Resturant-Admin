import React, {useState, useEffect} from 'react'
import Header from '../components/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import SideMenu from '../components/SideMenu';
import { useGetInventoriesQuery, useDeleteInventoryMutation, useCreateInventoryMutation, useUpdateInventoryMutation } from '../slices/inventoryApiSlice';
import Spinner from '../components/Spinner';
import PopUp from '../components/PopUp';
import Dropdown from '../components/Dropdown'
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Inventory = () => {
  const [popup, setPopUp] = useState(false);
  const [ deletePopup ,setDeletePopup] = useState(false);
  const [addPopup, setAddPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const { data: inventories, isLoading, refetch } = useGetInventoriesQuery();
  const [deleteInventory, {isLoading: loadingDelete}] = useDeleteInventoryMutation();
  const [createInventory, {isLoading: loadingCreate}] = useCreateInventoryMutation();
  const [updateInventory, {isLoading: loadingUpdate}] = useUpdateInventoryMutation();

  const [itemName, setItemName] = useState('');
  const [itemGroup, setItemGroup] = useState('');
  const [inStock, setInStock] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  const [storageLocation, setStorageLocation] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');


  useEffect(()=> {
    if(selectedInventory){
      setItemName(selectedInventory.itemName);
      setItemGroup(selectedInventory.itemGroup);
      setInStock(selectedInventory.inStock);
      setCostPerUnit(selectedInventory.costPerUnit);
      setStorageLocation(selectedInventory.storageLocation);
    }
  },[selectedInventory]);

  const handleSubmit = async(e)=> {
    e.preventDefault();

    const existingItemName = inventories.find(inventory => inventory.itemName.toLowerCase() === itemName.toLowerCase());
    

    if (existingItemName) {
      setError('item name already exists');
      return;
    }

    try {

      const newInventory = {itemName, itemGroup, inStock, costPerUnit, storageLocation};

      await createInventory(newInventory)
      setAddPopup(false);
      refetch();
      setItemName('');
      setItemGroup('');
      setInStock('');
      setCostPerUnit('');
      setStorageLocation('');
      toast.success('Item added successfully');
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }

  }

  const handleUpdate = async(e)=> {
    e.preventDefault();
    const existingItemName = inventories.find(inventory => inventory.itemName.toLowerCase() === itemName.toLowerCase() && inventory._id !== selectedInventory._id);
    

    if (existingItemName) {
      setError('item name already exists');
      return;
    }
    try {

      if (!selectedInventory._id) {
        console.log('Please select a inventory');
        return;
      }



      const updatedInventory = { 

        id: selectedInventory._id, 
        itemName, 
        itemGroup, 
        inStock, 
        costPerUnit, 
        storageLocation};

      await updateInventory(updatedInventory)
      setEditPopup(false);
      refetch();
      toast.success(
        'Item updated successfully'
      );
      setSelectedInventory(null);
      setItemName('');
      setItemGroup('');
      setInStock('');
      setCostPerUnit('');
      setStorageLocation('');

    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }


  }

  const handleDelete = async()=> {
    try {
     await deleteInventory(selectedInventory._id)
      setDeletePopup(false);
      refetch();
      toast.success('Item removed successfully');
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
  }

  if(isLoading){
    return <Spinner />
  }

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };
  
  const filteredInventories = inventories?.filter((inventory) => {
    const searchLower = search.toLowerCase();
    return (
      (selectedGroup ? inventory.itemGroup === selectedGroup : true) &&
      (searchLower === '' ? true : inventory.itemName.toLowerCase().includes(searchLower))
    );
  });


  const calculateFutureDays = (initialStock) => {
  
    return Math.ceil(initialStock / 50);
  }
  
  return (
    <div>
      <ToastContainer />
      <Header title='Inventory' />
      <SideMenu />
      <div className='p-4 sm:ml-64'>
        <div className='flex flex-row justify-between items-center '>
          <h3>Inventory Management</h3>
          <div className='flex flex-row justify-center items-center w-2/3'>
          <Dropdown
            options={inventories && inventories.map((inventory) => inventory.itemGroup)}
            value={selectedGroup}
            onChange={handleGroupChange}
            width="w-2/3"
            />
            <input type='search' placeholder='Search..' className='mb-2 rounded-lg bg-gray-300 border-none p-2.5' onChange={(e)=> setSearch(e.target.value)}/>
            <button onClick={()=> setAddPopup(true)} className='p-2.5 mb-2 bg-green-400 text-white text-lg rounded-lg ml-6'>
              <span>
                <FontAwesomeIcon icon={faPlus} className='mr-2' />
              </span>
              Add Item
            </button>
          </div>
        </div>
        <div className="relative overflow-x-auto shadow-xl mt-6 sm:rounded-xl">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-gray-700 bg-table-blue dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 text-xl text-center">
                  Item Name
                </th>
                <th scope="col" className="px-6 py-3 text-xl text-center">
                  Item Group
                </th>
                <th scope="col" className="px-6 py-3 text-xl text-center">
                  In Stock
                </th>
                <th scope="col" className="px-6 py-3 text-xl text-center">
                  Cost per unit
                </th>
                <th scope="col" className="px-6 py-3 text-xl text-center">
                  Storage Location
                </th>
                <th scope="col" className="px-6 py-3 text-xl text-center">
                  Future days
                </th>
               
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5">
                    <Spinner />
                  </td>
                </tr>
              ) : (
                filteredInventories && filteredInventories.filter((inventory)=> {
                  const searchLower = search.toLowerCase();
                  return searchLower ===  ''? inventory: inventory.itemName.toLowerCase().includes(searchLower);
                }).map((inventory) => (
                  <tr key={inventory.id} onClick={()=> {
                    setSelectedInventory(inventory);
                    setPopUp(true);
                    }} className="odd:bg-blue-200 cursor-pointer bg-opacity-17 odd:dark:bg-gray-900 even:bg-table-blue even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-lg text-center text-gray-900 whitespace-nowrap dark:text-white">
                      {inventory.itemName}
                    </th>
                    <td className="px-6 py-4 text-lg text-center font-medium">
                      {inventory.itemGroup}
                    </td>
                    <td className={`${inventory.inStock <= 50 ? "text-red-500 font-semibold" : "font-medium "} px-6 py-4 text-center text-lg`}>
                      {`${inventory.inStock} Kg`}
                    </td>
                    <td className="px-6 py-4 text-lg text-center font-medium">
                      {`LKR ${inventory.costPerUnit.toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4 text-lg text-center font-medium">
                      {inventory.storageLocation}
                    </td>
                    <td className={`${inventory.inStock <= 50 ? "text-red-500 font-semibold" : "font-medium"} px-6 py-4 text-lg text-center`}>
                      {`${calculateFutureDays(inventory.inStock)}`}
                    </td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* add inventory */}
        <PopUp trigger={addPopup} setTrigger={setAddPopup} width='w-1/3'>
            <FontAwesomeIcon icon={faXmark} className='cursor-pointer' onClick={() => setAddPopup(false)} />
            <h3 className='text-center mb-8'>Add Inventory</h3>
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
              <div className="mb-3">
                <label htmlFor="itemName" className="block mb-2 text-lg font-medium text-gray-900">Item Name</label>
                <input
                  type="text"
                  id="itemName"
                  name="itemName"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Tomatoe"
                  value={itemName}
                  onChange={(e) => {
                    setItemName(e.target.value);
                    setError('');
                    
                  }}
                  required
                />
              </div>
              {error && <p className='mt-2 text-red-400'>{error}</p>}
              <div className="mb-3">
                <label htmlFor="itemGroup" className="block mb-2 text-lg font-medium text-gray-900">Item Group</label>
                <select
                  
                  id="itemGroup"
                  name="itemGroup"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder='Vegetables'
                  value={itemGroup}
                  onChange={(e) => {
                    setItemGroup(e.target.value);
                   
                  }}
                  required
                >
                  <option className='text-gray-400'>Select a group</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Meat">Meat</option>
                  <option value="Diary">Diary</option>
                  <option value="Dry goods">Dry goods</option>
                  <option value="Sea food">Sea food</option>
                  <option value="Spices">Spices and Condiments</option>
                  <option value="Bake Goods">Bake Goods</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Oils">Oils</option>
                  <option value="Eggs">Eggs</option>
                  
                  
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="in-stock" className="block mb-2 text-lg font-medium text-gray-900">Count In Stock (Kg)</label>
                <input
                  type="number"
                  id="in-stock"
                  name="in-stock"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder='100'
                  value={inStock}
                  onChange={(e) => setInStock(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="cost per unit" className="block mb-2 text-lg font-medium text-gray-900">Cost per unit (LKR)</label>
                <input
                  type="number"
                  id="cost-per-unit"
                  name="cost-per-unit"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder='100.00'
                  value={costPerUnit}
                  onChange={(e) => setCostPerUnit(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="storage-location" className="block mb-2 text-lg font-medium text-gray-900">Storage Location</label>
                <select
                  
                  id="storage-location"
                  name="storage-location"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder='pantry'
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  required
                >
                  
                  <option className='text-gray-400'>Select a location</option>
                  <option value="pantry">Pantry</option>
                  <option value="fridge">Fridge</option>
                  <option value="freezer">Freezer</option>
                </select>
              </div>
              
              <button type="submit" className="w-full bg-black text-white font-medium text-lg rounded-lg py-2.5 my-6">Add Inventory</button>
            </form>
        </PopUp>

          {/* edit supplier */}
          <PopUp trigger={editPopup} setTrigger={setEditPopup} width='w-1/3'>
            <FontAwesomeIcon icon={faXmark} className='cursor-pointer' onClick={() => setEditPopup(false)} />
            <h3 className='text-center mb-8'>Edit Inventory</h3>
            {selectedInventory && (
              <form onSubmit={handleUpdate} className="max-w-sm mx-auto">
                               <div className="mb-3">
                <label htmlFor="itemName" className="block mb-2 text-lg font-medium text-gray-900">Item Name</label>
                <input
                  type="text"
                  id="itemName"
                  name="itemName"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Tomatoe"
                  value={itemName}
                  onChange={(e) => {
                    setItemName(e.target.value);
                    setError('');
                    
                  }}
                 
                />
                 {error && <p className='mt-2 text-red-400'>{error}</p>}
              </div>
             
              <div className="mb-3">
                <label htmlFor="itemGroup" className="block mb-2 text-lg font-medium text-gray-900">Item Group</label>
                <select
                  id="itemGroup"
                  name="itemGroup"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder='Vegetables'
                  value={itemGroup}
                  onChange={(e) => {
                    setItemGroup(e.target.value);
                   
                  }}
               
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Meat">Meat</option>
                  <option value="Diary">Diary</option>
                  <option value="Dry goods">Dry goods</option>
                  <option value="Sea food">Sea food</option>
                  <option value="Spices">Spices and Condiments</option>
                  <option value="Bake Goods">Bake Goods</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Oils">Oils</option>
                  <option value="Eggs">Eggs</option>
                  
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="in-stock" className="block mb-2 text-lg font-medium text-gray-900">Count In Stock (Kg)</label>
                <input
                  type="number"
                  id="in-stock"
                  name="in-stock"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder='100'
                  value={inStock}
                  onChange={(e) => setInStock(e.target.value)}
               
                />
              </div>
              <div className="mb-3">
                <label htmlFor="cost per unit" className="block mb-2 text-lg font-medium text-gray-900">Cost per unit (LKR)</label>
                <input
                  type="number"
                  id="in-stock"
                  name="in-stock"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder='100'
                  value={costPerUnit}
                  onChange={(e) => setCostPerUnit(e.target.value)}
                
                />
              </div>
              <div className="mb-3">
                <label htmlFor="storage-location" className="block mb-2 text-lg font-medium text-gray-900">Storage Location</label>
                <select
                  
                  id="storage-location"
                  name="storage-location"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder='pantry'
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  required
                >
                  <option value="pantry">Pantry</option>
                  <option value="fridge">Fridge</option>
                  <option value="freezer">Freezer</option>
                </select>
              </div>
              
              <button type="submit" className="w-full bg-black text-white font-medium text-lg rounded-lg py-2.5 my-6">Update Inventory</button>
              </form>
            )}
          </PopUp>

           {/* delete supplier */}
           <PopUp trigger={deletePopup} setTrigger={setDeletePopup}>
            <div className="text-center">
                  <p className='text-xl'>Are you sure you want to delete this inventory?</p>
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
  )
}

export default Inventory
