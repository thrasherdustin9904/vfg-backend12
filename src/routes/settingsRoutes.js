import express from "express";
import Settings from "../models/Settings.js";
import { authAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET payment settings
router.get("/", authAdmin, async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.json(settings);
});

// UPDATE PayPal email
router.put("/", authAdmin, async (req, res) => {
  const { paypalEmail } = req.body;
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});

  settings.payment.paypalEmail = paypalEmail;
  await settings.save();

  res.json({ message: "Payment settings updated", settings });
});

export default router;
