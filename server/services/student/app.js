import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import openaiRoutes from "./routes/openaiRoutes.js";
import studentRoutes from "./routes/studentRoutes.js"

const app = express();
const port = process.env.PORT;

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

app.use("/api/v1/student/openAI", openaiRoutes);
app.use("/api/v1/student/studentManage", studentRoutes);

app.listen(port, () => {
  console.log(`student service running in port ${port}`);
});
