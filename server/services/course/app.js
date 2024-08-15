import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config.js";
import dbConnect from "./config/dbConnect.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import {
  getCategoriesByIds,
  getSubscriptionDatas,
} from "./controllers/categoryController.js";
import startRpcServer from "./rabbitmq/services/rpcServer.js";
import startConsumer from "./rabbitmq/consumers/uploadConsumer.js";
import consumeSubscriptionTasks from "./rabbitmq/consumers/subscriptionConsumer.js";

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
    origin: [clientUrl, "http://192.168.20.14:4200"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);
startRpcServer("category", getCategoriesByIds);
startRpcServer("subscriptionDataQueue", getSubscriptionDatas);
startConsumer();
consumeSubscriptionTasks();

app.use("/api/v1/course/categories", categoryRoutes);
app.use("/api/v1/course/manageCourse", courseRoutes);
app.use("/api/v1/course/reviews", reviewRoutes);
app.use("/api/v1/course/subscriptions", subscriptionRoutes);

app.listen(port, () => {
  console.log(`courses service running in port ${port}`);
});
