export const userRegister = (req, res) => {
  try {

    const {name,email,password}=req.body
    
  } catch (error) {
    console.log("Error \n", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
