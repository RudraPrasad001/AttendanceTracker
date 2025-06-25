import connections from "../db/dbConnection.js"
const getIds = async()=>{
    try{
    const result = await connections.query(`select id from users;`);
    if(!result) throw new Error("Cannot get the users");
    return result.rows;
    }
    catch (e){
        console.error(e);
    }
    
}
export default getIds;