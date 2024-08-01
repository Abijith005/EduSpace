// import { getChannel } from "../config/rabbitmq.js";
// import { getCategoryDetails } from "../consumers/categoryConsumer.js";
// import { getUserDetails } from "../consumers/userDetailsConsumer.js";
import jwtDecode from "../helpers/jwtDecode.js";
import requestModel from "../models/categoryRequestModeldel.js";
import teacherProfileModel from "../models/teacherProfileModel.js";
import sendRPCRequest from "../rabbitmq/service/rpcClient.js";

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
    const { search, filter, page, limit } = req.query;
    const totalData = await requestModel.countDocuments();
    const totalPages = Math.ceil(totalData / limit);
    const skip = (page - 1) * limit;
    let findQuery = {};
    if (search) {
      const searchKeywords = search.split(" ");
      findQuery = {
        $or: searchKeywords.map((keyword) => ({
          name: { $regex: keyword, $options: "i" },
        })),
      };
    }

    if (filter) {
      findQuery.status = filter;
    }

    const requests = await requestModel
      .find(findQuery)
      .limit(limit)
      .skip(skip)
      .lean();

    const userIds = [...new Set(requests.map((item) => item.userId))];
    const categoryIds = [...new Set(requests.map((item) => item.category))];
    const query = { _id: { $in: userIds } };
    const userDetails = await sendRPCRequest(
      "authQueue",
      JSON.stringify(query)
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
    const data = await requestModel.findByIdAndUpdate(
      { _id: requestId },
      { $set: { certificates: certificates } }
    );

    const userId = data.userId;

    const teacherProfile = await teacherProfileModel.findOne({ userId });

    if (!teacherProfile) {
      throw new Error("User not found");
    }

    const verifiedCerts = certificates.filter((cert) => cert.verified);
    const unverifiedCertKeys = certificates
      .filter((cert) => !cert.verified)
      .map((cert) => cert.key);

    const newCertificates = teacherProfile.certificates.filter(
      (cert) => !unverifiedCertKeys.includes(cert.key)
    );
    verifiedCerts.forEach((cert) => {
      if (
        !newCertificates.some((existingCert) => existingCert.key === cert.key)
      ) {
        newCertificates.push(cert);
      }
    });

    teacherProfile.certificates = newCertificates;
    await teacherProfile.save();

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
    const { requestId, status, category, user_id } = req.body;
    await requestModel.findByIdAndUpdate(
      { _id: requestId },
      { $set: { status: status } }
    );

    if (status === "approved") {
      const query = { userId: user_id };
      const update = { $push: { categories: category } };
      await teacherProfileModel.updateOne(query, update);
    }
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

export const getTeacherProfile = (user_ids) => {
  try {
    return teacherProfileModel.find({ userId: { $in: user_ids } });
  } catch (error) {
    console.log("Error \n", error);
    throw error;
  }
};

export const removeApprovedCategories = async (req, res) => {
  try {
    const { categoryIds, userId } = req.body;
    await teacherProfileModel.updateOne(
      { userId: userId },
      { $pullAll: { categories: categoryIds } }
    );
    res
      .status(200)
      .json({ success: true, message: "Category removed successfully" });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
