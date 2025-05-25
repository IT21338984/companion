import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Group } from "three";

// Define component props
interface CharacterModelProps {
  modelPath: string; // Dynamic model path
}

export function CharacterModel({ modelPath, ...props }: CharacterModelProps) {
  // Load the GLB model dynamically
  const { scene, animations } = useGLTF(modelPath) as any;
  const modelRef = useRef<Group>(null);
  const { actions } = useAnimations(animations, modelRef);

  // Play the first available animation
  useEffect(() => {
    if (animations.length > 0) {
      actions[animations[0].name]?.reset().fadeIn(0.5).play();
    }
  }, [actions, animations]);

  return (
    <group ref={modelRef} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

// Preload function for optimization
useGLTF.preload("/models/asianMale.glb"); // Example preload
useGLTF.preload("/models/middleEastMale.glb"); // Example preload
useGLTF.preload("/models/westernMale.glb"); // Example preload
useGLTF.preload("/models/westernFemale.glb"); // Example preload
useGLTF.preload("/models/africanFemale.glb"); // Example preload
useGLTF.preload("/models/CC/character.glb"); // Example preload
