import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { CharacterModel } from "./models/characterModel";

// Example: Set dynamically based on region, gender, and age
// const selectedModel = "/models/asianMale.glb"; // Change dynamically
// const selectedModel = "/models/middleEastMale.glb"; // Change dynamically
// const selectedModel = "/models/westernMale.glb"; // Change dynamically
// const selectedModel = "/models/westernFemale.glb"; // Change dynamically
const selectedModel = "/models/CC/character.glb"; // Change dynamically

export default function CharacterScene() {
  return (
    <Canvas
      style={{ width: "100vw", height: "100vh", background: "#e0e0e0" }}
      camera={{ position: [0, 2, 5], fov: 50 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={1} />
      <Suspense fallback={null}>
        <CharacterModel modelPath={selectedModel} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}
