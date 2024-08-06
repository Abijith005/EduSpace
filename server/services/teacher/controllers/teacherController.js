import teacherProfileModel from "../models/teacherProfileModel.js";
import sendRPCRequest from "../rabbitmq/service/rpcClient.js";

export const getAllTeachers = async (req, res) => {
  try {
    const { search, filter, page, limit } = req.query;

    const searchKeywords = search.split(" ");

    let query = {
      $or: searchKeywords.map((keyword) => ({
        name: { $regex: keyword, $options: "i" },
      })),
    };

    if (filter != "null") {
      query = { ...query, activeStatus: filter };
    }

    const skip = (page - 1) * limit;
    query.role = "teacher"; 
    const data = await sendRPCRequest("authQueue", JSON.stringify(query));
    const totalPages = Math.ceil(data.length / limit);
    const teachers = data.slice(skip, limit * page);
    const teacher_ids = [...new Set(teachers.map((item) => item._id))];
    const profiles = await teacherProfileModel.find({
      userId: { $in: teacher_ids },
    }); 
    const categoryIds = [
      ...new Set(profiles.flatMap((item) => item.categories)),
    ];
    const categories = await sendRPCRequest(
      "category",
      JSON.stringify(categoryIds)
    );

    const instructorDetails = teachers.map((item) => {
      const profile = profiles.find((e) => e.userId == item._id);
      const approvedCategories = [];
      if (profile.categories.length > 0) {
        profile.categories.forEach((element) => {
          const category = categories.find((e) => e._id == element);    
          approvedCategories.push({ _id: category._id, title: category.title });
        });
      }
      return {
        ...item,
        categories: approvedCategories,
        totalCourses: profile.totalCourses,
        rating: profile.rating,
      };
    });

    res.json({ success: true, instructorDetails, totalPages });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateTeacherStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const query = { _id: userId };
    const update = { $set: { activeStatus: status } };
    await sendRPCRequest("updateAuthQueue", JSON.stringify({ query, update }));
    res
      .status(200)
      .json({ success: true, message: "Instructor Updated successfully" });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
