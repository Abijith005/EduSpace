import { Op } from "sequelize";
import otpModel from "../models/otpModel.js";

const deleteOtp = async () => {
  const currentTime = new Date();
  await otpModel.destroy({ where: { expiresAt: { [Op.lt]: currentTime } } });
};

export default deleteOtp