import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import "dotenv/config";

const app = express();

const port = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(
  "/api/v1/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
  })
);

app.listen(port, () => {
  console.log("api gateway running in port 5000");
});
