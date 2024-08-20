import mongoose from "mongoose";
import paymentModel from "../models/paymentModel.js";
import sendRPCRequest from "../rabbitmq/services/rpcClient.js";
import moment from "moment-timezone";
import jwtDecode from "../helpers/jwtDecode.js";

export const getAllPayments = async (req, res) => {
  try {
    const { search, filter, startDate, endDate, currentPage, limit } =
      req.query;
    const page = Number(currentPage);
    const limitValue = Number(limit);
    const skip = (page - 1) * limitValue;
    let userDetails;

    const findQuery = {};
    if (filter) {
      findQuery.type = filter;
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
      findQuery.$or = [
        { senderId: { $in: userIds } },
        { receiverId: { $in: userIds } },
      ];
    }
    const [payments] = await paymentModel.aggregate([
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

    if (!search) {
      const userIds = [
        ...new Set(
          payments.data.flatMap((payment) => {
            const ids = [];
            if (payment.senderId) {
              ids.push(payment.senderId);
            }
            if (payment.receiverId) {
              ids.push(payment.receiverId);
            }
            return ids;
          })
        ),
      ];

      const query = { _id: { $in: userIds } };
      userDetails = await sendRPCRequest("authQueue", JSON.stringify(query));
    }

    const token = req.headers.authorization.split(" ")[1];
    const role = await jwtDecode(token).role;

    let courseDetails;

    if (role === "teacher") {
      const set = new Set();
      for (const item of payments.data) {
        if (item.courseId) {
          set.add(item.courseId);
        }
      }
      const courseIds = [...set];

      courseDetails = await sendRPCRequest(
        "courseDataQueue",
        JSON.stringify(courseIds)
      );
    }

    const data = payments.data.map((payment) => {
      if (payment.senderId) {
        const sender = userDetails.find((user) => user._id == payment.senderId);
        delete payment.senderId;
        payment.sender = sender;
      }
      if (payment.receiverId) {
        const receiver = userDetails.find(
          (user) => user._id == payment.receiverId
        );
        delete payment.receiverId;
        payment.receiver = receiver;
      }

      if (courseDetails?.length > 0) {
        const course = courseDetails.find((e) => e._id == payment.courseId);
        if (course) {
          delete payment.courseId;
          payment.courseDetails = { _id: course._id, title: course.title };
        }
      }

      return payment;
    });
    const totalPages = Math.ceil(payments.totalCount / limitValue);
    // console.log(data);
    res.status(200).json({ success: true, totalPages, data });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
