import AuthCommunicator from "../communicator/authCommunicator.js";
import CourseCommunicator from "../communicator/courseCommunicator.js";
import TeacherCommunicator from "../communicator/teacherCommunicator.js";

export const getRequests = async (req, res) => {
  try {
    const { currentPage, limit } = req.query;
    const token = req.headers.authorization.split(" ")[1];
    const teacheCommunicator = new TeacherCommunicator(token);
    const response = await teacheCommunicator.getCertificates(
      currentPage,
      limit
    );
    const { requests } = response;
    const userIds = [...new Set(requests.map((item) => item.userId))];
    const categoryIds = [...new Set(requests.map((item) => item.category))];
    const courseCommunicate = new CourseCommunicator(token);
    const authCommunicate = new AuthCommunicator();
    const categories = await courseCommunicate.getCategoryByIds(categoryIds);
    // const users = await authCommunicate.getUsersByIds(userIds);
    console.log(categories,'categorieeeeeeeeeeeeeeeeeeeeeeeeeeee');
    res.status(200).json(response);
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
