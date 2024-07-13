// import { getChannel } from "../config/rabbitmq.js";
// import { getCategoryDetails } from "../consumers/categoryConsumer.js";
// import { getUserDetails } from "../consumers/userDetailsConsumer.js";
import jwtDecode from "../helpers/jwtDecode.js";
import requestModel from "../models/categoryRequestModeldel.js";
import sendRPCRequest from "../service/rpcClient.js";

export const uploadCertificates = async (req, res) => {
  try {
    const { category } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwtDecode(token).id;
    const certificates = req.files.map((file) => ({
      url: file.location,
      key: file.key,
      verified: false,
    }));
    console.log(certificates);
    await requestModel.create({
      userId: userId,
      category: category,
      certificates: certificates,
    });
    res
      .status(200)
      .json({ success: true, message: "Certficates uploaded successfully" });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getRequests = async (req, res) => {
  try {
    const { currentPage, limit } = req.query;
    const totalData = await requestModel.countDocuments();
    const totalPages = Math.ceil(totalData / limit);
    const skip = (currentPage - 1) * limit;
    const requests = await requestModel
      .find()
      .limit(limit * currentPage)
      .skip(skip)
      .lean();

    const userIds = [...new Set(requests.map((item) => item.userId))];
    const categoryIds = [...new Set(requests.map((item) => item.category))];

    const userDetails = await sendRPCRequest(
      "authQueue",
      JSON.stringify(userIds)
    );
    const categoryDetails = await sendRPCRequest(
      "category",
      JSON.stringify(categoryIds)
    );

    const requestsWithDetails = requests.map((request) => {
      const { userId, category, ...rest } = request;
      return {
        ...rest,
        userDetails: userDetails.find(
          (user) => user._id.toString() === userId.toString()
        ),
        categoryDetails: categoryDetails.find(
          (categoryDetail) =>
            categoryDetail._id.toString() === category.toString()
        ),
      };
    });

    res.status(200).json({
      success: true,
      requests: requestsWithDetails,
      totalPages,
    });

    console.log("Completed fetching permission requests");
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateCertificates = async (req, res) => {
  try {
    const { requestId, certificates } = req.body;
    await requestModel.findByIdAndUpdate(
      { _id: requestId },
      { $set: { certificates: certificates } }
    );
    res
      .status(200)
      .json({ success: true, message: "Certificates updated successfully" });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    await requestModel.findByIdAndUpdate(
      { _id: requestId },
      { $set: { status: status } }
    );
    res
      .status(200)
      .json({ success: true, message: "Request status updated successfully" });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
