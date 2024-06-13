import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

class UserModel extends Model {}

UserModel.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePic:{
      type:DataTypes.STRING,
      allowNull:true
    },
    socialId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },

  },
  {
    sequelize,
    modelName: "User",
  }
);

export default UserModel;
