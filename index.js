import express from "express";
import cors from "cors";
import connections from "./db/dbConnection.js";
import initializeTable from "./db/tableInitialization.js";
import authRouter from "./routes/authRoutes.js";
import {config} from "dotenv";
import adminRouter from "./routes/adminRoutes.js";
import locationRoute from "./routes/locationRoutes.js";
import handleAttendance from "./hooks/useHandleAttendtance.js";
import cron from 'node-cron';

config();
const app = express();
app.use(cors({origin:"*"}));
app.use(express.json());

initializeTable();

app.get('/', async (req, res) => {
  try {
    const result = await connections.query('SELECT 1');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.use("/auth",authRouter);
app.use("/admin",adminRouter);
app.use("/location",locationRoute);

cron.schedule('59 23 * * *',()=>{
  console.log("Checking Attendance Notice");
  handleAttendance();
})
handleAttendance();


app.listen(3000,()=>{console.log("Server is Running on Port 3000")})