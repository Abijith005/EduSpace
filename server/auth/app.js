import express from "express";
import morgan from "morgan";
import cors from "cors";

import "dotenv/config";
import userAuthRoutes from "./routes/useAuthRoutes.js"
import tokenRoutes from "./routes/tokenRoutes.js"
import sequelize from "./config/sequelize.js";
import cronJob from "./helpers/cronJob.js";

const app = express();
const port = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(
  cors({
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
); 
app.use(morgan("dev"));
sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((err) => {
    console.error("Error synchronizing the database:", err);
  });
  cronJob()

app.use("/api/v1/auth/user",userAuthRoutes); 
app.use('/api/v1/auth/token',tokenRoutes)
app.listen(port, () => {
  console.log(`auth service running in port ${port}`);
}); 