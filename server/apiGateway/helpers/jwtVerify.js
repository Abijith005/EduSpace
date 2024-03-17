import jwt from "jsonwebtoken";

 const verifyJwt = (token) => {
  try {
    console.log(token);
    const secret = process.env.JWT_SIGNATURE;
    console.log(secret);
    const userInfo = jwt.verify(token, secret);
    return userInfo;
  } catch (error) {
    console.log(error,'from verification==============================');
   return false
  }
};

export default verifyJwt