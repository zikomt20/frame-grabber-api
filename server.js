const express = require("express");
const cors = require("cors");
const ytdlp = require("yt-dlp-exec");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Frame Grabber API working");
});

// ✅ GET /youtube?url=...
// كيرجع Redirect للرابط المباشر (مؤقت) ديال الفيديو
app.get("/youtube", async (req, res) => {
  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).send("No URL provided");
    }

    // حماية بسيطة: غير http/https
    if (!/^https?:\/\//i.test(url)) {
      return res.status(400).send("Invalid URL");
    }

    // yt-dlp-exec كيرجع stdout فـ output
    const output = await ytdlp(url, {
      getUrl: true,
      format: "best[ext=mp4]/best",
      addHeader: [
        "User-Agent: Mozilla/5.0",
        "Accept-Language: en-US,en;q=0.9",
      ],
      extractorArgs: "youtube:player_client=android",
    });

    const directUrl = output.toString().trim().split("\n")[0];

    if (!directUrl) {
      return res.status(500).json({ error: "No direct URL returned" });
    }

    // redirect للرابط المباشر
    return res.redirect(directUrl);
  } catch (err) {
    return res.status(500).json({
      error: "yt-dlp failed",
      details: (err?.message || "").slice(0, 5000),
    });
  }
});

// Render كيعطي PORT ف env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
