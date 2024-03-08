import verifyJwt from "../helpers/jwtVerify";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const verify = verifyJwt(token);
    if (verify) {
      next();
    } else {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized please login again" });
    }
  } catch (error) {
    console.log("Error \n", error);
    res
      .status(401)
      .json({ success: false, message: "Unauthorized please login again" });
  }
};

export default  authMiddleware