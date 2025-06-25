import express from "express";
import {config} from "dotenv";
import adminRoutesHandler from "../routesHandler/adminRoutesHandler.js";
config();
const adminRouter = express.Router();

adminRouter.post("/register",adminRoutesHandler.registerHandler)
adminRouter.get("/getlocation/:id",adminRoutesHandler.getLocationHandler);
export default adminRouter;