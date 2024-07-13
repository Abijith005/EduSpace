import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config.js";
import dbConnect from "./config/dbConnect.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import { getCategoriesByIds } from "./controllers/categoryController.js";
import startRpcServer from "./rabbitmq/services/rpcServer.js";
import startConsumer from "./rabbitmq/consumers/uploadConsumer.js";

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

app.use("/api/v1/course/categories", categoryRoutes);
app.use("/api/v1/course/manageCourse", courseRoutes);

startRpcServer("category", getCategoriesByIds);
startConsumer();

app.listen(port, () => {
  console.log(`courses service running in port ${port}`);
});
