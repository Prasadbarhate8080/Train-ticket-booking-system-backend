import { Router } from "express";
import { bookTicket } from "../controllers/ticket.controller.js";
import { getTickets } from "../controllers/ticket.controller.js";
import { getTicket } from "../controllers/ticket.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const ticketRoutes = Router();

ticketRoutes.route("/bookticket").post(verifyJWT,bookTicket)

ticketRoutes.route("/gettickets").get(verifyJWT,getTickets)


ticketRoutes.route("/getticket").get(verifyJWT,getTicket)

export {ticketRoutes}