import generateTransactionReceipt from "../helpers/generateTransactionId.js";
import crypto from "crypto";
import paymentModel from "../models/paymentModel.js";
import jwtDecode from "../helpers/jwtDecode.js";
import sendSubscriptionTaskToQueue from "../rabbitmq/producers/subscribeCourse.js";
import { razorpayInstance } from "../config/razorpayConfig.js";

export const createOrder = async (req, res) => {
  try {
    const { price } = req.body;
    const amount = parseFloat(price).toFixed(2);
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: generateTransactionReceipt(),
    };
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ success: true, order: order });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      course_id,
      receiver_id,
      amount,
    } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest === razorpay_signature) {
      const token = req.headers.authorization.split(" ")[1];
      const user_id = jwtDecode(token).id;
      await paymentModel.create({
        type: "purchase",
        courseId: course_id,
        receiverId: receiver_id,
        senderId: user_id,
        amount,
        paymentMethod: "razorpay",
        transactionId: razorpay_payment_id,
      });
      const data = { user_id, course_id };
      await sendSubscriptionTaskToQueue("course_subscription", data);

      res.status(200).json({ success: true, message: "Payment successfull" });
    } else {
      res.status(400).json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
