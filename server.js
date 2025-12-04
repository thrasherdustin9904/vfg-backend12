import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import mongoose from 'mongoose';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(xss());
app.use(helmet());

// CORS
const allowedOrigins = [
  process.env.PUBLIC_URL,
  "http://localhost:5173",                      // local dev
  "https://vfg-frontend.onrender.com"          // render frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS blocked: " + origin));
  }
}));

// Rate Limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// MongoDB connect
mongoose
    .connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));

// Example route
app.get("/", (req, res) => {
    res.json({ message: "Backend running!" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});
import settingsRoutes from "./routes/settingsRoutes.js";
app.use("/api/admin/settings", settingsRoutes);

import paypalRoutes from "./routes/paypalRoutes.js";
app.use("/api/payments/paypal", paypalRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
