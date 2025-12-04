import express from "express";
import axios from "axios";

const router = express.Router();

// Get PayPal Access Token
router.get("/token", async (req, res) => {
  try {
    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
    ).toString("base64");

    const response = await axios.post(
      `${process.env.PAYPAL_API_BASE}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get PayPal token" });
  }
});

// Create PayPal Order
router.post("/create-order", async (req, res) => {
  try {
    const accessToken = req.body.accessToken;
    const amount = req.body.amount;

    const response = await axios.post(
      `${process.env.PAYPAL_API_BASE}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "USD", value: amount } }],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
});

// Capture PayPal Order
router.post("/capture-order/:orderId", async (req, res) => {
  try {
    const accessToken = req.body.accessToken;
    const orderId = req.params.orderId;

    const response = await axios.post(
      `${process.env.PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to capture PayPal order" });
  }
});

export default router;
