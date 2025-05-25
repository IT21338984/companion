import { useState } from "react";
import "./ChangeAvatar.css";

type Avatar = {
  label: string;
  gender: string;
  fashion: string;
  image: string;
};

const avatars: Avatar[] = [
  { label: "African Male", gender: "male", fashion: "african", image: "/assets/africanMale.png" },
  { label: "African Female", gender: "female", fashion: "african", image: "/assets/africanFemale.png" },
  { label: "East Asian Male", gender: "male", fashion: "eastAsian", image: "/assets/eastAsianMale.png" },
  { label: "East Asian Female", gender: "female", fashion: "eastAsian", image: "/assets/eastAsianFemale.png" },
  { label: "South Asian Male", gender: "male", fashion: "southAsian", image: "/assets/southAsianMale.png" },
  { label: "South Asian Female", gender: "female", fashion: "southAsian", image: "/assets/southAsianFemale.png" },
  { label: "Middle Eastern Male", gender: "male", fashion: "middleEast", image: "/assets/middleEastMale.png" },
  { label: "Middle Eastern Female", gender: "female", fashion: "middleEast", image: "/assets/middleEastFemale.png" },
  { label: "Western Male", gender: "male", fashion: "western", image: "/assets/westernMale.png" },
  { label: "Western Female", gender: "female", fashion: "western", image: "/assets/westernFemale.png" },
];

export default function ChangeAvatar() {
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);

  const handleContinue = () => {
    if (!selectedAvatar) return;
    const { gender, fashion } = selectedAvatar;
    const url = `http://localhost:5173?gender=${encodeURIComponent(gender)}&fashion=${encodeURIComponent(fashion)}`;
    window.location.href = url;
  };

  return (
    <div className="scan-container">
      <div className="background-animation"></div>
      <div className="content">
        <h2 className="title">Change Your Avatar Style</h2>

        <div className="avatar-grid">
          {avatars.map((avatar, idx) => (
            <div
              key={idx}
              className={`avatar-tile ${selectedAvatar?.label === avatar.label ? "selected" : ""}`}
              onClick={() => setSelectedAvatar(avatar)}
            >
              <img src={avatar.image} alt={avatar.label} className="avatar-img" />
              <p>{avatar.label}</p>
            </div>
          ))}
        </div>

        <button className="scan-button" disabled={!selectedAvatar} onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
