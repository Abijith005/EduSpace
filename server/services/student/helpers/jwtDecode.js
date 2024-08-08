import jwt from "jsonwebtoken";

const jwtDecode = (token) => {
  try {
    const secret = process.env.JWT_SIGNATURE;
    const decode = jwt.decode(token, secret);
    return decode;
  } catch (error) {
    console.log("Error", error);
    return false
  }
};

export default jwtDecode;
