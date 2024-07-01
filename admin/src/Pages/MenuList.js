import React, { useState, useEffect } from 'react';
import SideMenu from '../components/SideMenu';
import Header from '../components/Header';
import '../Pages/style.css';
import ProductCard from '../components/ProductCard';
import { useGetProductsQuery, useDeleteProductMutation, useUpdateProductMutation, useUploadProductImageMutation, useCreateProductMutation } from '../slices/productApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import PopUp from '../components/PopUp';
import Dropdown from '../components/Dropdown';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Pages/style.css'


const MenuList = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [cuisineCategory, setCuisineCategory] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [err, setErr] = useState('');
  const[search, setSearch]= useState('')

  const [addPopup, setAddPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [updatePopup, setUpdatePopup] = useState(false);


  const [selectedProductId, setSelectedProductId] = useState(null);


  const { data: productList, isLoading, error, refetch } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();

  useEffect(() => {
    if (selectedProductId) {
      const selectedProduct = productList.find(product => product._id === selectedProductId);
      if (selectedProduct) {
        setTitle(selectedProduct.title);
        setDescription(selectedProduct.description);
        setPrice(selectedProduct.price);
        setCategory(selectedProduct.category);
        setCuisineCategory(selectedProduct.cuisineCategory);
        setImage(selectedProduct.image);
        setImagePreview(selectedProduct.image); 
      }
    }
  }, [selectedProductId, productList]);

  const handleDeleteClick = (id) => {
    setSelectedProductId(id);
    setDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(selectedProductId).unwrap();
      refetch();
      setDeletePopup(false);
      toast.success('Item deleted successfully');
      setSelectedProductId(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateClick = (id) => {
    setSelectedProductId(id);
    setUpdatePopup(true);
    
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    e.preventDefault();

    const existingItem = productList.find(product => product.title.toLowerCase() === title.toLowerCase() && product._id != selectedProductId);

    if (existingItem) {
      setErr('Item name already exists');
      return;
    }

    try {
      const updatedProduct = {
        _id: selectedProductId,
        title,
        description,
        price,
        category,
        cuisineCategory,
        image,
      };
      await updateProduct(updatedProduct).unwrap();
      refetch();
      setUpdatePopup(false);
      toast.success('Item updated successfully');
      setSelectedProductId(null); 
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const res = await uploadProductImage(formData).unwrap();
      console.log(res); 
      setImage(res.image); 
      setImagePreview(URL.createObjectURL(file)); 
    } catch (err) {
      console.log(err);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingItem = productList.find(product => product.title.toLowerCase() === title.toLowerCase());

    if (existingItem) {
      setErr('Item name already exists');
      return;
    }

    try {

      const newProduct = {
        title,
        price,
        description,
        cuisineCategory,
        category,
        image,
      };

      await createProduct(
       newProduct
      ).unwrap();
      refetch();
      setAddPopup(false);
      setTitle('');
      setDescription('');
      setPrice(0);
      setCategory('');
      setCuisineCategory('');
      setImage('');
      setImagePreview('');
      toast.success('item added successfully');
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const appertizers = productList?.filter((product) => product.category === 'Appetizers').length;
  const salads = productList?.filter((product) => product.category === 'Salads').length;
  const beverages = productList?.filter((product) => product.category === 'Beverages').length;
  const desserts = productList?.filter((product) => product.category === 'Desserts').length;
  const soups = productList?.filter((product) => product.category === 'Soups').length;
  const pizza = productList?.filter((product) => product.category === 'Pizza').length;
  const burger = productList?.filter((product) => product.category === 'Burger').length;
  const mainDishes = productList?.filter((product) => product.category === 'Main dishes').length;
  const drinks = productList?.filter((product) => product.category === 'Drinks').length;

  return (
    <div>
      <ToastContainer />
      <Header title="Menu List" />
      <SideMenu />
      <div className='p-4 sm:ml-64'>
        <div className='flex flex-row justify-around items-center total mx-16 p-4 rounded-2xl shadow-xl'>
          <div>
            <p className='text-xl'>Appertizers: {appertizers}</p>
            <p className='text-xl'>Salads: {salads}</p>
            <p className='text-xl'>Beverages: {beverages}</p>
          </div>
          <div>
            <p className='text-xl'>Desserts: {desserts}</p>
            <p className='text-xl'>Soups: {soups}</p>
            <p className='text-xl'>Pizza: {pizza}</p>
          </div>
          <div>
            <p className='text-xl'>Burger: {burger}</p>
            <p className='text-xl'>Main dishes: {mainDishes}</p>
            <p className='text-xl'>Drinks: {drinks}</p>
          </div>
        </div>

        <div className='flex flex-row items-center justify-end mt-12 mx-16'>
          <input type='search' placeholder='Search item ...' className='p-2.5 rounded-lg bg-gray-300 border-none mr-4' onChange={(e)=> setSearch(e.target.value)}/>
          <button className='p-2.5 text-white text-lg rounded-xl bg-black' onClick={() => setAddPopup(true)}>
            <span className='mr-2'><FontAwesomeIcon icon={faPlus} /></span>Add New Item
          </button>
        </div>

        {isLoading ? (
          <div className='flex justify-center items-center h-screen'>Loading...</div>
        ) : error ? (
          <div className='flex justify-center items-center h-screen'>
            Error: {error.message || JSON.stringify(error)}
          </div>
        ) : (
          <div className='grid grid-cols-1 mt-12 gap-4 mx-16'>
            {productList && productList.filter((product) => {
                    const searchLower = search.toLowerCase();
                    return searchLower === '' ? product : product?.title.toLowerCase().includes(searchLower);
                  }).map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                image={product.image}
                title={product.title}
                price={`LKR ${product.price.toFixed(2)}`}
                category={product.category}
                cuisine={product.cuisineCategory}
                description={product.description}
                onDelete={() => handleDeleteClick(product._id)}
                onEdit={() => handleUpdateClick(product._id)}
                
              />
            ))}
          </div>
        )}
      </div>
      {/* delete item */}
      <PopUp trigger={deletePopup} setTrigger={setDeletePopup}>
        <div className="text-center">
          <p className='text-xl'>Are you sure you want to delete this product?</p>
          <div className="flex justify-around mt-8">
            <button onClick={handleConfirmDelete} className="w-1/2 bg-black text-white font-medium text-lg rounded-lg py-2.5 mr-4">Delete</button>
            <button onClick={() => setDeletePopup(false)} className="w-1/2 bg-gray-500 text-white font-medium text-lg rounded-lg py-2.5">Cancel</button>
          </div>
        </div>
      </PopUp>

      {/* add new item */}
      <PopUp trigger={addPopup} setTrigger={setAddPopup} width='w-1/3'>
      <FontAwesomeIcon icon={faXmark} className='cursor-pointer' onClick={() => setAddPopup(false)} />
        <h3 className='text-center mb-8'>Add New Item</h3>
        <form onSubmit={handleSubmit}>
          
            <div className='mb-3'>
              <label htmlFor="title" className="block mb-2 text-lg font-medium text-gray-900">Item Name</label>
              <input
                type="text"
                id="title"
                name="title"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Pizza"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErr('');
                }}
                required
              />
              {err && <p className='text-red-500 mt-2'>{err}</p>}
            </div>

            <div className='mb-3'>
              <label htmlFor="description" className="block mb-2 text-lg font-medium text-gray-900">Description</label>
              <textarea
                id="description"
                name="description"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <Dropdown
              label="Cuisine Category"
              options={['Italian', 'Chinese', 'Mexican', 'Indian', 'Thai', 'Sri Lankan']}
              value={cuisineCategory}
              onChange={(e) => setCuisineCategory(e.target.value)}
              width="w-[350px]"
              fontSize="text-sm"
            />

            <div className='mb-3'>
              <label htmlFor="price" className="block mb-2 text-lg font-medium text-gray-900">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className='mb-3'>
              <label htmlFor="image" className="block mb-2 text-lg font-medium text-gray-900">Image</label>
              <label htmlFor='image' className='block cursor-pointer'>
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-40 rounded-lg mb-2" alt="avatar" />
                ) : (
                  <div className="w-full h-40 flex flex-col items-center justify-center rounded-lg mb-2 bg-gray-200 text-gray-700">
                    <svg className="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 font-semibold">Click to upload an image</p>
                        <p className="text-xs text-gray-500">PNG, JPG (MAX. 800x400px)</p>
                  </div>
                )}
                <input
                  type="file"
                  id="image"
                  name="image"
                  className="hidden"
                  onChange={uploadFileHandler}
                />
              </label>
            </div>

            <Dropdown
              label="Category"
              options={['Appetizers', 'Salads', 'Beverages', 'Desserts', 'Soups', 'Pizza', 'Burger', 'Main dishes', 'Drinks']}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              width="w-[350px]"
              fontSize="text-sm"
            />
      
          <button type="submit" className="mt-6 shadow-sm w-full bg-black text-white font-medium text-lg rounded-lg py-2.5 mr-4">
            Add New Item
          </button>
        </form>
      </PopUp>

      {/* update item */}
      <PopUp trigger={updatePopup} setTrigger={setUpdatePopup} width='w-1/3'>
      <FontAwesomeIcon icon={faXmark} className='cursor-pointer' onClick={() => setUpdatePopup(false)} />
        <h3 className='text-center mb-8'>Update Item</h3>
        
          <form onSubmit={handleUpdate}>
          
          <div className='mb-3'>
            <label htmlFor="title" className="block mb-2 text-lg font-medium text-gray-900">Item Name</label>
            <input
              type="text"
              id="title"
              name="title"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Pizza"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErr('');
              }}
              required
            />
            {err && <p className='text-red-500 mt-2'>{err}</p>}
          </div>

          <div className='mb-3'>
            <label htmlFor="description" className="block mb-2 text-lg font-medium text-gray-900">Description</label>
            <textarea
              id="description"
              name="description"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <Dropdown
            label="Cuisine Category"
            options={['Italian', 'Chinese', 'Mexican', 'Indian', 'Thai', 'Sri Lankan']}
            value={cuisineCategory}
            onChange={(e) => setCuisineCategory(e.target.value)}
            width="w-[350px]"
            fontSize="text-sm"
          />

          <div className='mb-3'>
            <label htmlFor="price" className="block mb-2 text-lg font-medium text-gray-900">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className='mb-3'>
            <label htmlFor="image" className="block mb-2 text-lg font-medium text-gray-900">Image</label>
            <label htmlFor='image' className='block cursor-pointer'>
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-40 rounded-lg mb-2" alt="avatar" />
              ) : (
                <div className="w-full h-40 flex flex-col items-center justify-center rounded-lg mb-2 bg-gray-200 text-gray-700">
                  <svg className="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 font-semibold">Click to upload an image</p>
                      <p className="text-xs text-gray-500">PNG, JPG (MAX. 800x400px)</p>
                </div>
              )}
              <input
                type="file"
                id="image"
                name="image"
                className="hidden"
                onChange={uploadFileHandler}
              />
            </label>
          </div>

          <Dropdown
            label="Category"
            options={['Appetizers', 'Salads', 'Beverages', 'Desserts', 'Soups', 'Pizza', 'Burger', 'Main dishes', 'Drinks']}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            width="w-[350px]"
            fontSize="text-sm"
          />
    
        <button type="submit" className="mt-6 shadow-sm w-full bg-black text-white font-medium text-lg rounded-lg py-2.5 mr-4">
          Update Item
        </button>
      </form>
        
      </PopUp>
    </div>
  );
};

export default MenuList;
