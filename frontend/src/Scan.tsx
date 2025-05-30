import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Scan.css"; // Import the CSS file

export default function Scan() {
  const webcamRef = useRef<Webcam | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [webcamAvailable, setWebcamAvailable] = useState(true);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setWebcamAvailable(true))
      .catch(() => setWebcamAvailable(false));
  }, []);

  const dataURItoBlob = (dataURI: string): Blob => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: mimeString });
  };

  const capture = useCallback(async () => {
    if (!webcamRef.current) {
      alert("Webcam not ready. Try again.");
      return;
    }

    setLoading(true);
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      alert("Failed to capture image. Please try again.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("image", dataURItoBlob(imageSrc));
    
    try {
      const response = await axios.post("http://172.28.9.19:5000/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("API Response:", response.data); // ✅ Log response for debugging

      if (!response.data || response.data.error) {
        alert(`Error from backend: ${response.data.error || "Unknown error"}`);
        return;
      }

      const { age, gender, fashion } = response.data;
      console.log("Navigating to confirm page with:", { age, gender, fashion });

      // ✅ Navigate only if response contains valid data
      if (age && gender && fashion) {
        navigate("/confirm", { state: { age, gender, fashion } });
      } else {
        alert("Invalid response from server. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Error uploading image:", error);
      alert("Failed to scan. Please check the backend server.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="scan-container">
      {/* Background animation */}
      <div className="background-animation"></div>

      {/* Content */}
      <div className="content">
        <h2 className="title">Scan Your Face</h2>

        <div className="camera-box">
          {webcamAvailable ? (
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="camera-preview"
              videoConstraints={{ facingMode: "user" }}
            />
          ) : (
            <div className="camera-placeholder">
              <p className="error-message">Webcam access denied or not available.</p>
            </div>
          )}
        </div>

        <button
          onClick={capture}
          disabled={loading || !webcamAvailable}
          className="scan-button"
        >
          {loading ? (
            <div className="spinner"></div>
          ) : (
            "Scan"
          )}
        </button>
      </div>
    </div>
  );
}