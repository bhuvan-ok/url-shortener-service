require("dotenv").config();
const express = require("express");
const Redis = require("ioredis");
const Url = require("../models/Url");
const encode = require("../utils/base62");

const router = express.Router();
const redis = new Redis(process.env.REDIS_URL, {
  retryStrategy: (times) => Math.min(times * 50, 2000),
});


let counter = 1000;

// Shorten URL
router.post("/api/shorten", async (req, res) => {
  try {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      new URL(longUrl);
    } catch (e) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    if (!longUrl.startsWith("http://") && !longUrl.startsWith("https://")) {
      return res.status(400).json({ error: "URL must start with http:// or https://" });
    }

    const code = encode(counter++);

    await Url.create({ 
      shortCode: code, 
      longUrl,
      createdAt: new Date()
    });

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    
    res.json({ 
      shortUrl: `${baseUrl}/${code}`,
      shortCode: code,
      longUrl: longUrl
    });

  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ error: "Failed to create short URL" });
  }
});

// Get recent URLs
router.get("/api/recent", async (req, res) => {
  try {
    const urls = await Url.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("shortCode longUrl clicks createdAt");
    
    res.json(urls);
  } catch (error) {
    console.error("Error fetching recent URLs:", error);
    res.status(500).json({ error: "Failed to fetch recent URLs" });
  }
});

// Get analytics
router.get("/api/analytics", async (req, res) => {
  try {
    const totalUrls = await Url.countDocuments();
    const totalClicksResult = await Url.aggregate([
      { $group: { _id: null, total: { $sum: "$clicks" } } }
    ]);
    
    const topUrls = await Url.find()
      .sort({ clicks: -1 })
      .limit(5)
      .select("shortCode longUrl clicks");

    res.json({
      totalUrls,
      totalClicks: totalClicksResult[0]?.total || 0,
      topUrls
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// Get stats for specific URL
router.get("/api/stats/:code", async (req, res) => {
  try {
    const data = await Url.findOne({ shortCode: req.params.code });
    
    if (!data) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.json({
      shortCode: data.shortCode,
      longUrl: data.longUrl,
      clicks: data.clicks,
      dailyClicks: data.dailyClicks,
      createdAt: data.createdAt
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Redirect
router.get("/:code", async (req, res) => {
  try {
    const code = req.params.code;

    if (code.includes(".") || code === "api") {
      return res.status(404).send("Not found");
    }

    let longUrl = await redis.get(code);

    if (!longUrl) {
      const data = await Url.findOne({ shortCode: code });
      if (!data) {
        return res.status(404).send("Short URL not found");
      }

      longUrl = data.longUrl;
      await redis.set(code, longUrl, "EX", 86400);
    }

    const today = new Date().toISOString().slice(0, 10);

    await Url.updateOne(
      { shortCode: code },
      {
        $inc: {
          clicks: 1,
          [`dailyClicks.${today}`]: 1
        }
      }
    );

    res.redirect(longUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;