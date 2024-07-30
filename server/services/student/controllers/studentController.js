import sendRPCRequest from "../rabbitmq/services/rpcClient.js";

export const getAllStudents = async (req, res) => {
  try {
    const { search, filter, page, limit } = req.query;
    console.log(filter);

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
    query.role = "student";
    console.log(query);
    const data = await sendRPCRequest("authQueue", JSON.stringify(query));
    const totalPages = Math.ceil(data.length / limit);
    const students = data.slice(skip, limit * page);
    const studentIds = [...new Set(students.map((item) => item._id))];
    const subsciptions = await sendRPCRequest(
      "subscriptionDataQueue",
      JSON.stringify(studentIds)
    );
    const studentsDetails = students.map((student) => {
      const subsciptionsCount = subsciptions.filter(
        (item) => item.subscriber_id == student._id
      ).length;
      student.courseSubscribed = subsciptionsCount;
      return student;
    });
    res.status(200).json({ success: true, studentsDetails, totalPages });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateStudentStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const query = { _id: userId };
    const update = { $set: { activeStatus: status } };
    await sendRPCRequest("updateAuthQueue", JSON.stringify({ query, update }));
    res
      .status(200)
      .json({ success: true, message: "Student updated successfully" });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
