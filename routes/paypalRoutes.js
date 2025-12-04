import express from "express";
import { generateAccessToken, paypalApi } from "../config/paypal.js";

const router = express.Router();

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const accessToken = await generateAccessToken();
    const order = await paypalApi.post(
      "/v2/checkout/orders",
      {
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "USD", value: amount } }],
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    res.json(order.data);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: "Unable to create PayPal order" });
  }
});

router.post("/capture-order", async (req, res) => {
  try {
    const { orderID } = req.body;
    const accessToken = await generateAccessToken();
    const capture = await paypalApi.post(
      `/v2/checkout/orders/${orderID}/capture`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    res.json(capture.data);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: "Unable to capture PayPal order" });
  }
});

export default router;
