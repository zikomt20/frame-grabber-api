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

  exec(`yt-dlp -g "${url}"`, (error, stdout) => {
    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    res.json({
      directUrl: stdout.trim()
    });
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
