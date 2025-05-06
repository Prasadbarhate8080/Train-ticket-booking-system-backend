import { asyncHandler } from "../utils/asyncHandler.js";
import { ticketModel } from "../models/ticket.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {userModel} from "../models/user.model.js";
import { trainModel } from "../models/train.model.js";
import { generatePNR } from "../utils/generatePNR.js";
import { passengerModel } from "../models/passenger.model.js";

const bookTicket = asyncHandler(async (req, res) => {
    const { trainNumber, passengerData, travelDate } = req.body;  
    const seatsBooked = 1;  
    const userId = req.user._id;

    const user = await userModel.findById(userId);
    const train = await trainModel.findOne({ trainNumber: trainNumber });

    if (!user || !train) 
        throw new ApiError(404, "Train or user not found");

    if (train.availableSeats < seatsBooked) 
        throw new ApiError(400, "Seats are not available");

    const passenger = await passengerModel.create({
        name: passengerData.name,
        age: passengerData.age,
        gender: passengerData.gender,
        seatPreference: passengerData.seatPreference
    });

    if (!passenger) 
        throw new ApiError(400, "Error in creating passenger");

    const ticket = await ticketModel.create({
        userId: userId,
        trainId: train._id,
        pnrNumber: generatePNR(),
        travelDate: travelDate,
        passengerId: passenger._id,
        email: user.email, 
        phone: user.phone,  
        totalPrice: seatsBooked * train.pricePerSeat,
        status: "confirmed"
    }); 

    console.log(ticket);
    
    if (!ticket) 
        throw new ApiError(400, "Error in creating ticket");

    train.availableSeats -= seatsBooked;
    await train.save();

    res.status(200).json(new ApiResponse(200, ticket, "Ticket Booked Successfully"));
});

const getTicket = asyncHandler(async (req, res) => {
    const { id } = req.query; 

    if (!id) {
        return res.status(400).json({ error: "Ticket ID is required" });
    }

    const ticket = await ticketModel.findById(id)
    .populate({path: "userId", select: "-refreshToken"})
    .populate("trainId")
    .populate("passengerId")



    

    if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
    }

    res.status(200).json(ticket);
});


const getTickets = asyncHandler(async (req,res) => {
    const userId = req.user._id;

    const tickets = await ticketModel.find({userId: userId})
    .populate({path: "userId", select: "-refreshToken"})
    .populate("trainId")
    .populate("passengerId")

    res.status(200)
    .json(new ApiResponse(200,tickets,"Ticket send successFully"))
})

export {
    bookTicket,
    getTickets,
    getTicket
};