import React from 'react'
import {FaStar, FaStarHalfAlt, FaRegStar} from 'react-icons/fa'

const RatingBar = ({value, text, size}) => {
  return (
    <div>
        <div class="rating flex flex-row items-center">
            <span className={`text-yellow-400 m-1 ${size}`}>
                {value >=1 ? <FaStar/> : value >= 0.5? <FaStarHalfAlt/>: <FaRegStar/>}
            </span>
            <span className={`text-yellow-400 m-1 ${size}`}>
                {value >=2 ? <FaStar/> : value >= 1.5? <FaStarHalfAlt/>: <FaRegStar/>}
            </span>
            <span className={`text-yellow-400 m-1 ${size}`}>
                {value >=3 ? <FaStar/> : value >= 2.5? <FaStarHalfAlt/>: <FaRegStar/>}
            </span>
            <span className={`text-yellow-400 m-1 ${size}`}>
                {value >=4 ? <FaStar/> : value >= 3.5? <FaStarHalfAlt/>: <FaRegStar/>}
            </span>
            <span className={`text-yellow-400 m-1 ${size}`}>
                {value >=5 ? <FaStar/> : value >= 4.5? <FaStarHalfAlt/>: <FaRegStar/>}
            </span>
            <span className='rating-text text-lg ml-1.5 text-gray-500'>{text && text}</span>
           
        </div>
    </div>
  )
}

export default RatingBar
