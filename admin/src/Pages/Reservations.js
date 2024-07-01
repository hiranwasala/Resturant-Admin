import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CustomText from '../components/CustomText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import CustomContainer from '../components/CustomContainer';
import SideMenu from '../components/SideMenu';
import PopUp from '../components/PopUp';
import { formatDistanceToNow } from 'date-fns';
import Dropdown from '../components/Dropdown';
import { useGetReservationsQuery, useDeleteReservationMutation, useUpdateReservationMutation } from '../slices/reservationApiSlice';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../components/Spinner';



const Reservations = () => {

  const [popup, setPopUp] = useState(false);
  const [editReservationPopup, setEditReservationPopUp] = useState(false);
  const [deleteReservationPopup, setDeleteReservationPopUp] = useState(false);
  const [reservations, setReservations] = useState([]);

  const [selectedFloor, setSelectedFloor] = useState('1st floor');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const { data: reservationsData,refetch, isLoading } = useGetReservationsQuery();
  const [deleteReservation, {isLoading: loadingDelete}] = useDeleteReservationMutation();
  const [updateReservation, {isLoading: loadingUpdate}] = useUpdateReservationMutation();

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('');
  const [tableNumber, setTableNumber] = useState(0);
  const [status, setStatus] = useState('Upcoming');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (reservationsData) {
      setReservations(reservationsData);

    }
  }, [reservationsData]);

  useEffect(()=> {
    if (selectedReservation) {
      setName(selectedReservation.name);
      setDate(selectedReservation.date);
      setTime(selectedReservation.time);
      setGuests(selectedReservation.guests);
      setTableNumber(selectedReservation.tableNumber);
      setStatus(selectedReservation.status);
    }
  }, [selectedReservation])

  if(isLoading) {
    return <div className='flex justify-center items-center min-h-screen'>
             <Spinner/>
          </div>;
  }

  
 
  const handleDeleteReservation = async () => {

    try {
      await deleteReservation(selectedReservation._id);
      refetch();
      setDeleteReservationPopUp(false);
      toast.success('Reservation deleted successfully')
    } catch (error) {
      console.log(error);
      toast.error(error.message);  
    }
  }

  const handleEditReservation = async (e) => {
    e.preventDefault();
    try {
      if (!selectedReservation) {
        toast.error('No reservation selected');
        return;
      }
      await updateReservation({ _id: selectedReservation._id, name, guests, tableNumber, date, time, status });
      refetch();
      setEditReservationPopUp(false);
      toast.success('Reservation updated successfully');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  

  const seated = reservationsData.filter((reservation) => reservation.status === 'Seated').map((table) => table.tableNumber);
  const upComing = reservationsData.filter((reservation) => reservation.status === 'Upcoming').map((table) => table.tableNumber);
  const Cancelled = reservationsData.filter((reservation) => reservation.status === 'Cancelled').length;

  const tableNumbers = {
    '1st floor': [1, 8, 2, 7, 3, 6, 4, 5],
    '2nd floor': [9, 16, 10, 15, 11, 14, 12, 13],
    '3rd floor': [17, 24, 18, 23, 19, 22, 20, 21],
    '4th floor': [25, 32, 26, 31, 27, 30, 28, 29]
  };

  const defaultTColor = 'rgba(185, 143, 143, 0.54)';
  const seatedTColor = 'rgba(20, 255, 0, 0.34)';
  const upComingTColor = 'rgba(255, 199, 0, 0.33)';
  const defaultCColor = 'rgba(218, 197, 197, 0.37)';
  const seatedCColor = 'rgba(0, 250, 70, 0.26)';
  const upComingCColor = 'rgba(250, 240, 0, 0.27)';

  const renderTableContainer = (tableNumber, index) => {
    const isSeated = seated.includes(tableNumber);
    const isUpcoming = upComing.includes(tableNumber);

    const backgroundColor = isSeated ? seatedTColor : (isUpcoming ? upComingTColor : defaultTColor);
    const circleColor = isSeated ? seatedCColor : (isUpcoming ? upComingCColor : defaultCColor);

    return (
      <div className='col mb-12' key={index}>
        <CustomContainer width="224" height="128" borderRadius="20" backgroundColor={backgroundColor} position="relative" boxShadow="0 20px 25px -5px rgb(0 0 0 / 0.1)">
          <CustomContainer width="64" height="64" borderRadius="32" backgroundColor={circleColor} position="absolute" top="75%" left="60%" boxShadow="0 20px 25px -5px rgb(0 0 0 / 0.1)" />
          <CustomContainer width="64" height="64" borderRadius="32" backgroundColor={circleColor} position="absolute" top="75%" left="10%" boxShadow="0 20px 25px -5px rgb(0 0 0 / 0.1)" />
          <CustomContainer width="64" height="64" borderRadius="32" backgroundColor={circleColor} position="absolute" bottom="75%" left="60%" boxShadow="0 20px 25px -5px rgb(0 0 0 / 0.1)" />
          <CustomContainer width="64" height="64" borderRadius="32" backgroundColor={circleColor} position="absolute" bottom="75%" left="10%" boxShadow="0 20px 25px -5px rgb(0 0 0 / 0.1)" />
          <h1 className='absolute left-1/2'>{tableNumber}</h1>
        </CustomContainer>
      </div>
    );
  };

  const handleFloorChange = (selectedValue) => {
    setSelectedFloor(selectedValue);
  };

  const floorTableNumbers = tableNumbers[selectedFloor] || [];
  
  const formattedDate = selectedReservation?.date 
    ? new Date(selectedReservation.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).replace(/,/g, '') 
    : '';



  
const getReservedTables = () => {
  return reservationsData
    .filter(reservation => reservation.status === "Upcoming" || reservation.status === "Seated")
    .map(reservation => reservation.tableNumber);
};

const reservedTables = getReservedTables();

const convertTo12HourFormat = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const adjustedHour = hour % 12 || 12; 
  return `${adjustedHour}:${minutes} ${ampm}`;
};

  

  return (
    <div>
      <ToastContainer/>
      <Header title='Reservations' />
      <SideMenu />
      <div className='p-4 sm:ml-64'>
        <div className='flex flex-row py-8 px-4 items-start'>
          <div className='grid grid-cols-2 gap-16'>
            {floorTableNumbers.map((tableNumber, index) => renderTableContainer(tableNumber, index))}
          </div>
          <div className='col pl-16'>
          

            <div className='col total w-full mt-8 pb-4 pl-4 pt-2 pr-4 rounded-2xl h-auto shadow-xl'>
              <div className='flex flex-row items-center justify-between'>
              <form className="w-1/2 mb-4 mt-3 mr-8">
                <label htmlFor="default-search" className="mb-2 ml-8 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 ml-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                  </div>
                  <input type="search" id="default-search" className="block w-full px-10 py-2.5 text-lg text-gray-900 border border-gray-300 rounded-xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." required 
                   onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </form>
              <Dropdown
                options={['1st floor', '2nd floor', '3rd floor', '4th floor']}
                onChange={(e) => handleFloorChange(e.target.value)}
                darkColor="bg-gray-700"
                darkTextColor="text-white"
                width="w-full"
              />
              </div>
              

              <CustomText title={`Seated ${seated.length}`} color="rgb(74 222 128)" fontWeight="600" fontSize="22px" />
              <div className='review-list  max-h-128 overflow-y-auto custom-scrollbar '>
              <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700 mt-4">
                {
                  reservationsData?.filter((reservation) => {
                    const searchLower = search.toLowerCase();
                    return reservation.status === "Seated" && (searchLower === '' || reservation?.name.toLowerCase().includes(searchLower));
                  }).map((reservation, index) => (
                    <li className="pb-3 sm:pb-4 cursor-pointer shadow-side-menu-hover"  
                        onClick={() => setDeleteReservationPopUp(true)} key={index}>
                      <div className="flex items-center text-center rtl:space-x-reverse">
                        <div className="flex-shrink-0">
                        <h5>{convertTo12HourFormat(reservation?.time)}</h5>

                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="my-0">{reservation?.tableNumber}</h4>
                          <p className='text-md font-medium text-reserve-text'>Table</p>
                        </div>
                        <div className="col">
                          <h5 className='my-0 py-0'>{reservation?.name}</h5>
                          <p className='font-medium text-reserve-text'>{`${reservation?.guests} Guests`}</p>
                        </div>
                      </div>
                    </li>
                  ))
                }
              </ul>

              </div>
              
              <CustomText title={`Upcoming ${upComing.length}`} color="#FFC700" fontWeight="600" fontSize="22px" />
                <div className='review-list max-h-96 overflow-y-auto custom-scrollbar ' >
                  <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700 mt-4">
                    {reservationsData?.filter((reservation) => {
                      const searchLower = search.toLowerCase();
                     return  reservation.status === "Upcoming" && (searchLower === '' || reservation?.name.toLowerCase().includes(searchLower));

                    }).map((reservation, index) => (
                      <li className="pb-3 sm:pb-4 cursor-pointer shadow-side-menu-hover"
                        onClick={() => { setSelectedReservation(reservation); setPopUp(true); }} key={index}>
                        <div className="flex items-center text-center rtl:space-x-reverse">
                          <div className="flex-shrink-0">
                          <h5>{convertTo12HourFormat(reservation?.time)}</h5>

                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="my-0">{reservation?.tableNumber}</h4>
                            <p className='text-md font-medium text-reserve-text'>Table</p>
                          </div>
                          <div className="col">
                            <h5 className='my-0 py-0'>{reservation?.name}</h5>
                            <p className='font-medium text-reserve-text'>{`${reservation?.guests} Guests`}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>



              <CustomText title={`Cancelled ${Cancelled}`} color="rgb(248 113 113)" fontWeight="600" fontSize="22px" />
              <div className='review-list max-h-128 overflow-y-auto custom-scrollbar'>
                <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700 mt-4">
                  {
                    reservationsData?.filter((reservation) => reservation.status === "Cancelled").map((reservation, index) => (
                      <li className="pb-3 sm:pb-4 cursor-pointer shadow-side-menu-hover"  
                       onClick={() => setDeleteReservationPopUp(true)} key={index}>
                        <div className="flex items-center text-center rtl:space-x-reverse">
                          <div className="flex-shrink-0">
                          <h5>{convertTo12HourFormat(reservation?.time)}</h5>

                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="my-0">{reservation?.tableNumber}</h4>
                            <p className='text-md font-medium text-reserve-text'>Table</p>
                          </div>
                          <div className="col">
                            <h5 className='my-0 py-0'>{reservation?.name}</h5>
                            <p className='font-medium text-reserve-text'>{`${reservation?.guests} Guests`}</p>
                          </div>
                          
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* edit reservation */}
      <PopUp trigger={editReservationPopup} setTrigger={setEditReservationPopUp} width='w-2/5'>
        <FontAwesomeIcon icon={faXmark} className='cursor-pointer' onClick={() => setEditReservationPopUp(false)} />
        <h3 className='text-center mb-6'>Edit Reservation</h3>
        {selectedReservation ? (
          <form onSubmit={handleEditReservation} >
          <div className="mb-3">
            <label htmlFor="name" className="block mb-2 text-lg font-medium text-gray-900">Customer Name</label>
            <input 
            type="text" 
            id="name" 
            name="name" 
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder="John Steve" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="table_number" className="block mb-2 text-lg font-medium text-gray-900">Table Number</label>
            <select 
            id="table_number" 
            name="table_number" 
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder='5' 
            value={tableNumber} 
            onChange={(e) => setTableNumber(e.target.value)}>
              <option className='text-gray-400'>Select Table</option>
              {[...Array(32)].map((_, index) => (
                <option key={index} value={index + 1} disabled={reservedTables.includes(index + 1)}>
                  {index + 1} {reservedTables.includes(index + 1) && '   (Already reserved)'}
                </option>
              ))}
              
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="guests" className="block mb-2 text-lg font-medium text-gray-900">Number of guests</label>
            <select 
            id="number_of_guests" 
            name="number_of_guests" 
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder='5' 
            value={guests} 
            onChange={(e) => setGuests(e.target.value)}>
              
              {[...Array(20)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
                
              ))}
             
              
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="date" className="block mb-2 text-lg font-medium text-gray-900">Date</label>
            <input 
            type="date" 
            id="date" 
            name="date" 
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder='2024/10/30' 
            value={date.substring(0, 10)} 
            onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="time" className="block mb-2 text-lg font-medium text-gray-900">Time</label>
            <input 
            type="time" 
            id="time" 
            name="time" 
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder='10.30' 
            value={time} 
            onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="block mb-2 text-lg font-medium text-gray-900">Status</label>
            <select 
           
            id="status" 
            name="status" 
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder='10.30' 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}>
              <option className='text-gray-400'>Select Status</option>
              <option>Seated</option>
              <option >Cancelled</option>
            </select>
          </div>
          
          <button type="submit" className="w-full bg-black text-white font-medium text-lg rounded-lg py-2.5 mr-4 mt-3">Update Reservation</button>
  
        </form>
        ):(null)}
        
      </PopUp>
      
      {/* delete reservation */}
      <PopUp trigger={deleteReservationPopup} setTrigger={setDeleteReservationPopUp}>
        <FontAwesomeIcon icon={faXmark} className='cursor-pointer' onClick={() => setDeleteReservationPopUp(false)} />
        <h3 className='text-center mb-8'>Delete Reservation</h3>
        <h5 className='text-center'>Are you sure you want to delete this reservation?</h5>
        <div className="mb-3 flex justify-around mt-8">
        <button
                  onClick={handleDeleteReservation}
                  className="w-1/2 bg-black text-white font-medium text-xl rounded-2xl p-2.5 mr-4"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteReservationPopUp(false)}
                  className="w-1/2 bg-gray-200 text-gray-900 font-medium text-lg rounded-2xl p-2.5"
                >
                  Cancel
                </button>

        </div>
        
      </PopUp>
      
      {/* select edit or delete */}
      <PopUp trigger={popup} setTrigger={setPopUp} width="w-2/5">
        <FontAwesomeIcon icon={faXmark} className='cursor-pointer' onClick={() => setPopUp(false)} />
        <h3 className='text-center mb-8'>Reservation Details</h3>
        {selectedReservation ? (
          <div className=" customer-details w-full">
            <div className="flex flex-row items-center justify-between my-7">
              <h5 className='text-gray-500'>Name</h5>
              <h5>{selectedReservation?.name}</h5>
            </div>
            <div className="flex flex-row items-center justify-between my-7">
              <h5 className='text-gray-500'>Phone</h5>
              <h5>{selectedReservation?.phone}</h5>
            </div>
            <div className="flex flex-row items-center justify-between my-7">
              <h5 className='text-gray-500'>Email</h5>
              <h5>{selectedReservation?.email}</h5>
            </div>
            <div className="flex flex-row items-center justify-between my-7">
              <h5 className='text-gray-500'>Guests</h5>
              <h5>{`${selectedReservation?.guests} guests`}</h5>
            </div>
            <div className="flex flex-row items-center justify-between my-7">
              <h5 className='text-gray-500'>Date</h5>
              <h5>{formattedDate}</h5>
            </div>
            <div className="flex flex-row items-center justify-between my-7">
              <h5 className='text-gray-500'>Time</h5>
              <h5>{convertTo12HourFormat(selectedReservation?.time)}</h5>
            </div>
            <div className="flex flex-row items-center justify-between my-7">
              <h5 className='text-gray-500'>Message</h5>
              <h5>{selectedReservation?.message}</h5>
            </div>
            <div className="flex flex-row items-center justify-between my-7">
              <h5 className='text-gray-500'>Occation</h5>
              <h5>{selectedReservation?.occation}</h5>
            </div>
            <div className="flex flex-row items-center justify-between my-7">
              <h5 className='text-gray-500'>Placed on</h5>
              <h5>{formatDistanceToNow(new Date(selectedReservation?.createdAt), { addSuffix: true })}</h5>
            </div>
            <div className="text-center">
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => { setDeleteReservationPopUp(true); setPopUp(false); }}
                  className="w-1/2 bg-black text-white font-medium text-xl rounded-2xl p-2.5 mr-4"
                >
                  Delete
                </button>
                <button
                  onClick={() => { setEditReservationPopUp(true); setPopUp(false); }}
                  className="w-1/2 bg-gray-200 text-gray-900 font-medium text-lg rounded-2xl p-2.5"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>No reservation selected</p>
        )}
      </PopUp>

    </div>
  );
}

export default Reservations;
