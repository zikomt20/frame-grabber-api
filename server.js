const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Frame Grabber API working");
});

app.post("/youtube", (req, res) => {
  const url = req.body.url;

  if (!url) {
    return res.status(400).json({
      error: "No URL provided"
    });
  }

  const cmd = `yt-dlp -f "best[ext=mp4]/best" -g "${url}"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        error: "yt-dlp failed",
        details: stderr
      });
    }

    const directUrl = stdout.trim().split("\n")[0];

    res.json({
      mp4Url: directUrl
    });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
