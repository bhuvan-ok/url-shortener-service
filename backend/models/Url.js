const mongoose = require("../db");

const urlSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  longUrl: {
    type: String,
    required: true
  },
  clicks: { 
    type: Number, 
    default: 0 
  },
  dailyClicks: { 
    type: Map,
    of: Number,
    default: {} 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  }
});

urlSchema.index({ createdAt: -1 });
urlSchema.index({ clicks: -1 });

module.exports = mongoose.model("Url", urlSchema);