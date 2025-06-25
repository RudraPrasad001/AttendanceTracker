import connections from "../db/dbConnection.js";

//Check if the user already started work

const didStartWork = async(id)=>{
    try{
        if(typeof Number(id) !=='number') throw new Error("Invalid ID");
        const result = await connections.query(
            `
            SELECT * FROM attendance
            WHERE user_id = ${id} AND DATE(entrytime) = CURRENT_DATE;

            `
        )
        if(!result){throw new Error("Error fetching the row")};
        if(result.rowCount!==0) return true;
        return false;

    }
    catch(e){
        console.log(e);
        return;
    }
}
export default didStartWork;