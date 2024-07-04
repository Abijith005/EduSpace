import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import "dotenv/config.js";
import authMiddleware from "./middlewares/authMiddleware.js";

const app = express();

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:4200"],
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
  authMiddleware("student"),
  createProxyMiddleware({
    target: process.env.STUDENT_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/v1/admin",
  authMiddleware("admin"),
  createProxyMiddleware({
    target: process.env.ADMIN_SERVICE_URL,
    origin: true,
  })
);

app.use(
  "/api/v1/teacher",
  // authMiddleware("teacher"),
  createProxyMiddleware({
    target: process.env.TEACHER_SERVICE_URL,
    origin: true,
  })
);

app.listen(port, () => {
  console.log("api gateway running in port 5000");
});
