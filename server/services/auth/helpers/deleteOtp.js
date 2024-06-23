import otpModel from "../models/otpModel.js";

const deleteOtp = async () => {
  const currentTime = new Date();
  await otpModel.deleteMany({ expiresAt: { $lt: currentTime } });
};

export default deleteOtp