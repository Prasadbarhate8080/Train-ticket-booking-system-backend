import { Router } from "express";
import { getTrains } from "../controllers/train.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { isAdmin } from "../middlewares/auth.middlewares.js";
import { addTrain } from "../controllers/train.controller.js";

const trainRoutes = Router();

trainRoutes.route("/gettrains").get(getTrains);

trainRoutes.route("/addtrain").post(verifyJWT,isAdmin,addTrain);

export {trainRoutes}