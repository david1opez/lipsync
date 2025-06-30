import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useControls } from "leva";

// COMPONENTS
import FacialMeshes from "./FacialMeshes";

// UTILS
import {
  setupAnimationClips,
  initializeVisemes,
  handleAudioAndAnimation,
  resetVisemes,
  applyActiveViseme
} from "./AvatarUtils";

// TYPES
import type { JSX } from "react";
import type { GLTFResult, LipSyncData } from "./Avatar.types";


export default function Avatar({ model, ...props }: JSX.IntrinsicElements["group"] & { model: string }) {
  const controls = useControls({
    playAudio: false,
    headFollow: true,
    smoothMorphTarget: true,
    morphTargetSmoothing: { value: 0.5, min: 0, max: 1 },
    script: {
      value: "welcome" as "welcome" | "pizzas",
      options: ["welcome", "pizzas"],
    },
  });

  const audio = useMemo(() => new Audio(`/audios/${controls.script}.mp3`), [controls.script]);
  const jsonText = useLoader(
    THREE.FileLoader,
    `/audios/${controls.script}.json`,
    (loader) => {
      loader.setResponseType("text");
    }
  ) as string;

  const lipsync: LipSyncData = JSON.parse(jsonText);

  const { nodes, materials } = useGLTF(model) as unknown as GLTFResult;
  
  const animationClips = setupAnimationClips([
    { route: "/animations/Idle.fbx", name: "Idle" },
    { route: "/animations/Angry Gesture.fbx", name: "Angry" },
    { route: "/animations/Standing Greeting.fbx", name: "Greeting" }
  ]);

  const [animation, setAnimation] = useState<"Idle" | "Angry" | "Greeting">("Idle");

  const group = useRef<THREE.Group>(null!);

  // Hook to control animations
  const { actions } = useAnimations(animationClips, group);

  // Handle animation transitions
  useEffect(() => {
    const action = actions[animation];
    action?.reset().fadeIn(0.5).play();
    return () => {
      action?.fadeOut(0.5);
    };
  }, [animation, actions]);

  // Handle audio playback and animation control
  useEffect(() => {
    initializeVisemes(nodes);

    handleAudioAndAnimation(
      controls.playAudio, 
      controls.script as "welcome" | "pizzas", 
      audio, 
      setAnimation
    );
  }, [controls.playAudio, controls.script, audio, nodes]);

  useFrame((state) => {
    // Head following camera
    if (controls.headFollow) {
      const head = group.current.getObjectByName("Head");
      if (head) head.lookAt(state.camera.position);
    }

    const currentTime = audio.currentTime;

    resetVisemes(nodes, controls.smoothMorphTarget, controls.morphTargetSmoothing);

    // Apply active viseme based on lip sync data
    applyActiveViseme(
      nodes,
      lipsync,
      currentTime,
      controls.smoothMorphTarget,
      controls.morphTargetSmoothing
    );
  });

  return (
    <group {...props} ref={group} dispose={null}>

      <primitive object={nodes.Hips} />

      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      
      <FacialMeshes nodes={nodes} materials={materials} />
      
    </group>
  );
}

// Preload para optimizar
useGLTF.preload("/models/646d9dcdc8a5f5bddbfac913.glb");
