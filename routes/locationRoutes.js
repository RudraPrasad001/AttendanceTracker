import express from "express";
import locationRoutesHandler from "../routesHandler/locationRoutesHandler.js";
import {config} from "dotenv";
config();
const locationRoute = express.Router();

locationRoute.post("/postlocation",locationRoutesHandler.postLocationHandler);

export default locationRoute;