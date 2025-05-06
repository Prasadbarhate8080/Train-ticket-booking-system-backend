import mongoose from 'mongoose';

const trainSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true
    },
    trainNumber: {
        type: String,
        required: true,
        unique: true
    },
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    departureTime: {
        type: String,
        required: true
    },
    arrivalTime: {
        type: String,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
    pricePerSeat: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
    },
    
  },
  { timestamps: true }
);

export const trainModel = mongoose.model('Train', trainSchema);