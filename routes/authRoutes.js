import express from "express";
import authRoutesHandler from "../routesHandler/authRoutesHandler.js";
import {config} from "dotenv";
import getRemainingLeave from "../hooks/getRemainingLeave.js";
config();
const authRouter = express.Router();

//to login
authRouter.post("/login",authRoutesHandler.loginHandler);
//to start work
authRouter.post("/startwork",authRoutesHandler.startWorkHandler);
//to see the remaining weekly leaves available
authRouter.get("/getRemainingLeave/:id",authRoutesHandler.getRemaining);

export default authRouter;