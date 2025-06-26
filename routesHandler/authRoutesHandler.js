import bcrypt, { hash } from "bcrypt";
import getRemainingLeave from "../hooks/getRemainingLeave.js";
import connections from "../db/dbConnection.js";
import {config} from "dotenv";
import didStartWork from "../hooks/getCheckLoggedIn.js";
config();

const loginHandler = async(req,res)=>{
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

       let userResult = await connections.query(`select id,name from users where id=${data.phone}`);
        let user = userResult.rows[0];
       return res.json({message:"welcome user",user:{id:user.id,name:user.name}});
    }
    res.json({message:"Phone or Password Invalid"});}

}

const startWorkHandler = async(req,res)=>{
    const data = req.body;
    if(!data) return res.json({message:"Data not Fetched"});
    if(!data.id)return res.json({message:"id cannot be fetched"});
    console.log(data.id);
    try{
        const isWork = await didStartWork(data.id);
        console.log(isWork);
        if(typeof isWork!=='boolean') throw new Error("Error getting Work");
        if(isWork)
            return res.json({message:"Already Started Work"});

        const result = await connections.query(`insert into attendance(user_id,is_holiday,pay_day,is_present) 
            Values(${data.id},'f','t','t');`);
        if(!result) throw new Error("Cannot Insert into Attendance");
    }
    catch(e){
        console.log(e);
        return res.json({message:"Error starting work"});
    }
    res.json({message:"Successfully started work"});

}
const getRemaining = async(req,res)=>{
    try{
    const id = req.params.id;
    console.log(id);
    if(!id){throw new Error("ID not found")}
    let remainingLeave =await getRemainingLeave(id);
    if(remainingLeave===-1) throw new Error("Invalid ID");
        res.json({remainingLeave});
    }
    catch(e){
        console.error(e.message);
        res.json({error:"Error getting remaining weekly leave"})
    }
}
export default {loginHandler,startWorkHandler,getRemaining};