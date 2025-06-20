import fs from 'fs';
import connections from './dbConnection.js';
const initializeTable = ()=>{
try{
    const userSql = fs.readFileSync('./schema/users.sql').toString();
    connections.query(userSql)
     .then(() => console.log('✅ User file executed'))
    .catch(err => console.error('❌ Error executing SQL file:', err));

    const attendanceSql = fs.readFileSync('./schema/attendance.sql').toString();
    connections.query(attendanceSql)
     .then(() => console.log('✅ Attendance file executed'))
    .catch(err => console.error('❌ Error executing SQL file:', err))
}
catch(e){
    console.error(e);
}}
export default initializeTable;