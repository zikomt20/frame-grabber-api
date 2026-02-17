const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Frame Grabber API working");
});

function handleYoutube(url, res) {
  if (!url) return res.status(400).json({ error: "No URL provided" });

  if (!/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const cmd = `yt-dlp -f "best[ext=mp4]/best" -g "${url}"`;

  exec(cmd, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        error: "yt-dlp failed",
        details: (stderr || error.message || "").slice(0, 3000),
      });
    }

    const directUrl = (stdout || "").trim().split("\n")[0];
    if (!directUrl) return res.status(500).json({ error: "No direct URL returned" });

    return res.json({ directUrl });
  });
}

// ✅ هادي باش يولي يخدم فالمتصفح (GET)
app.get("/youtube", (req, res) => {
  handleYoutube(req.query.url, res);
});

// ✅ هادي باش يولي يخدم فـ Hoppscotch (POST)
app.post("/youtube", (req, res) => {
  handleYoutube(req.body?.url, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
