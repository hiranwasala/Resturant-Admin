import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    guests:{
        type: Number,
        required: true
        
    },
    tableNumber: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        required: true,
        default: 'Upcoming'
    },
    date: {
        type: Date,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    message: {
        type: String,
    },
    occation: {
        type: String,
        enum: ['Birthday', 'Anniversary', 'Date night', 'Business meal', 'Celebration'],
    }

} , {
    timestamps: true
});


const Reservation = mongoose.model("Reservation",reservationSchema);

export default Reservation;