import connections from "../db/dbConnection.js";
import {config} from "dotenv";
config();

const registerHandler = async(req,res)=>{
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

}
const getLocationHandler = async(req,res)=>{
    try{
    const id = req.params.id;
    const result = await connections.query(`SELECT DISTINCT ON (user_id)
*
FROM location
WHERE user_id = ${id}
ORDER BY user_id, locatedtime DESC;

`)
        if(result.rows[0]){ 
            return res.json({isValid:true,...result.rows[0]})
        }
        else{
            return res.json({isValid:false,error:"Could not get location"})
        }
    }
    catch(e){
        console.error("Error Caught:"+e);
        res.json(e.message);
    }
}
export default {registerHandler,getLocationHandler};