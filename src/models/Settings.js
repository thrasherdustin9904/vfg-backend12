import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  payment: {
    paypalEmail: { type: String, default: "" }
  }
});

export default mongoose.model("Settings", settingsSchema);
