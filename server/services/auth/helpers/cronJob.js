import cron from "node-cron";
import deleteOtp from "./deleteOtp.js";

const cronJob = () => {
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        deleteOtp();
        console.log('deleted otpssss');
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};

export default cronJob;
