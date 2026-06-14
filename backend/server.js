const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  dest: "uploads/"
});

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.post(
  "/upload",
  upload.single("resume"),
  async (req, res) => {
    try {

      console.log("FILE RECEIVED:");
      console.log(req.file);

      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded"
        });
      }

      const pdfBuffer = fs.readFileSync(
        req.file.path
      );

      const pdfData = await pdfParse(
        pdfBuffer
      );

      console.log("PDF TEXT LENGTH:");
      console.log(pdfData.text.length);

      const prediction =
        await axios.post(
          "http://127.0.0.1:5000/predict",
          {
            resume: pdfData.text
          }
        );

      res.json({
        prediction:
          prediction.data.prediction
      });

    } catch (error) {

      console.error("ERROR:");
      console.error(error);

      res.status(500).json({
        message: error.message
      });
    }
  }
);

app.listen(4000, () => {
  console.log(
    "Backend running on port 4000"
  );
});