import requestModel from "../models/categoryRequestModeldel.js";

export const uploadCertificates = async (req, res) => {
  try {
    const { category } = req.body;
    const certificates = req.files.map((file) => ({
      url: file.location,
      key: file.key,
      verified: false,
    }));
    console.log(certificates);
    await requestModel.create({
      userId: "131",
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

export const getCertificates = async (req, res) => {
  try {
    const requests = await requestModel.find().lean();
    res.status(200).json({ success: true, requests: requests });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
