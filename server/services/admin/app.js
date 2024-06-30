import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import dbConnect from "./config/dbConnect.js";

const app = express();
const port = process.env.PORT;
 
dbConnect()
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);


app.use("/api/v1/admin/categories",categoryRoutes);
app.listen(port, () => {
  console.log(`auth service running in port ${port}`);
});
