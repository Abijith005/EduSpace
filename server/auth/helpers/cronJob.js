import cron from "node-cron";
import deleteOtp from "./deleteOtp.js";

const cronJob = () => {
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
          console.log('complete');
        deleteOtp();
      } catch (error) {
        console.log(error);
        throw error;
      }x
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};

export default cronJob;
