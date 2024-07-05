import axios from "axios";

const serviceUrl = process.env.SERVICE_URL;

class TeacherCommunicator {
  constructor(token) {
    this.teacherService = axios.create({
      baseURL: `${serviceUrl}/teacher`,
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  async getCertificates(token) {
    const response = await this.teacherService.get("/certificates/all");
    return response.data;
  }
}

export default TeacherCommunicator