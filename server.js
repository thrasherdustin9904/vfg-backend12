import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import paypalRoutes from "./routes/paypal.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/paypal", paypalRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("VF Gaming Backend Running");
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
