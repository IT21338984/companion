import { useLocation } from "react-router-dom";
import "./Confirm.css"; // Reuse the same CSS file
import { useState } from "react";

export default function Confirm() {
  const location = useLocation();
  const { age, gender, fashion } = location.state || {};

  if (!age || !gender || !fashion) {
    return (
      <div className="scan-container">
        <div className="background-animation"></div>
        <div className="content">
          <p className="error-message">Error: Missing data. Please rescan.</p>
        </div>
      </div>
    );
  }

  // State for dropdown selections
  const [selectedAge, setSelectedAge] = useState(age);
  const [selectedGender, setSelectedGender] = useState(gender);
  const [selectedFashion, setSelectedFashion] = useState(fashion);

  // Function to redirect to Avatar.jsx with gender and fashion as query parameters
  const handleConfirm = () => {
    const url = `http://localhost:5173?gender=${encodeURIComponent(selectedGender)}&fashion=${encodeURIComponent(selectedFashion)}`;
    window.location.href = url;
  };

  return (
    <div className="scan-container">
      {/* Background animation */}
      <div className="background-animation"></div>

      {/* Content */}
      <div className="content">
        <h2 className="title">Confirm Your Details</h2>

        {/* Display scanned data */}
        <div className="camera-box">
          <div className="results-box">
            {/* <label><strong>Age:</strong></label>
            <select value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)}>
              <option value="adult">Adult</option>
              <option value="child">Child</option>
            </select> */}

            <label><strong>Gender:</strong></label>
            <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <label><strong>Ethnicity:</strong></label>
            <select value={selectedFashion} onChange={(e) => setSelectedFashion(e.target.value)}>
              <option value="african">African</option>
              {/* <option value="eastAsian">East Asian</option>
              <option value="southAsian">Asian</option> */}
              <option value="eastAsian">East Asian</option>
              <option value="southAsian">South Asian</option>
              <option value="middleEast">Middle East</option>
              <option value="western">Western</option>

              {/* <option value="african">African</option>
              <optgroup label="Asian">
                <option value="eastAsian">East Asian</option>
                <option value="southAsian">South Asian</option>
              </optgroup>
              <option value="middleEast">Middle Eastern</option>
              <option value="western">Western</option> */}
            </select>
          </div>
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          className="scan-button"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
