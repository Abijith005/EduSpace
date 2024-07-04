import jwt from "jsonwebtoken";
export const createRefreshToken = (payload) => {
  try {
    const secret = process.env.JWT_SIGNATURE;
    const token = jwt.sign(payload, secret, {
      algorithm: "HS256",
      expiresIn: "1m",
    });

    return token;
  } catch (error) {
    console.log("Error \n", error);
    throw new Error("jwt sign error");
  }
};

export const createAccessToken = (payload) => {
  try {
    const secret = process.env.JWT_SIGNATURE;
    const token = jwt.sign(payload, secret, {
      algorithm: "HS256",
      expiresIn: "5s",
    });
    return token;
  } catch (error) {
    console.log("Error \n", error);
    throw new Error("jwt sign error");
  }
};
