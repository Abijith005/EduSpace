import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config.js";
import dbConnect from "./config/dbConnect.js";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();
const port = process.env.PORT;
const clientUrl = process.env.CLIENT_URL;
const adminUrl = process.env.ADMIN_SERVICE_URL;

dbConnect();
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [clientUrl, adminUrl],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

app.use("/api/v1/teacher/profile", profileRoutes);

  app.listen(port, () => {
    console.log(`teacher service running in port ${port}`);
  });
