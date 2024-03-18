import sequelize from "../config/sequelize.js";
import { DATE, DataTypes, Model, NOW } from "sequelize";

class OtpModel extends Model {}

OtpModel.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      defaultValue: () => new Date(new Date().getTime() + 300000),
    },
  },
  {
    sequelize,
    modelName: "Otp",
    hooks: {
      beforeUpdate: (instance, options) => {
        instance.expiresAt = new Date(new Date().getTime() + 300000);
      },
    },
  }
);

export default OtpModel;
