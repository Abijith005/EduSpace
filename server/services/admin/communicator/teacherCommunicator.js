import axios from "axios";

const serviceUrl = process.env.SERVICE_URL;

class TeacherCommunicator {
  constructor(token) {
    this.teacherService = axios.create({
      baseURL: `${serviceUrl}/teacher`,
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  async getCertificates(currentPage,limit) {
    const response = await this.teacherService.get(`/profile/certificates/all?currentPage=${currentPage}&limit=${limit}`);
    return response.data;
  }
}

export default TeacherCommunicator