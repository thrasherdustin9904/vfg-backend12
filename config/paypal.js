import axios from "axios";

const PAYPAL_CLIENT = process.env.PAYPAL_CLIENT;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_BASE = process.env.NODE_ENV === "production"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

export async function generateAccessToken() {
  const auth = Buffer.from(PAYPAL_CLIENT + ":" + PAYPAL_SECRET).toString("base64");
  const { data } = await axios({
    url: PAYPAL_BASE + "/v1/oauth2/token",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + auth,
    },
    data: "grant_type=client_credentials",
  });
  return data.access_token;
}

export const paypalApi = axios.create({
  baseURL: PAYPAL_BASE,
});
