import jwtDecode from "../helpers/jwtDecode.js";
import { sendcreateOtpTask } from "../rabbitmq/producers/otpCreateProducer.js";
import { sendWithdrawalRequestTask } from "../rabbitmq/producers/withdrawalRequestProducer.js";
import sendRPCRequest from "../rabbitmq/service/rpcClient.js";
import bcrypt from "bcrypt";

export const sentWithdrawalOTP = async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwtDecode(token).id;
    const query = { _id: userId };
    const [user] = await sendRPCRequest("authQueue", JSON.stringify(query));
    if (user && !user.password) {
      res
        .status(403)
        .json({ success: false, message: "Password not created!" });
    }
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      return res
        .status(403)
        .json({ success: false, message: "Incorrected password" });
    }
    const purpose = "withdrawal";
    await sendcreateOtpTask({ userId, purpose });
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const withdrawalRequest = async (req, res) => {
  try {
    const { accountNumber, ifsc, amount, otp, accountHolder } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const { email, id } = await jwtDecode(token);
    const query = { email, purpose: "withdrawal" };
    const otpData = await sendRPCRequest("otpQueue", JSON.stringify(query));

    if (otpData.otp !== otp) {
      return res.status(403).json({ success: false, message: "Incorrect otp" });
    }
    await sendWithdrawalRequestTask({
      accountNumber,
      ifsc,
      amount,
      teacherId: id,
      accountHolder,
    });
    res
      .status(200)
      .json({ success: true, message: "Request send successfully" });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateWithdrawalRequest = async (req, res) => {
  try {
    const { accountNumber, ifsc, amount, otp, accountHolder, requestId } =
      req.body;
    const token = req.headers.authorization.split(" ")[1];
    const { email, id } = await jwtDecode(token);
    const query = { email, purpose: "withdrawal" };
    const otpData = await sendRPCRequest("otpQueue", JSON.stringify(query));

    if (otpData.otp !== otp) {
      return res.status(403).json({ success: false, message: "Incorrect otp" });
    }
    await sendWithdrawalRequestTask({
      accountNumber,
      ifsc,
      amount,
      teacherId: id,
      accountHolder,
      requestId,
      update: true,
    });
    res
      .status(200)
      .json({ success: true, message: "Request send successfully" });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
