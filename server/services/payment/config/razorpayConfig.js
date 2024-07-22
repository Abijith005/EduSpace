import razorpay from "razorpay";
const key_id=process.env.RAZORPAY_KEY_ID
const key_secret=process.env.RAZORPAY_KEY_SECRET

const razorpayInstance=new razorpay({
      key_id:key_id,
      key_secret:key_secret
})

export default razorpayInstance