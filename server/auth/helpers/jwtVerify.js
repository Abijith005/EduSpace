import jwt from "jsonwebtoken";

 const verifyJwt = (token) => {
  try {
    const secret = process.env.JWT_SIGNATURE;
    const userInfo = jwt.verify(token, secret);
    return userInfo;
  } catch (error) {
    console.log("Error \n", error);
    throw new Error("Jwt verification failed");
  }
};

export default verifyJwt