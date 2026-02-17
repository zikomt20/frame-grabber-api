const express = require("express");
const cors = require("cors");
const ytdlp = require("yt-dlp-exec");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Frame Grabber API working");
});

// GET من المتصفح
app.get("/youtube", async (req, res) => {
  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).send("No URL provided");
    }

    const output = await ytdlp(url, {
      getUrl: true,
      format: "best[ext=mp4]/best"
    });

    const directUrl = output.toString().trim().split("\n")[0];

    return res.redirect(directUrl);

  } catch (err) {
    return res.status(500).json({
      error: "yt-dlp failed",
      details: err.message
    });
  }
});

// POST (اختياري)
app.post("/youtube", async (req, res) => {
  try {
    const url = req.body.url;

    const output = await ytdlp(url, {
      getUrl: true,
      format: "best[ext=mp4]/best"
    });

    const directUrl = output.toString().trim().split("\n")[0];

    res.json({ directUrl });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
