import sendRPCRequest from "../rabbitmq/services/rpcClient.js";

export const getApplicationStatus = async (req, res) => {
  try {
    const { students, teachers } = await sendRPCRequest(
      "statusQueue",
      JSON.stringify({})
    );

    res.status(200).json({ success: true, students, teachers });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
