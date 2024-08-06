import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import paypalRoutes from './routes/paypalRoutes.js'
import razorPayRoutes from './routes/razorPayRoutes.js'
import dbConnect from "./config/dbConnect.js";
const app = express();
const port = process.env.PORT;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:4200",'http://192.168.20.14:4200'],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

dbConnect()

app.use("/api/v1/payment/paypal",paypalRoutes);
app.use("/api/v1/payment/razorpay",razorPayRoutes);

app.listen(port, () => {
  console.log(`payment service running in port ${port}`);
});
