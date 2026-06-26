const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const fs = require("fs");

const app = express();

app.use(
  cors({
    origin: [
      "https://ai-resume-classifier.vercel.app/"
    ]
  })
);
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

    console.log("Calling ML server...");

     const prediction = await axios.post(
     "https://ai-resume-classifier-1.onrender.com/predict",
     {
      resume: pdfData.text
      },
     {
      timeout: 60000
     }
    );

console.log("ML Response:");
console.log(prediction.data);

      res.json({
        prediction:
          prediction.data.prediction
      });

    } catch (error) {

  console.log("ERROR");

   if (error.response) {
    console.log("Status:", error.response.status);
    console.log(error.response.data);
   } else if (error.request) {
    console.log("No response from ML server");
   } else {
    console.log(error.message);
   }

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