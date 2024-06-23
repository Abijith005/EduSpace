import { limiter } from "../config/queue.js";
import sendOtp from "./sendOtp.js";

const emailQueueProcessor = async (job) => {
  try {
    const { email, subject, html } = job.data;
    await limiter.schedule(() => sendOtp(email, subject, html));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default emailQueueProcessor;
