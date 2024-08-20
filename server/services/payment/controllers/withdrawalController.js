import mongoose from "mongoose";
import withdrawalModel from "../models/withdrawalModel.js";
import sendRPCRequest from "../rabbitmq/services/rpcClient.js";
import moment from "moment-timezone";
import jwtDecode from "../helpers/jwtDecode.js";

export const getAllRequests = async (req, res) => {
  try {
    const { page, limit, search, filter, startDate, endDate } = req.query;
    const skip = parseInt(page - 1) * limit;
    let userDetails;

    const findQuery = {};
    if (filter) {
      findQuery.status = filter;
    }

    if (startDate && endDate) {
      const startOfDayUTC = moment.tz(`${startDate}T00:00:00`, "UTC").toDate();
      const endOfDayUTC = moment.tz(`${endDate}T23:59:59.999`, "UTC").toDate();

      findQuery.createdAt = {
        $gte: startOfDayUTC,
        $lte: endOfDayUTC,
      };
    }

    if (search) {
      const searchKeywords = search.split(" ");
      const searchCondition = {
        role: "teacher",
        $or: searchKeywords.map((keyword) => ({
          name: { $regex: keyword, $options: "i" },
        })),
      };
      userDetails = await sendRPCRequest(
        "authQueue",
        JSON.stringify(searchCondition)
      );
      const userIds = [
        ...new Set(
          userDetails.map((user) => new mongoose.Types.ObjectId(user._id))
        ),
      ];
      findQuery.teacherId = { $in: userIds };
    }
    const [requests] = await withdrawalModel.aggregate([
      {
        $facet: {
          totalCount: [{ $match: findQuery }, { $count: "totalCount" }],
          data: [
            { $match: findQuery },
            { $skip: skip },
            { $limit: parseInt(limit) },
          ],
        },
      },
      {
        $project: {
          totalCount: { $arrayElemAt: ["$totalCount.totalCount", 0] },
          data: 1,
        },
      },
    ]);

    if (!search) {
      const userIds = [
        ...new Set(requests.data.map((request) => request.teacherId)),
      ];
      const query = { _id: { $in: userIds } };
      userDetails = await sendRPCRequest("authQueue", JSON.stringify(query));
    }

    const totalPages = Math.ceil(requests.totalCount / limit);
    const data = requests.data.map((item) => {
      const user = userDetails.find((e) => e._id == item.teacherId);
      delete item.teacherId;
      return {
        ...item,
        user: user,
      };
    });
    res.status(200).json({ success: true, data: data, totalPages });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const rejectWithdrawal = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const actionDate = new Date();
    await withdrawalModel.findByIdAndUpdate(requestId, { status, actionDate });
    res
      .status(200)
      .json({ success: true, message: "Withdrawal rejected successfully" });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getUserRequests = async (req, res) => {
  try {
    const { filter, currentPage, limit, startDate, endDate } = req.query;
    const token = req.headers.authorization.split(" ")[1];
    const userId = await jwtDecode(token).id;
    const page = Number(currentPage);
    const limitValue = Number(limit);
    const skip = (page - 1) * limit;
    const findQuery = { teacherId: new mongoose.Types.ObjectId(userId) };
    if (filter) {
      findQuery.status = filter;
    }

    if (startDate && endDate) {
      const startOfDayUTC = moment.tz(`${startDate}T00:00:00`, "UTC").toDate();
      const endOfDayUTC = moment.tz(`${endDate}T23:59:59.999`, "UTC").toDate();

      findQuery.createdAt = {
        $gte: startOfDayUTC,
        $lte: endOfDayUTC,
      };
    }

    const [withdrawal] = await withdrawalModel.aggregate([
      {
        $facet: {
          totalCount: [{ $match: findQuery }, { $count: "totalCount" }],
          data: [
            { $match: findQuery },
            { $skip: skip },
            { $limit: limitValue },
          ],
        },
      },
      {
        $project: {
          totalCount: { $arrayElemAt: ["$totalCount.totalCount", 0] },
          data: 1,
        },
      },
    ]);
    const totalPages = Math.ceil(withdrawal.totalCount / limit);
    console.log(withdrawal.data);
    res.status(200).json({ success: true, data: withdrawal.data, totalPages });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
