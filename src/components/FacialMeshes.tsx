import * as THREE from "three";

// TYPES
import type { GLTFResult } from "./Avatar.types";

export default function FacialMeshes({ nodes, materials }: { nodes: GLTFResult["nodes"], materials: GLTFResult["materials"] }) {
  return ["EyeLeft", "EyeRight", "Wolf3D_Head", "Wolf3D_Teeth"].map((name) => {

    const mesh = (nodes as any)[name] as THREE.SkinnedMesh;

    return (
      <skinnedMesh
        key={name}
        name={name}
        geometry={mesh.geometry}
        material={(materials as any)[
          name === "Wolf3D_Head" ? "Wolf3D_Skin" : name === "Wolf3D_Teeth" ? "Wolf3D_Teeth" : "Wolf3D_Eye"
        ]}
        skeleton={mesh.skeleton}
        morphTargetDictionary={mesh.morphTargetDictionary}
        morphTargetInfluences={mesh.morphTargetInfluences}
      />
    );
  });
}