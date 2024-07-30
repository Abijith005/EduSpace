import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import consumeCommunityTask from "./rabbitmq/consumers/communityConsumer.js";
import dbConnect from "./config/dbConnect.js";
import consumeMemberTask from "./rabbitmq/consumers/memberConsumer.js";
import communityRoutes from "./routes/communityRoutes.js";
import http from "http";
import { Server } from "socket.io";
import socket from "./socket/socket.js";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const port = process.env.PORT || 5070;
dbConnect();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

consumeCommunityTask();
consumeMemberTask();

app.use("/api/v1/chat/communities", communityRoutes);

socket(io)



httpServer.listen(port, () => {
  console.log(`Chat service running in port ${port}`);
});
