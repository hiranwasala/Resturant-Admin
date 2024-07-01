import React from 'react'

const ProgressBar = ({value1,value2,value3,value4,value5,progress1, progress2, progress3, progress4 , progress5}) => {
  return (
    <div>
      <div className='rating mx-4'>
      
        <div className='flex  items-center mb-2'>
        <div className=" text-xl font-medium dark:text-white">5</div>
        <div className="w-full h-4  bg-gray-200 rounded-full dark:bg-gray-700 ml-4">
          <div className="h-4 bg-blue-600 rounded-full dark:bg-blue-500" style={{ width: `${progress1}%` }}></div>
        </div>
        <div className="text-xl font-medium dark:text-white ml-3">{`(${value1})`}</div>
        </div>
       

        <div className='flex items-center mb-2'>
        <div className=" text-xl font-medium dark:text-white">4</div>
        <div className="w-full h-4  bg-gray-200 rounded-full dark:bg-gray-700 ml-4">
          <div className="h-4 bg-blue-600 rounded-full dark:bg-blue-500" style={{ width: `${progress2}%` }}></div>
        </div>
        <div className="text-xl font-medium dark:text-white ml-3">{`(${value2})`}</div>
        </div>

        <div className='flex items-center mb-2'>
        <div className=" text-xl font-medium dark:text-white">3</div>
        <div className="w-full h-4  bg-gray-200 rounded-full dark:bg-gray-700 ml-4">
          <div className="h-4 bg-blue-600 rounded-full dark:bg-blue-500" style={{ width: `${progress3}%`}}></div>
        </div>
        <div className="text-xl font-medium dark:text-white ml-3">{`(${value3})`}</div>
        </div>

        <div className='flex items-center mb-2'>
        <div className=" text-xl font-medium dark:text-white">2</div>
        <div className="w-full h-4  bg-gray-200 rounded-full dark:bg-gray-700 ml-4">
          <div className="h-4 bg-blue-600 rounded-full dark:bg-blue-500" style={{ width: `${progress4}%`}}></div>
        </div>
        <div className="text-xl font-medium dark:text-white ml-3">{`(${value4})`}</div>
        </div>

        <div className='flex items-center mb-2'>
        <div className=" text-xl font-medium dark:text-white">1</div>
        <div className="w-full h-4  bg-gray-200 rounded-full dark:bg-gray-700 ml-4">
          <div className="h-4 bg-blue-600 rounded-full dark:bg-blue-500" style={{ width: `${progress5}%`}}></div>
        </div>
        <div className="text-xl font-medium dark:text-white ml-3">{`(${value5})`}</div>
        </div>
         </div>

    </div>
  )
}

export default ProgressBar
