import express from "express";
import fetch from "node-fetch";
import Settings from "../models/Settings.js";

const router = express.Router();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // test mode

// Get access token
async function getAccessToken() {
  const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_SECRET).toString("base64");

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const data = await response.json();
  return data.access_token;
}

// Create order
router.post("/create-order", async (req, res) => {
  const { items } = req.body;

  // Calculate total
  let total = 0;
  items.forEach(i => total += i.price * i.quantity);

  // Get PayPal email from settings
  let settings = await Settings.findOne();
  const email = settings?.payment?.paypalEmail || "";

  const accessToken = await getAccessToken();

  const order = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{
        amount: {
          currency_code: "USD",
          value: total.toFixed(2)
        },
        payee: {
          email_address: email
        }
      }],
      application_context: {
        return_url: "https://vfg-frontend.onrender.com/payment-success",
        cancel_url: "https://vfg-frontend.onrender.com/payment-cancel"
      }
    })
  });

  const data = await order.json();
  res.json(data);
});

// Capture order
router.post("/capture", async (req, res) => {
  const { orderID } = req.body;

  const accessToken = await getAccessToken();

  const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  res.json(data);
});

export default router;
