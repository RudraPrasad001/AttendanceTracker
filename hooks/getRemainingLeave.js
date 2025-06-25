import connections from "../db/dbConnection.js";

//To get the remaining weekly leaves available

const getRemainingLeave = async(id)=>{
    try{
    const result = await connections.query(`
            WITH earned AS (
            SELECT COUNT(DISTINCT date_trunc('week', entrytime + INTERVAL '1 day') - INTERVAL '1 day') as weeks
            FROM attendance
            WHERE user_id = ${id}
        ),
        used AS (
            SELECT COUNT(*) as taken FROM attendance
            WHERE user_id = ${id} AND is_holiday = TRUE
        )
        SELECT (earned.weeks - used.taken) AS remaining
        FROM earned, used;
        `)
        return result.rows[0].remaining;
    }
    catch(e){
        console.error(e);
        return -1;
    }

}
export default getRemainingLeave;