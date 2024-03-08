import { createAccessToken } from "../helpers/jwtSign";
import verifyJwt from "../helpers/jwtVerify";

export const createNewAccessToken = async (req, res) => {
  try {
    const token=req.headers.authorization
    const verify=verifyJwt(token)
    if (verify) {
        createAccessToken({verify})
       return res.status(200).json({success:true,message:'New access token created'})
    }else{
        return res.status(401).json({success:false,message:'Unauthorized please login again'})
    }

  } catch (error) {
    console.log("Error \n", error,'autherrrrrr=============================\n=============================\n===================');
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
