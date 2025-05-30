import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useChat } from "../hooks/useChat";

const facialExpressions = {
  default: {},
  smile: { browInnerUp: 0.17, eyeSquintLeft: 0.4, eyeSquintRight: 0.44 },
  funnyFace: { jawLeft: 0.63, mouthPucker: 0.53, noseSneerLeft: 1 },
  sad: { mouthFrownLeft: 1, mouthFrownRight: 1, mouthShrugLower: 0.78341 },
  surprised: { eyeWideLeft: 0.5, eyeWideRight: 0.5, jawOpen: 0.351 },
  angry: { browDownLeft: 1, browDownRight: 1, eyeSquintLeft: 1 },
  crazy: { browInnerUp: 0.9, jawForward: 1, noseSneerLeft: 0.57 }
};

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

let setupMode = false;

export function Avatar(props) {
  // Extract gender and fashion from URL query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const gender = queryParams.get("gender") || "female"; // Default: female
  const fashion = queryParams.get("fashion") || "southAsian"; // Default: Asian

  // Model path based on fashion and gender
  const modelPath = `/models/${fashion}${gender === "male" ? "Male" : "Female"}.glb`;
  const animationPath = gender === "female" ? "/models/animations.glb" : "/models/animations2.glb";

  // Load the model and animations
  const { nodes, materials, scene } = useGLTF(modelPath);
  const { animations } = useGLTF(animationPath);

  const { message, onMessagePlayed, chat } = useChat();
  const [lipsync, setLipsync] = useState();
  const [animation, setAnimation] = useState(gender === "male" ? "Idle_Armature" : "Idle");
  const [facialExpression, setFacialExpression] = useState("");
  const [audio, setAudio] = useState();
  const [blink, setBlink] = useState(false);
  const [winkLeft, setWinkLeft] = useState(false);
  const [winkRight, setWinkRight] = useState(false);

  useEffect(() => {
    if (!message) {
      setAnimation(gender === "male" ? "Idle_Armature" : "Idle");
      return;
    }
    setAnimation(message.animation);
    setFacialExpression(message.facialExpression);
    setLipsync(message.lipsync);
    const audio = new Audio("data:audio/mp3;base64," + message.audio);
    audio.play();
    setAudio(audio);
    audio.onended = onMessagePlayed;
  }, [message]);

  const group = useRef();
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && actions[animation]) {
      // Stop all animations before playing a new one
      Object.values(actions).forEach((action) => action.stop());
      actions[animation].reset().fadeIn(0.5).play();
    }
  }, [animation, actions]);

  const lerpMorphTarget = (target, value, speed = 0.1) => {
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (index !== undefined && child.morphTargetInfluences[index] !== undefined) {
          child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
            child.morphTargetInfluences[index],
            value,
            speed
          );
        }
      }
    });
  };

  useFrame(() => {
    !setupMode &&
      Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
        const mapping = facialExpressions[facialExpression];
        if (mapping && mapping[key]) {
          lerpMorphTarget(key, mapping[key], 0.1);
        } else {
          lerpMorphTarget(key, 0, 0.1);
        }
      });

    lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5);
    lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5);

    if (setupMode) return;

    const appliedMorphTargets = [];
    if (message && lipsync) {
      const currentAudioTime = audio.currentTime;
      for (const mouthCue of lipsync.mouthCues) {
        if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
          appliedMorphTargets.push(corresponding[mouthCue.value]);
          lerpMorphTarget(corresponding[mouthCue.value], 1, 0.2);
          break;
        }
      }
    }

    Object.values(corresponding).forEach((value) => {
      if (!appliedMorphTargets.includes(value)) lerpMorphTarget(value, 0, 0.1);
    });
  });

  useControls("FacialExpressions", {
    chat: button(() => chat()),
    winkLeft: button(() => {
      setWinkLeft(true);
      setTimeout(() => setWinkLeft(false), 300);
    }),
    winkRight: button(() => {
      setWinkRight(true);
      setTimeout(() => setWinkRight(false), 300);
    }),
    animation: {
      value: animation,
      options: names || [],
      onChange: setAnimation,
    },
    facialExpression: {
      options: Object.keys(facialExpressions),
      onChange: setFacialExpression,
    },
    enableSetupMode: button(() => (setupMode = true)),
    disableSetupMode: button(() => (setupMode = false)),
  });

  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="Wolf3D_Body"
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        name="Wolf3D_Outfit_Bottom"
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        name="Wolf3D_Outfit_Footwear"
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        name="Wolf3D_Outfit_Top"
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        name="Wolf3D_Hair"
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}

// Preload all models and animations for better performance
const preloadModels = () => {
  const models = [
    "/models/southAsianMale.glb",
    "/models/southAsianMale.glb",
    "/models/eastAsianFemale.glb",
    "/models/eastAsianFemale.glb",
    "/models/africanMale.glb",
    "/models/africanFemale.glb",
    "/models/middleEastMale.glb",
    "/models/middleEastFemale.glb",
    "/models/westernMale.glb",
    "/models/westernFemale.glb",
  ];
  models.forEach((model) => useGLTF.preload(model));
};

const preloadAnimations = () => {
  useGLTF.preload("/models/animations.glb");
  useGLTF.preload("/models/animations2.glb");
};

preloadModels();
preloadAnimations();