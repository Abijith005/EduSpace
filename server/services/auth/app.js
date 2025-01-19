import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config.js";
import userAuthRoutes from "./routes/userAuthRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import socialAuthRoutes from "./routes/socialAuth.js";
import cronJob from "./helpers/cronJob.js";
import dbConnect from "./config/dbConnect.js";
import startRPCServer from "./rabbitmq/services/rpcServer.js";
import {
  getOtp,
  getUsersByIds,
  updateByIds,
  userStatus,
} from "./controllers/dataController.js";
import { consumeUserUpdate } from "./rabbitmq/consumers/userUpdateConsumer.js";
import { consumeOtpCreation } from "./rabbitmq/consumers/createOtpConsumer.js";

const app = express();
const port = process.env.PORT;

dbConnect();
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:4200", "http://192.168.20.14:4200"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

cronJob();

app.use("/api/v1/auth/user", userAuthRoutes);
app.use("/api/v1/auth/socialAuth", socialAuthRoutes);
app.use("/api/v1/auth/token", tokenRoutes);

startRPCServer("authQueue", getUsersByIds);
startRPCServer("updateAuthQueue", updateByIds);
startRPCServer("otpQueue", getOtp);
startRPCServer("statusQueue", userStatus);
consumeUserUpdate();
consumeOtpCreation();

app.listen(port, () => {
  console.log(`auth service running in port ${port}`);
});
