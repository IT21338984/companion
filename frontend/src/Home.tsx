import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    const container = containerRef.current;
    if (container) {
      container.classList.add("fade-blur-out");

      // Wait for the animation to start and complete (600ms), then navigate
      setTimeout(() => navigate("/name"), 600);
    }
  };

  return (
    <div ref={containerRef} className="home-container">
      <h1 className="welcome-text">Welcome to <span className="lumi">LUMI</span></h1>
      <p className="intro">
        By Addressing The Trust Gap Between Humans And
        <span className="highlight">Digital Companions</span>, This Research Aims To Contribute To
        The Development Of More Socially Intelligent,
        Culturally Adaptive, And Emotionally Aware Virtual
        Robots That Seamlessly Integrate
        <span className="highlight">Into Everyday Life.</span>
      </p>
      <button className="get-started-button" onClick={handleClick}>
        Get Started
      </button>
    </div>
  );
}
