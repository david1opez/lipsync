import { useFBX } from "@react-three/drei";
import { corresponding } from "./Avatar.types";
import * as THREE from "three";

// TYPES
import type { GLTFResult, LipSyncData } from "./Avatar.types";

// Helper function to setup and name animation clips
export function setupAnimationClips(routes: {route: string, name: string}[]) {
  if (routes.length < 2) {
    throw new Error("At least two animation routes must be provided");
  }
  
  const animationClips = [];
  
  for (const routeObj of routes) {
    const { animations } = useFBX(routeObj.route);
    animations[0].name = routeObj.name;
    animationClips.push(animations[0]);
  }
  
  return animationClips;
}

// Helper function to initialize viseme to neutral state
export function initializeVisemes(nodes: GLTFResult["nodes"]) {
  const headDict = nodes.Wolf3D_Head.morphTargetDictionary;
  const teethDict = nodes.Wolf3D_Teeth.morphTargetDictionary;
  
  if (headDict && teethDict && nodes.Wolf3D_Head.morphTargetInfluences && nodes.Wolf3D_Teeth.morphTargetInfluences) {
    const idxHead = headDict["viseme_I"];
    const idxTeeth = teethDict["viseme_I"];
    if (idxHead !== undefined && idxTeeth !== undefined) {
      nodes.Wolf3D_Head.morphTargetInfluences[idxHead] = 1;
      nodes.Wolf3D_Teeth.morphTargetInfluences[idxTeeth] = 1;
    }
  }
}

// Helper function to handle audio and animation control
export function handleAudioAndAnimation(
  playAudio: boolean,
  script: "welcome" | "pizzas",
  audio: HTMLAudioElement,
  setAnimation: (anim: "Idle" | "Angry" | "Greeting") => void
) {
  if (playAudio) {
    audio.play();
    setAnimation(script === "welcome" ? "Greeting" : "Angry");
  } else {
    audio.pause();
    setAnimation("Idle");
  }
}

// Helper function to reset all visemes to neutral
export function resetVisemes(
  nodes: GLTFResult["nodes"],
  smoothMorphTarget: boolean,
  morphTargetSmoothing: number
) {
  const headDict = nodes.Wolf3D_Head.morphTargetDictionary;
  const teethDict = nodes.Wolf3D_Teeth.morphTargetDictionary;
  const headInfluences = nodes.Wolf3D_Head.morphTargetInfluences;
  const teethInfluences = nodes.Wolf3D_Teeth.morphTargetInfluences;

  if (!headDict || !teethDict || !headInfluences || !teethInfluences) {
    return;
  }

  for (const vis of Object.values(corresponding)) {
    const idxH = headDict[vis];
    const idxT = teethDict[vis];
    
    if (idxH !== undefined && idxT !== undefined) {
      if (!smoothMorphTarget) {
        headInfluences[idxH] = 0;
        teethInfluences[idxT] = 0;
      } else {
        headInfluences[idxH] = THREE.MathUtils.lerp(
          headInfluences[idxH],
          0,
          morphTargetSmoothing
        );
        teethInfluences[idxT] = THREE.MathUtils.lerp(
          teethInfluences[idxT],
          0,
          morphTargetSmoothing
        );
      }
    }
  }
}

// Helper function to apply active viseme based on lip sync data
export function applyActiveViseme(
  nodes: GLTFResult["nodes"],
  lipsync: LipSyncData,
  currentTime: number,
  smoothMorphTarget: boolean,
  morphTargetSmoothing: number
) {
  const headDict = nodes.Wolf3D_Head.morphTargetDictionary;
  const teethDict = nodes.Wolf3D_Teeth.morphTargetDictionary;
  const headInfluences = nodes.Wolf3D_Head.morphTargetInfluences;
  const teethInfluences = nodes.Wolf3D_Teeth.morphTargetInfluences;

  if (!headDict || !teethDict || !headInfluences || !teethInfluences) {
    return;
  }

  for (const cue of lipsync.mouthCues) {
    if (currentTime >= cue.start && currentTime <= cue.end) {
      const viseme = corresponding[cue.value];
      const idxH = headDict[viseme];
      const idxT = teethDict[viseme];
      
      if (idxH !== undefined && idxT !== undefined) {
        if (!smoothMorphTarget) {
          headInfluences[idxH] = 1;
          teethInfluences[idxT] = 1;
        } else {
          headInfluences[idxH] = THREE.MathUtils.lerp(
            headInfluences[idxH],
            1,
            morphTargetSmoothing
          );
          teethInfluences[idxT] = THREE.MathUtils.lerp(
            teethInfluences[idxT],
            1,
            morphTargetSmoothing
          );
        }
      }
      break;
    }
  }
}