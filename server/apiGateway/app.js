import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import "dotenv/config.js";
import authMiddleware from './middlewares/authMiddleware.js'

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
  "/api/v1/user",authMiddleware('user'),
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
  })
);

app.listen(port, () => {
  console.log("api gateway running in port 5000");
});
