import express from "express";
import bcrypt from "bcrypt";
import connections from "../db/dbConnection.js";
import {config} from "dotenv";
config();
const authRouter = express.Router();
authRouter.post("/register",async(req,res)=>{
    const data = req.body;
    if(!data){
        return res.json({message:"Error!Cannot get the data"});
    }
    if(!data.name.trim() || !data.email.trim() ||!data.password.trim()){
        return res.json({message:"Fill all the fields"})
    }
    const salt = bcrypt.genSaltSync(Number.parseInt(process.env.bcryptKey));
    const hashedPass = bcrypt.hashSync(data.password, salt);

    try{
    connections.query(`insert into users(name,email,password) values('${data.name}','${data.email}','${hashedPass}')`)
    .then(()=>{console.log("New user Created "+hashedPass);res.json({message:"New user Successfully created"})})
    .catch((e)=>{console.error(e.message);res.json({message:e.message})});
    }
    catch(e){
        console.error(e);
    }

})

authRouter.post("/login",async(req,res)=>{
    const data = req.body;
    if(!data){
        return res.json({message:"Error!Cannot get the data"});
    }
    if(!data.email.trim() ||!data.password.trim()){
        return res.json({message:"Fill all the fields"})
    }
    const result = await connections.query(`Select password from users where email='${data.email}';`);
    const password = result.rows[0]?.password;
    if(!password) res.json({message:"Email or Password Invalid"});
    const isCorrect = bcrypt.compareSync(data.password,password);
    if(isCorrect){
       return res.json({message:"welcome user"});
    }
    res.json({message:"Email or Password Invalid"});
})

authRouter.post("/startwork",async(req,res)=>{
    const data = req.body;
    if(!data) return res.json({message:"Data not Fetched"});
    if(!data.id)return res.json({message:"id cannot be fetched"});
    try{
        const result = await connections.query(`insert into attendance(user_id) Values(${data.id});`);
    }
    catch(e){
        console.log(e);
        return res.json({message:"Error starting work"});
    }
    res.json({message:"Successfully started work"});

})

export default authRouter;