import React, {useState} from 'react';
import DotsDropdown from './DotsDropdown';
import '../Pages/style.css'

const ProductCard = ({ id, image, title, price, category, cuisine, ingredients, description, onDelete, onEdit }) => {

  const [dropdownHidden, setDropdownHidden] = useState(true);


  return (
    <div className='col total w-full h-64 rounded-2xl shadow-xl flex flex-row justify-between p-2 items-center'>
      <img src={image} alt={title} className='w-80 h-full rounded-2xl ' />
      <div className='w-full mx-16'>
      <div className='flex flex-row justify-between items-center'>
        <h2 className='text-start mt-0 '>{title}</h2>
        <h3 className='ml-3 mt-3 font-bold'>{price}</h3>
      
      </div>
      <div className='flex flex-row items-center justify-between mt-3'>
        
        <div className='col'>
          <p className='text-lg'>Category: {`${category}`}</p>
          <p className='text-lg'>Cuisine: {`${cuisine}`}</p>
          <p className='text-lg'>Description: {`${description}`}</p>
        </div>
        
        
      </div>
      
      </div>
      <DotsDropdown hidden={dropdownHidden} setHidden={setDropdownHidden}>
          <li>
            <button onClick={()=>{
              setDropdownHidden(!dropdownHidden);
              onEdit(id);
              }} className="block py-2 font-medium text-lg text-decoration-none text-gray-700">
              Edit
            </button>
            
          </li>
          <li>
            <button onClick={() =>{ 
              setDropdownHidden(!dropdownHidden);
              onDelete(id);
              }} className="block py-2 font-medium text-lg text-decoration-none text-gray-700">
              Delete
            </button>
          </li>
      </DotsDropdown>
      
    </div>
  );
};

export default ProductCard;
