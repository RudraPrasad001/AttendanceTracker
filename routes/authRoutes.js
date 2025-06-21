import express from "express";
import bcrypt, { hash } from "bcrypt";
import connections from "../db/dbConnection.js";
import {config} from "dotenv";
config();
const authRouter = express.Router();
authRouter.post("/register",async(req,res)=>{
    const data = req.body;
    if(!data){
        return res.json({message:"Error!Cannot get the data"});
    }
    if(!data.name.trim() || !data.phone.trim()||data.phone.length!==10){
        return res.json({message:"Fill all the fields Correctly"});
    }
      //trying to see if the user already exists with the phone number;
    try{
        let query = `select id from users where id=${data.phone}`;
        const result = await connections.query(query);
        if(!result) throw new Error("Something broke");
        if(result.rows[0]?.id){{throw new Error("Id already registered")}}
    }
    catch(e){
        console.error(e.message);
        return;
    }
    const defaultPassword = process.env.DEFAULTPASSWORD;
  
    try{
    connections.query(`insert into users(id,name,password) values('${new Number(data.phone)}','${data.name}','${defaultPassword}')`)
    .then(()=>{console.log("New user Created ");res.json({message:"New user Successfully created"})})
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
    if(!data.phone.trim() ||!data.password.trim()){
        return res.json({message:"Fill all the fields"})
    }
    const result = await connections.query(`Select password from users where id='${data.phone}';`);
    const password = result.rows[0]?.password;
    if(!password) return res.json({message:"Phone or Password Invalid"});
    if(password===process.env.DEFAULTPASSWORD && data.password===password){
        let result = await connections.query(`
                UPDATE users 
                SET allowChangePassword = 'true' 
                WHERE id = '${data.phone}'`);;
        return res.json({message:"Default password detected,Kindly change the password.You can change the password by logging in with the password you wish to change"});
        
    }
    else if(password===process.env.DEFAULTPASSWORD && data.password !== password){
        let result = await connections.query(`select allowChangePassword from users where id=${data.phone}`);
        let canChange = result.rows[0]?.allowchangepassword;
        console.log(canChange);
        if(canChange==='true'){
            const salt =bcrypt.genSaltSync(Number(process.env.bcryptKey));
            const hashed = bcrypt.hashSync(data.password,salt);

            result = await connections.query(`update users 
                SET password='${hashed}',
                allowchangepassword='false'
                 where id='${data.phone}'`);
            return res.json({message:"Changed Password"});
        }
        return res.json({message:"Wrong Password"});
    }
    else{
    const isCorrect = bcrypt.compareSync(data.password,password);
    if(isCorrect){
       return res.json({message:"welcome user"});
    }
    res.json({message:"Phone or Password Invalid"});}

})

authRouter.post("/startwork",async(req,res)=>{
    const data = req.body;
    if(!data) return res.json({message:"Data not Fetched"});
    if(!data.id)return res.json({message:"id cannot be fetched"});
    console.log(data.id);
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