import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Name.css";
import modelImage from "./assets/3dmodelpic2.png";

export default function Name() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger fade-in on mount
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      requestAnimationFrame(() => {
        container.classList.add("fade-in");
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setName(value);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Please enter your name to proceed.");
      return;
    }
    navigate("/scan");
  };

  return (
    <div ref={containerRef} className="enter-name-container">
      <div className="name-background-animation"></div>

      <div className="name-content">
        <h2 className="name-title">Who’s logging in today?</h2>
        <p className="subtitle">This helps us personalize your experience.</p>

        <input
          type="text"
          placeholder="Type your name here..."
          value={name}
          onChange={handleChange}
          className="name-input"
        />

        <button onClick={handleSubmit} className="submit-button">
          I'm in
        </button>
      </div>

      {/* Bottom-right image */}
      <img
        src={modelImage}
        alt="3D model"
        className="bottom-right-image"
      />
    </div>
  );
}
