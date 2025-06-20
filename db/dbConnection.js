import { Pool } from "pg";
import {config} from "dotenv";
config();
const user = process.env.PGUSER;
const password = process.env.PGPASS;
const host = process.env.PGHOST;
const port = process.env.PGPORT;
const db = process.env.PGDATABASE;

const connections = new Pool({user,password,host,port,database:db});
connections.connect()
    .then(()=>console.log("CONNECTED"))
    .catch((e)=>console.error(e))
    
export default connections;
