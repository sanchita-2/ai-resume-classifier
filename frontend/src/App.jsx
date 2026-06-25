import { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import "./App.css";
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setPrediction("");
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop,
  });

  const uploadResume = async () => {
    if (!file) {
      alert("Upload a PDF first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

     const response = await axios.post(
  `${API_URL}/upload`,
   formData
   );

      setPrediction(response.data.prediction);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">

        <h1>🤖 AI Resume Classifier</h1>

        <p>
          Upload your resume and discover the predicted job category
        </p>

        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />

          {file ? (
            <p>📄 {file.name}</p>
          ) : (
            <p>
              Drag & Drop Resume PDF Here
              <br />
              or click to browse
            </p>
          )}
        </div>

        <button
          onClick={uploadResume}
          disabled={loading}
        >
          {loading
            ? "Analyzing..."
            : "Predict Resume"}
        </button>

        {prediction && (
          <div className="result">
            <h2>Prediction</h2>

            <div className="badge">
              {prediction}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;