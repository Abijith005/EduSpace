import axios from "axios";
const serviceUrl = process.env.SERVICE_URL;

class CourseCommunicator {
  constructor(token) {
    this.couseService = axios.create({
      baseURL: `${serviceUrl}/course`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createCategory(data) {
    const result = await this.couseService.post(`/categories/create`, data);
    return result;
  }

  async getAllCategory(page, limit) {
    const result = await this.couseService.get(
      `/categories/all?page=${page}&limit=${limit}`
    );
    return result;
  }

  async getCategoryByIds(ids) {
    const result = await this.couseService.get(`/categories/byIds`, {
      params: { ids: ids.join(",") },
    });
    return result.data
  }
}

export default CourseCommunicator;
