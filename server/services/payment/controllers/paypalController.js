import paypal from "../config/paypalConfig.js";
import generateAccessToken from "../helpers/paypalAccessToken.js";
import axios from "axios";

export const createOrder = async (req, res) => {
  try {
    const { price } = req.body;
    const priceFormatted = parseFloat(price).toFixed(2);

    const accessToken = await generateAccessToken();

    const response = await axios({
      url: `${process.env.PAYPAL_URL}/v2/checkout/orders`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: priceFormatted,
            },
          },
        ],
        application_context: {
          return_url: `${process.env.BASE_URL}/api/v1/payment/paypal/execute-payment`,
          cancel_url: `${process.env.BASE_URL}/api/v1/payment/paypal/cancel-payment`,
        },
      }),
    });

    res.json({
      id: response.data.id,
      orderRef: response.data.id,
    });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).send("Error creating PayPal order");
  }
};

export const captureOrder = async (req, res) => {
  try {
    const { orderID } = req.body;

    const accessToken = await generateAccessToken();

    const response = await axios({
      url: `${process.env.BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    res.status(500).send("Error capturing PayPal order");
  }
};
