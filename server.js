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
const ALLOWED_ORIGIN = process.env.PUBLIC_URL || process.env.ALLOWED_ORIGIN;
app.use(cors({ origin: ALLOWED_ORIGIN }));

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
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
