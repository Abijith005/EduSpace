import axios from "axios";

const client_id = process.env.PAYPAL_CLIENT_ID;
const client_secret = process.env.PAYPAL_CLIENT_SECRET;
const paypaBaseUrl = process.env.PAYPAL_URL;

const getAccessToken = async () => {
  try {
    const response = await axios({
      url: `${paypaBaseUrl}/v1/oauth2/token`,
      method: "post",
      data: "grant_type=client_credentials",
      auth: {
        username: client_id,
        password: client_secret,
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Error getting PayPal access token:", error);
    throw error;
  }
};

export default getAccessToken;
