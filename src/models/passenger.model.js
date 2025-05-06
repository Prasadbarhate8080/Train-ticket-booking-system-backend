import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  age: { 
    type: Number, 
    required: true 
  },
  gender: { 
    type: String, 
    enum: ["Male", "Female", "Other"], 
    required: true 
  },
  seatPreference: { 
    type: String, 
    enum: ["Window", "Aisle", "Middle"], 
    required: true 
  }
});

export const passengerModel = mongoose.model("Passenger", passengerSchema);
