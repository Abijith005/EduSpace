import axios from "axios";
import TeacherCommunicator from "../communicator/teacherCommunicator.js";

export const getCertificates = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const teacheCommunicator = new TeacherCommunicator(token);
    const certificates = await teacheCommunicator.getCertificates();
    console.log(certificates, "from admin");
    res.status(200).json(certificates)
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
