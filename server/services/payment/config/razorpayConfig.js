import razorpay from "razorpay";
const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

export const razorpayInstance = new razorpay({
  key_id: key_id,
  key_secret: key_secret,
});

export const getRazorpayAuthHeader = () => {
  const auth = `${key_id}:${key_secret}`;
  return `Basic ${Buffer.from(auth).toString("base64")}`;
};
