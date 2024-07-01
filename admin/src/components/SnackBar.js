import React, { useState } from 'react'
import '../components/SnackBar.css'

const SnackBar = (props) => {


   function showSnackBar(){

    document.querySelector("snackbar").classList.add("show");

    setTimeout(()=> {
        document.querySelector("snackbar").classList.remove("show");
      }, 3000);
   }

  return (
    <div className='fixed bottom-0 left-0 w-full flex justify-center'>
        <div id='snackbar' className='bg-black rounded-lg w-72 h-16 flex items-center justify-center shadow-xl mb-6'>
           <p className='text-center text-white text-lg m-0'>{props.title}</p>
      </div>
    </div>
  )
}

export default SnackBar
