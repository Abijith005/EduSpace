import CourseCommunicator from "../communicator/courseCommunicator.js";

export const addCategory = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const communicator = new CourseCommunicator(token);
    const response = await communicator.createCategory(req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const token = req.headers.authorization.split(" ")[1];
    const communicator = new CourseCommunicator(token);
    const response = await communicator.getAllCategory(page, limit);
    res.status(response.status).json(response.data);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
