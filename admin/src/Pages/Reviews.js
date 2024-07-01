import React, { useState } from 'react';
import Header from '../components/Header';
import CustomText from '../components/CustomText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useGetProductsQuery, useCreateAdminReplyMutation } from '../slices/productApiSlice';
import Spinner from '../components/Spinner';
import SideMenu from '../components/SideMenu';
import { formatDistanceToNow } from 'date-fns';
import ProgressBar from '../components/ProgressBar';
import RatingBar from '../components/RatingBar';
import { BASE_URL } from '../constants';


const Reviews = () => {
  const [search, setSearch] = useState('');
  const [reply, setReply] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);

  const { data: productList, isLoading, error, refetch } = useGetProductsQuery();
  const [createAdminReply] = useCreateAdminReplyMutation();

  const averageRating = productList ? productList.reduce((acc, product) => acc + product.rating, 0) / productList.length : 0;
  const totalReviews = productList ? productList.reduce((acc, product) => acc + product.numReviews, 0) : 0;
  const fiveStarRating = productList ? productList.reduce((acc, product) => acc + product.reviews.filter(review => review.rating === 5).length, 0) : 0;
  const fourStarRating = productList ? productList.reduce((acc, product) => acc + product.reviews.filter(review => review.rating === 4).length, 0) : 0;
  const threeStarRating = productList ? productList.reduce((acc, product) => acc + product.reviews.filter(review => review.rating === 3).length, 0) : 0;
  const twoStarRating = productList ? productList.reduce((acc, product) => acc + product.reviews.filter(review => review.rating === 2).length, 0) : 0;
  const oneStarRating = productList ? productList.reduce((acc, product) => acc + product.reviews.filter(review => review.rating === 1).length, 0) : 0;

  const progress1Value = totalReviews ? (fiveStarRating / totalReviews) * 100 : 0;
  const progress2Value = totalReviews ? (fourStarRating / totalReviews) * 100 : 0;
  const progress3Value = totalReviews ? (threeStarRating / totalReviews) * 100 : 0;
  const progress4Value = totalReviews ? (twoStarRating / totalReviews) * 100 : 0;
  const progress5Value = totalReviews ? (oneStarRating / totalReviews) * 100 : 0;


  return (
    <div>
      <Header title='Reviews' />
      <SideMenu />
      <div className='p-4 sm:ml-64'>
        <div className='grid grid-cols-2 gap-4 mt-4'>
          <div className='w-full h-full total rounded-2xl shadow-lg pb-4 pr-2'>
            <div className='flex flex-row justify-between items-center px-8 py-6'>
              <form className="w-1/2">
                <label htmlFor="default-search" className="mb-2 ml-8 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 ml-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    id="default-search"
                    className="block w-full px-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search..."
                    required
                  />
                </div>
              </form>
            </div>
            <div className='max-h-128 overflow-y-auto custom-scrollbar'>
              {isLoading ? (
                <Spinner />
              ) : (
                <div>
                  {productList && productList.length > 0 ? (
                    <>
                      {productList.map((product) => {
                        const matchingReviews = product.reviews && product.reviews.filter((review) => {
                          const searchLower = search.toLowerCase();
                          return searchLower === '' ? true : review?.name.toLowerCase().includes(searchLower);
                        });

                        return (
                          <div key={product._id}>
                            {matchingReviews && matchingReviews.length > 0 ? (
                              matchingReviews.map((review) => (
                                <ul key={review._id} className='mt-2 w-full ml-4'>
                                  <li>
                                    <div className='col-span-3 pr-4'>
                                      <div className='flex flex-row items-center'>
                                        <div className='col-span-2'>
                                          <h4>{review.name}</h4>
                                          <RatingBar value={review.rating} />
                                        </div>
                                      </div>
                                      <img src={`${BASE_URL}${product.image}`} className="w-20 h-20 mt-6 rounded-lg" alt='product image' />
                                      <p className='mt-4 text-sm mr-16 font-medium'>{product.title}</p>
                                      <p className='mt-4 text-lg mr-16 font-medium'>{review.comment}</p>
                                      <CustomText title={formatDistanceToNow(new Date(review?.createdAt), { addSuffix: true })} color="#8A8A8A" />
                                    </div>
                                  </li>
                                  <hr className="border-t border-gray-400 mr-10 my-10" />
                                </ul>
                              ))
                            ) : null}
                          </div>
                        );
                      })}
                      {productList.every(product => product.reviews.every(review => search.toLowerCase() !== '' && !review.name.toLowerCase().includes(search.toLowerCase()))) && (
                        <div className='flex justify-center items-center mt-52'>
                          <FontAwesomeIcon icon={faMagnifyingGlass} className='w-6 h-6'/>
                          <p className=" text-xl font-medium dark:text-white text-gray-700 mt-3 ml-4">Review not found</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="mt-4 text-lg text-red-500">No products available</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className='w-full h-full total rounded-2xl shadow-lg p-4'>
            <ProgressBar
              value1={fiveStarRating}
              value2={fourStarRating}
              value3={threeStarRating}
              value4={twoStarRating}
              value5={oneStarRating}
              progress1={progress1Value}
              progress2={progress2Value}
              progress3={progress3Value}
              progress4={progress4Value}
              progress5={progress5Value}
            />
            <div className='col ml-4 text-center mt-12'>
              <h2>Average Rating</h2>
              <div className='flex justify-center my-8'>
                <RatingBar value={averageRating} size="text-4xl" />
              </div>
              <h1 className='text-6xl'>{averageRating.toFixed(1)}</h1>
            </div>
            <div className='flex justify-around mt-16 items-center text-center'>
              <div>
                <h4 className='text-gray-300'>Total Reviews</h4>
                <h2 className='text-4xl'>{totalReviews}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reviews;
