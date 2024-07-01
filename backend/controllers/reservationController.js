
import asyncHandler from "../middleware/asyncHandler.js";
import Reservation from "../models/reservationModel.js";

const getReservations = asyncHandler(async (req, res) => {
    const reservations = await Reservation.find({});
    res.json(reservations);
});



const createReservation = asyncHandler(async (req, res) => {
    console.log('Request Body:', req.body); 

    const { name, email, phone, guests, date, time, message, occation } = req.body;

    const reservation = new Reservation({
        
        name,
        email,
        phone,
        guests,
     
        date,
        time,
      
        message: message || 'N/A',
        occation  
    });

    const createdReservation = await reservation.save();
    res.status(201).json(createdReservation);
});


const deleteReservation = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    
    try{
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        
        await Reservation.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Reservation removed" });
    }catch(error){
        console.error('Error deleting reservation:', error.message);
        res.status(400).json({ message: error.message });
    }
});

const updateReservation = asyncHandler(async(req, res)=> {
    const reservation = await Reservation.findById(req.params.id);
    const { name, guests, tableNumber, date, time, status } = req.body
    if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
    }else{
        reservation.name = name;
        reservation.guests = guests;
        reservation.tableNumber = tableNumber;
        reservation.date = date;
        reservation.time = time;
        reservation.status = status
        const updatedReservation = await reservation.save();
        res.json(updatedReservation);
    }
})



export  {getReservations, createReservation, deleteReservation, updateReservation};