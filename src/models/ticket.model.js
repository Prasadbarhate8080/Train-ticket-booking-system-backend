import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    trainId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Train", 
      required: true 
    },
    pnrNumber: { 
      type: String, 
      required: true, 
      unique: true 
    },
    bookingDate: { 
      type: Date, 
      default: Date.now 
    },
    travelDate: { 
      type: Date, 
      required: true 
    },
    passengerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Passenger", 
      required: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    totalPrice: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["confirmed", "cancelled", "pending"], 
      default: "pending" 
    }
  },
  { timestamps: true }
);

export const ticketModel = mongoose.model("Ticket", ticketSchema);
