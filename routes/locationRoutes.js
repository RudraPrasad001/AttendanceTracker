import express from "express";
import connections from "../db/dbConnection.js";
import {config} from "dotenv";
config();
const locationRoute = express.Router();

locationRoute.post("/postlocation",async (req,res)=>{
    try{
    if(!req.body) throw new Error("No body found");
    const {user_id,longitude,latitude} = req.body;
    console.log(user_id);
    console.log(longitude);
    console.log(latitude);
    if(!longitude || !latitude || !user_id){
        throw new Error("Location not found");
    }
    const result = await connections.query(`insert into location(user_id,longitude,latitude) VALUES(${user_id},${longitude},${latitude})`);
    if(!result){
        throw new Error("Query not Processed,Error");
    }
    res.json({message:"Successfully stored in the database"});
    console.log("Success");
    }
    catch(e){
        console.error("Error caught: "+e);
        res.json({message:e.message})
    }
})

export default locationRoute;