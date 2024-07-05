import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import "dotenv/config.js";
import authMiddleware from "./middlewares/authMiddleware.js";

const app = express();

const port = process.env.PORT || 5000;

const clientUrl = process.env.CLIENT_URL;
const adminUrl = process.env.ADMIN_SERVICE_URL;
const teacherUrl = process.env.TEACHER_SERVICE_URL;

app.use(
  cors({
    origin: [clientUrl,teacherUrl,adminUrl],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  "/api/v1/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/v1/user",
  authMiddleware(["student","admin"]),
  createProxyMiddleware({
    target: process.env.STUDENT_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/v1/admin",
  authMiddleware(["admin"]),
  createProxyMiddleware({
    target: adminUrl,
    origin: true,
  })
);

app.use(
  "/api/v1/teacher",
  authMiddleware(["teacher","admin"]),
  createProxyMiddleware({
    target: teacherUrl,
    origin: true,
  })
);

app.listen(port, () => {
  console.log("api gateway running in port 5000");
});
