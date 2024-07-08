export const getAllCategories = async () => {
  try {
    const { currentPage, limit } = req.query;
    const totalData = await categoryMode
       const skip = (currentPage - 1) * limit;
  } catch (error) {}
};
