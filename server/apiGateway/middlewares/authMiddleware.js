import verifyJwt from "../helpers/jwtVerify.js";

const authMiddleware = (role) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const verify = verifyJwt(token);
      if (verify&&role.includes(verify.role)) {
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
};

export default authMiddleware;
