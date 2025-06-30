import * as THREE from "three";
import type { GLTF } from "three-stdlib";

export const corresponding = {
  A: "viseme_FF",
  B: "viseme_SS",
  C: "viseme_E",
  D: "viseme_aa",
  E: "viseme_RR",
  F: "viseme_DD",
  G: "viseme_O",
  H: "viseme_aa",
  X: "viseme_I",
} as const;

export type GLTFResult = GLTF & {
  nodes: {
    Wolf3D_Body: THREE.SkinnedMesh
    Wolf3D_Outfit_Bottom: THREE.SkinnedMesh
    Wolf3D_Outfit_Footwear: THREE.SkinnedMesh
    Wolf3D_Outfit_Top: THREE.SkinnedMesh
    Wolf3D_Hair: THREE.SkinnedMesh
    EyeLeft: THREE.SkinnedMesh
    EyeRight: THREE.SkinnedMesh
    Wolf3D_Head: THREE.SkinnedMesh
    Wolf3D_Teeth: THREE.SkinnedMesh
    Hips: THREE.Bone
  }
  materials: {
    Wolf3D_Body: THREE.MeshStandardMaterial
    Wolf3D_Outfit_Bottom: THREE.MeshStandardMaterial
    Wolf3D_Outfit_Footwear: THREE.MeshStandardMaterial
    Wolf3D_Outfit_Top: THREE.MeshStandardMaterial
    Wolf3D_Hair: THREE.MeshStandardMaterial
    Wolf3D_Eye: THREE.MeshStandardMaterial
    Wolf3D_Skin: THREE.MeshStandardMaterial
    Wolf3D_Teeth: THREE.MeshStandardMaterial
  }
  animations: THREE.AnimationClip[]
}

export type VisemeKey = keyof typeof corresponding;

export interface MouthCue {
  start: number;
  end: number;
  value: VisemeKey;
}

export interface LipSyncData {
  mouthCues: MouthCue[];
}
