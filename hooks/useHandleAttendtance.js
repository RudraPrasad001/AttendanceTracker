import connections from "../db/dbConnection.js"
import didStartWork from "./getCheckLoggedIn.js";
import getIds from "./getIdFromAllUsers.js"
import getRemainingLeave from "./getRemainingLeave.js";
const handleAttendance = async()=>{
        const users = await getIds();
        users.forEach(async (user)=>{
            const id = user.id;
            const didStart = await didStartWork(id);
            if(!didStart){
                const leaveAvailable = await getRemainingLeave(id);
                if(leaveAvailable>0){
                    const result = await connections.query(`insert into attendance(user_id,is_holiday,pay_day,is_present) Values(${id},'t','t','f');`);
                    console.log("Tallied Available Leave with today's absence,Marked as present");
                }
                else{
                    const result = await connections.query(`insert into attendance(user_id,is_holiday,pay_day,is_present) Values(${id},'f','f','f');`);
                    console.log("No remaining leave,Marked as absent");
                }
            }
            else{
            console.log("Already logged in");
            }
        })
}
export default handleAttendance;