import axios from "axios";
import jwtDecode from "../helpers/jwtDecode.js";
import WalletModel from "../models/walletModel.js";
import { getRazorpayAuthHeader } from "../config/razorpayConfig.js";
import withdrawalModel from "../models/withdrawalModel.js";
import paymentModel from "../models/paymentModel.js";

export const getBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const walletDetails = await WalletModel.findOne({ userId });
    res
      .status(200)
      .json({ success: true, walletBalance: walletDetails.balance });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const walletPayout = async (req, res) => {
  try {
    const {
      accountHolderName,
      accountNumber,
      ifsc,
      amount,
      requestId,
      userId,
    } = req.body;

    console.log();
    const contactResponse = await axios.post(
      "https://api.razorpay.com/v1/contacts",
      {
        name: accountHolderName,
        type: "customer",
        reference_id: userId,
      },
      {
        headers: { Authorization: getRazorpayAuthHeader() },
      }
    );

    const contactId = contactResponse.data.id;

    const fundAccountResponse = await axios.post(
      "https://api.razorpay.com/v1/fund_accounts",
      {
        contact_id: contactId,
        account_type: "bank_account",
        bank_account: {
          name: accountHolderName,
          account_number: accountNumber,
          ifsc: ifsc,
        },
      },
      {
        headers: { Authorization: getRazorpayAuthHeader() },
      }
    );

    const fundAccountId = fundAccountResponse.data.id;

    const virtualAccount = process.env.RAZORPAY_ACCOUNT_NUMBER;
    const payoutResponse = await axios.post(
      "https://api.razorpay.com/v1/payouts",
      {
        account_number: virtualAccount,
        fund_account_id: fundAccountId,
        amount: amount * 100,
        currency: "INR",
        mode: "IMPS",
        purpose: "payout",
        queue_if_low_balance: true,
        reference_id: `test_withdrawal_${userId}`,
        narration: `Test withdrawal`,
      },
      {
        headers: { Authorization: getRazorpayAuthHeader() },
      }
    );

    const actionDate = new Date();
    await withdrawalModel.findByIdAndUpdate(requestId, {
      status: "approved",
      actionDate,
    });

    await paymentModel.create({
      type: "withdrawal",
      receiverId: userId,
      amount: amount,
      paymentMethod: "razorpay",
      transactionId: payoutResponse.data.id,
    });
    const walletData = await WalletModel.findOne({ userId: userId });
    walletData.balance = walletData.balance - parseInt(amount);
    walletData.save();

    res.status(200).json({
      success: true,
      message: "Withdrawal completed.",
      payoutDetails: payoutResponse.data,
    });
  } catch (error) {
    let statusCode = 500;
    let errorMessage = "An unexpected error occurred";

    if (error.response) {
      if (error.response.status >= 400 && error.response.status < 500) {
        statusCode = error.response.status;
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          "Validation error";
      } else {
        statusCode = error.response.status;
        errorMessage = error.response.data.message || "Server error occurred";
      }
    } else {
      errorMessage = error.message || "An unexpected error occurred";
    }

    console.log(`Error (${statusCode}):\n`, errorMessage);

    return res
      .status(statusCode)
      .json({ success: false, message: errorMessage.description });
  }
};
