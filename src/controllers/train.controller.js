import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { trainModel } from "../models/train.model.js";

const getTrains = asyncHandler(async (req, res) => {

    const {source, destination} = req.query;

    if(!source || !destination)
    {
        throw new ApiError(400, "Source and Destination are required");
    }

    const trains = await trainModel.find({source:source, destination:destination});


    res.send(new ApiResponse(200, trains, "Trains fetched successfully"));

});

const addTrain = asyncHandler(async (req,res) => {

    const {name,trainNumber,source,destination,departureTime,
    arrivalTime,totalSeats,availableSeats,pricePerSeat,duration} = req.body;

    // console.log(req.body);
    
    if(!(name && trainNumber && source && destination && departureTime && arrivalTime && totalSeats
        && availableSeats && pricePerSeat  && duration
    ))
        throw new ApiError(400,"Not enough train details are provided")
        console.log(duration);
    
    const newTrain =await trainModel.create({name,trainNumber,source,destination,departureTime,
        arrivalTime,totalSeats,availableSeats,pricePerSeat,duration})

    if(!newTrain)
        throw new ApiError(400,"error in creating adding train details")

    res.send(new ApiResponse(200,newTrain,"Train details added successfully"))
        
})

export { 
    getTrains,
    addTrain
 };