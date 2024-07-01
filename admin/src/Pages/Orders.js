import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import CustomText from '../components/CustomText';
import '../Pages/style.css';
import SideMenu from '../components/SideMenu';
import { useGetOrdersQuery, useGetOrderDetailsQuery, useDeliverOrderMutation, useCancelOrderMutation } from '../slices/ordersApiSlice';
import PopUp from '../components/PopUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../components/Spinner';

const Orders = () => {
  const [popup, setPopUp] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const { data: order, refetch, isLoading: isOrderLoading, isError } = useGetOrderDetailsQuery(selectedOrderId, {
    skip: !selectedOrderId,
  });

  const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation();
  const [cancelOrder, {isLoading: loadingCancel}] = useCancelOrderMutation();

  useEffect(() => {
    if (selectedOrderId) {
      refetch();
    }
  }, [selectedOrderId, refetch]);

  if (isLoading) 
   return <div className='flex justify-center items-center min-h-screen'>
            <Spinner/>
          </div>;

  if (error) return <h2>{console.log(error)}</h2>;

  const handleRowClick = (orderId) => {
    setSelectedOrderId(orderId);
    setPopUp(true);
  };

 
 
  const delivered = orders?.length > 0 ? orders.filter((order) => order?.isDelivered === true).length : 0;
  const cancelled = orders?.length > 0 ? orders.filter((order) => order?.isCancelled ===true).length : 0;
  const pending = orders?.length > 0 ? orders.filter((order) => order?.isDelivered === false && order?.isCancelled === false).length : 0;
  const total = pending+delivered+cancelled;

  const deliverHandler = async()=> {
     try {
         await deliverOrder(selectedOrderId);
         refetch();
         toast.success('Order marked as delivered');
         setSelectedOrderId(null);
         setPopUp(false);
        
     } catch (error) {
         console.log(error.message);
         toast.error(error.message);
         toast.error(error.message);
         setSelectedOrderId(null);
         setPopUp(false); 
     }
  }

  const cancelOrderHandler = async()=> {
     try {
         await cancelOrder(selectedOrderId);
         refetch();
         toast.success('Order marked as canceled', {
          onClose: () => {
            window.location.reload();
          }
        });
         setSelectedOrderId(null);
         setPopUp(false);
        
     } catch (error) {
         console.log(error.message);
         toast.error(error.message);
         setSelectedOrderId(null);
         setPopUp(false); 
     }

  }

  return (
    <div>
      <ToastContainer />
      <Header title='Orders' />
      <SideMenu />
      <div className="p-4 sm:ml-64">
        <div className="grid grid-cols-1 gap-4 mb-4 text-start">
          <h2>Restaurant Orders</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4 text-center py-4 rounded-3xl shadow-xl container">
          <div className="grid grid-cols-8">
            <div className="col-span-2 custom-text">
              <CustomText title={total} color="#0057FF" fontWeight="500" fontSize="35px" />
              <h4 className='dark:text-white'>Total Orders</h4>
            </div>
            <div className="col-span-2 custom-text">
              <CustomText title={pending} color="#F5CE00" fontWeight="500" fontSize="35px" />
              <h4 className='dark:text-white'>Pending</h4>
            </div>
            <div className="col-span-2 custom-text">
              <CustomText title={delivered} color="#06E302" fontWeight="500" fontSize="35px" />
              <h4 className='dark:text-white'>Delivered</h4>
            </div>
            <div className="col-span-2 custom-text">
              <CustomText title={cancelled} color="#FF3030" fontWeight="500" fontSize="35px" />
              <h4 className='dark:text-white'>Cancelled</h4>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto shadow-xl sm:rounded-xl">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-table-head dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 text-xl">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-xl">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-xl">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-xl">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-xl">
                  Paid
                </th>
                <th scope="col" className="px-6 py-3 text-xl">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="odd:bg-table-row bg-opacity-17 odd:dark:bg-gray-900 even:bg-table-head even:dark:bg-gray-800 border-b dark:border-gray-700 cursor-pointer"
                >
                  <td className="px-6 py-4 text-lg font-medium dark:text-white">{order._id}</td>
                  <td className="px-6 py-4 text-lg font-medium dark:text-white">
                    {order?.user?.name ? order.user.name : 'User is unavailable'}
                  </td>
                  <td className="px-6 py-4 text-lg font-medium dark:text-white">{order?.createdAt.substring(0, 10)}</td>
                  <td className="px-6 py-4 text-lg font-medium dark:text-white">{`LKR ${order?.totalPrice.toFixed(2)}`}</td>
                  <td className="px-6 py-4 text-lg font-medium dark:text-white">
                    {order?.isPaid ? (
                      <h5 className='bg-green-400 p-1.5 rounded-3xl text-gray-900 text-center'>Paid</h5>
                    ) : (
                      <h5 className='bg-red-400 p-1.5 rounded-3xl text-gray-900 text-center'>Not Paid</h5>
                    )}
                  </td>
                  <td className="px-6 py-4 text-lg font-medium">
                  {order?.isCancelled ? (
                      <h5 className='bg-red-400 p-1.5 rounded-3xl text-gray-900 text-center'>Cancelled</h5>
                    ) : order?.isDelivered ? (
                      <h5 className='bg-green-400 p-1.5 rounded-3xl text-gray-900 text-center'>Delivered</h5>
                    ) : (
                      <h5 className='bg-yellow-400 p-1.5 rounded-3xl text-gray-900 text-center'>Pending</h5>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PopUp trigger={popup} setTrigger={setPopUp} width='w-[650px]'>
      <FontAwesomeIcon icon={faXmark} className='cursor-pointer' onClick={() => setPopUp(false)} />
      {isOrderLoading ? (
        "Loading..."
      ) : (
        <div>
          <h3 className="text-3xl text-center font-medium">Order details</h3>

          {/* Total */}
          <div className="flex justify-between items-center mt-6">
            <h3 className="text-2xl font-medium">Total</h3>
            <h3 className="text-2xl font-semibold text-gray-700">LKR {order?.totalPrice.toFixed(2)}</h3>
          </div>
          <hr className="my-6" />

          {/* Items */}
          <h3 className="text-2xl font-medium">Items</h3>
          <div className="w-full h-auto popup-custom-scrollbar">
            {order?.orderItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between mt-8">
                <div className="flex items-center">
                  <div className="flex items-center">
                    <p className="text-gray-700 text-xl bg-gray-200 p-2.5 rounded-lg font-medium">{item.qty}</p>
                    <h3 className="text-xl font-medium ml-3">{item.title}</h3>
                  </div>
                </div>
                <p className="text-gray-500 text-lg mt-1 mr-1">LKR {item.price.toFixed(2)}</p>
              </div>
            ))}
            <hr className="my-4" />
          </div>

          {/* Sub total */}
          <div className="flex justify-between items-center mt-6">
            <h3 className="text-xl font-medium">Sub Total</h3>
            <p className="text-xl font-medium text-gray-600">LKR {order?.itemsPrice.toFixed(2)}</p>
          </div>

          {/* Delivery fee */}
          <div className="flex justify-between items-center mt-2">
            <h3 className="text-xl font-medium">Delivery Fee</h3>
            <p className="text-xl font-medium text-gray-600">LKR {order?.deliveryFee.toFixed(2)}</p>
          </div>

          {/* Service fee */}
          <div className="flex justify-between items-center mt-2">
            <h3 className="text-xl font-medium">Service Fee</h3>
            <p className="text-xl font-medium text-gray-600">LKR {order?.serviceFee.toFixed(2)}</p>
          </div>
          <hr className="my-6 bg-gray-500 h-px" />
          
          {/* Customer details */}
          <h3 className="text-2xl font-medium">Customer details</h3>
          <div className=" mt-6">
            <h3 className="text-xl font-medium">Name</h3>
            <p className="text-xl font-medium text-gray-600">{order?.user?.name}</p>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-medium">Address</h3>
            <p className="text-xl font-medium text-gray-600">
              {order?.deliveryAddress.address1}, {' '}
              {order?.deliveryAddress.address2 === ""
                ? order?.deliveryAddress.city
                : `${order?.deliveryAddress.address2}, ${order?.deliveryAddress.city}`}
            </p>
          </div>
        </div>
      )}

      {order?.isPaid && !order?.isDelivered && (
        <button onClick={deliverHandler} className='w-full p-3 mt-4 bg-green-400 text-gray-900 font-medium rounded-xl text-xl'>Mark as delivered</button>
      )}

      {!order?.isPaid && !order?.isCancelled &&(
        <button onClick={cancelOrderHandler} className='w-full p-3 mt-4 bg-red-400 text-gray-900 font-medium rounded-xl text-xl'>Mark as cancelled</button>
      )}
    </PopUp>
      </div>
    </div>
  );
};

export default Orders;
