import express, { urlencoded } from 'express';
import { ApiError } from './utils/ApiError.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();
const allowedOrigins  = process.env.CORS_ORIGIN?.split(",") || [];

const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };

app.use(cors(corsOptions))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true,limit: "16kb"}));
app.use(express.static('public'));
app.use(cookieParser());

app.use((err, req, res, next) => {
  console.log("",err);
  
})
//importing routes
import {userRoutes} from './routes/user.routes.js';
import { trainRoutes } from './routes/train.routes.js';
import { ticketRoutes } from './routes/ticket.route.js';

app.use("/api/v1/user",userRoutes);

app.use("/api/v1/train",trainRoutes)

app.use("/api/v1/ticket",ticketRoutes)

export {app}