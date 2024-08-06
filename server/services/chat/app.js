import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import consumeCommunityTask from "./rabbitmq/consumers/communityConsumer.js";
import dbConnect from "./config/dbConnect.js";
import consumeMemberTask from "./rabbitmq/consumers/memberConsumer.js";
import communityRoutes from "./routes/communityRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import http from "http";
import { Server } from "socket.io";
import socket from "./socket/socket.js";
import { ExpressPeerServer } from "peer";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:4200", "http://192.168.20.14:4200"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const port = process.env.PORT || 5070;

const peerServer = ExpressPeerServer(httpServer, {
  debug: true,
  path: "/",
});

app.use("/peerjs", peerServer);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:4200", "http://192.168.20.14:4200"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

dbConnect();

consumeCommunityTask();
consumeMemberTask();

app.use("/api/v1/chat/communities", communityRoutes);
app.use("/api/v1/chat/messages", messageRoutes);

socket(io);

httpServer.listen(port, () => {
  console.log(`Chat service running in port ${port}`);
});
