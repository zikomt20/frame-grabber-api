const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Frame Grabber API working");
});

// ✅ POST: كيستقبل JSON فـ body: { "url": "..." }
app.post("/youtube", (req, res) => {
  const url = req.body?.url;

  if (!url) return res.status(400).json({ error: "No URL provided" });
  if (!/^https?:\/\//i.test(url)) return res.status(400).json({ error: "Invalid URL" });

  const cmd = `yt-dlp -f "best[ext=mp4]/best" -g "${url}"`;

  exec(cmd, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        error: "yt-dlp failed",
        details: (stderr || error.message || "").slice(0, 5000),
      });
    }

    const directUrl = (stdout || "").trim().split("\n")[0];
    if (!directUrl) return res.status(500).json({ error: "No direct URL returned" });

    return res.json({ directUrl, note: "This link is temporary and may expire." });
  });
});

// ✅ GET: باش يخدم فالمتصفح: /youtube?url=...
app.get("/youtube", (req, res) => {
  const url = req.query?.url;

  if (!url) return res.status(400).json({ error: "No URL provided" });
  if (!/^https?:\/\//i.test(url)) return res.status(400).json({ error: "Invalid URL" });

  const cmd = `yt-dlp -f "best[ext=mp4]/best" -g "${url}"`;

  exec(cmd, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
       
