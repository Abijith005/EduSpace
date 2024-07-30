import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config.js";
import dbConnect from "./config/dbConnect.js";
import profileRoutes from "./routes/profileRoutes.js";
import startRPCServer from "./rabbitmq/service/rpcServer.js";
import { getTeacherProfile } from "./controllers/profileController.js";
import consumeProfileTasks from "./rabbitmq/consumers/profileConsumer.js";
import teacherRoutes from "./routes/teacherRoutes.js";

const app = express();
const port = process.env.PORT;
const clientUrl = process.env.CLIENT_URL;

dbConnect();
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [clientUrl],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

app.use("/api/v1/teacher/profile", profileRoutes);
app.use("/api/v1/teacher/teacherManage", teacherRoutes);

consumeProfileTasks();
startRPCServer("teacherQueue", getTeacherProfile);

app.listen(port, () => {
  console.log(`teacher service running in port ${port}`);
});
