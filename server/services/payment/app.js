import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import paypalRoutes from "./routes/paypalRoutes.js";
import razorPayRoutes from "./routes/razorPayRoutes.js";
import withdrawalRoutes from "./routes/withdrawalRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import paymentManageRoutes from "./routes/paymentManageRoutes.js";
import dbConnect from "./config/dbConnect.js";
import consumeWithdrawalTasks from "./rabbitmq/consumers/withdrawalRequestConsumer.js";
import consumeWalletTasks from "./rabbitmq/consumers/updateWalletConsumer.js";
const app = express();
const port = process.env.PORT;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:4200", "http://192.168.20.14:4200"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

consumeWithdrawalTasks();
consumeWalletTasks();

dbConnect();

app.use("/api/v1/payment/paypal", paypalRoutes);
app.use("/api/v1/payment/razorpay", razorPayRoutes);
app.use("/api/v1/payment/withdrawal", withdrawalRoutes);
app.use("/api/v1/payment/wallet", walletRoutes);
app.use("/api/v1/payment/paymentManage", paymentManageRoutes);

app.listen(port, () => {
  console.log(`payment service running in port ${port}`);
});
