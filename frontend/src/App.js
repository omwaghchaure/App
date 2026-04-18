import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";

function App() {
  const videoRef = useRef(null);
  const [result, setResult] = useState("Loading AI models...");

  // 🔹 Load models
  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      setResult("Models Loaded ✅");
    } catch (err) {
      setResult("Model Loading Failed ❌");
      console.error(err);
    }
  };

  // 🔹 Auto verification logic
  const startVerification = () => {
    let count = 0;

    const interval = setInterval(async () => {
      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks();

      if (detection) {
        count++;

        if (count > 10) {
          clearInterval(interval);
          setResult("Real Human Verified ✅");
        }
      } else {
        clearInterval(interval);
        setResult("Verification Failed ❌");
      }
    }, 300);
  };

  // 🔹 Start camera + auto verify
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      setResult("Verifying... ⏳");
      startVerification();
    } catch (err) {
      setResult("Camera Error ❌");
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>AI Face Verification</h2>

      <video
        ref={videoRef}
        autoPlay
        width="300"
        style={{ border: "2px solid black", borderRadius: "10px" }}
      />

      <br /><br />

      <button onClick={startCamera}>
        Start Camera & Verify
      </button>

      <h3 style={{ marginTop: "20px" }}>{result}</h3>
    </div>
  );
}

export default App;