import axios from "axios";

const serviceUrl = process.env.SERVICE_URL;

class AuthCommunicator {
  constructor(token) {
    this.authService = axios.create({
      baseURL: `${serviceUrl}/auth`,
    });
  }
  async getUsersByIds(userIds) {
    const response = await this.authService.get(`/data/byIds`,{params:{ids:userIds.join(',')}});
    return response.data;
  }
}

export default AuthCommunicator