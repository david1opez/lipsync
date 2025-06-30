# 3D Avatar with Lip-Sync Demo

A React Three Fiber (R3F) application featuring an interactive 3D avatar with lip-sync animation, facial expressions, and body animations. Built with TypeScript, Vite, and modern Three.js ecosystem tools.

## 📺 Credits

This project is based on the excellent YouTube tutorial by **Wawa Sensei**: 
**["Create a 3D AI Avatar with React Three Fiber"](https://www.youtube.com/watch?v=egQFAeu6Ihw)**

The codebase has been enhanced with additional documentation, TypeScript improvements, and detailed explanations of all utility functions.

## 🎯 Demo Overview

This project demonstrates:
- **3D Avatar Rendering**: A fully rigged 3D character model
- **Lip-Sync Animation**: Real-time mouth movements synchronized with audio
- **Body Animations**: Idle, greeting, and angry gesture animations
- **Interactive Controls**: Real-time parameter adjustment via Leva controls
- **Camera Following**: Optional head tracking that follows the camera
- **Smooth Morphing**: Configurable smoothing for facial animations

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 Controls

The demo includes interactive controls powered by Leva:

- **Play Audio**: Toggle audio playback and lip-sync animation
- **Head Follow**: Enable/disable camera following behavior
- **Smooth Morph Target**: Toggle smooth transitions for facial animations
- **Morph Target Smoothing**: Adjust smoothing intensity (0-1)
- **Script**: Switch between "welcome" and "pizzas" audio tracks

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Avatar.tsx          # Main avatar component
│   ├── Avatar.types.ts     # TypeScript definitions
│   ├── AvatarUtils.ts      # Utility functions
│   └── FacialMeshes.tsx    # Facial mesh rendering component
├── App.tsx                 # Main application component
└── main.tsx               # Application entry point

public/
├── models/                 # 3D model files (.glb)
├── animations/            # Animation files (.fbx)
├── audios/               # Audio files and lip-sync data
└── textures/             # Texture assets
```

## 🔧 Component Architecture

### Avatar.tsx
The main avatar component that orchestrates all avatar functionality:

**Key Features:**
- Loads and displays the 3D character model
- Manages animation state and transitions
- Handles audio playback and lip-sync coordination
- Provides interactive controls via Leva
- Implements camera following behavior

**Props:**
- `model`: Path to the GLB model file
- Standard Three.js group props (position, scale, rotation, etc.)

### FacialMeshes.tsx
Dedicated component for rendering facial features with morph targets:

**Rendered Meshes:**
- `EyeLeft` & `EyeRight`: Eye geometry with Wolf3D_Eye material
- `Wolf3D_Head`: Head geometry with Wolf3D_Skin material  
- `Wolf3D_Teeth`: Teeth geometry with Wolf3D_Teeth material

**Key Features:**
- Preserves morph target dictionaries for lip-sync
- Maintains skeleton bindings for proper deformation

## 🛠️ Utility Functions (AvatarUtils.ts)

### setupAnimationClips()
Loads and names animation clips from FBX files.

```typescript
setupAnimationClips(routes: {route: string, name: string}[])
```

**Purpose:** Converts FBX animations to Three.js AnimationClips with custom names
**Usage:** Load multiple animations (Idle, Angry, Greeting) for the avatar
**Returns:** Array of named AnimationClip objects

### initializeVisemes()
Sets up initial state for lip-sync morph targets.

```typescript
initializeVisemes(nodes: GLTFResult["nodes"])
```

**Purpose:** Initialize mouth to neutral "I" viseme position
**Target Meshes:** Wolf3D_Head and Wolf3D_Teeth
**Effect:** Sets baseline mouth shape before audio playback

### handleAudioAndAnimation()
Coordinates audio playback with body animations.

```typescript
handleAudioAndAnimation(
  playAudio: boolean,
  script: "welcome" | "pizzas", 
  audio: HTMLAudioElement,
  setAnimation: (anim: "Idle" | "Angry" | "Greeting") => void
)
```

**Logic:**
- `welcome` script → Greeting animation + audio playback
- `pizzas` script → Angry animation + audio playback
- No audio → Idle animation + pause audio

### resetVisemes()
Resets all lip-sync morph targets to neutral state.

```typescript
resetVisemes(
  nodes: GLTFResult["nodes"],
  smoothMorphTarget: boolean,
  morphTargetSmoothing: number
)
```

**Purpose:** Clear all active visemes before applying new ones
**Smoothing:** Uses THREE.MathUtils.lerp when smooth morphing is enabled
**Target:** All viseme morph targets in head and teeth meshes

### applyActiveViseme()
Applies the correct mouth shape based on current audio timing.

```typescript
applyActiveViseme(
  nodes: GLTFResult["nodes"],
  lipsync: LipSyncData,
  currentTime: number,
  smoothMorphTarget: boolean,
  morphTargetSmoothing: number
)
```

**Process:**
1. Check current audio time against lip-sync cue timing
2. Find matching mouth cue in the timeline
3. Map phoneme letter to viseme morph target
4. Apply morph target influence (instant or smoothed)

## 📊 Type System (Avatar.types.ts)

### Viseme Mapping
Maps phonetic sounds to facial morph targets:

```typescript
const corresponding = {
  A: "viseme_PP",  // P, B, M sounds
  B: "viseme_kk",  // K, G sounds  
  C: "viseme_I",   // I, Y sounds
  D: "viseme_AA",  // A sounds
  E: "viseme_O",   // O sounds
  F: "viseme_U",   // U, W sounds
  G: "viseme_FF",  // F, V sounds
  H: "viseme_TH",  // TH sounds
  X: "viseme_PP",  // Silence/other
}
```

### GLTFResult Interface
Type-safe access to model nodes and materials:
- **Nodes**: All mesh and bone objects in the model
- **Materials**: PBR materials for different body parts
- **Animations**: Animation clips embedded in the model

### LipSyncData Interface
Structure for audio timing data:
```typescript
interface LipSyncData {
  mouthCues: MouthCue[]  // Array of timed phoneme cues
}

interface MouthCue {
  start: number    // Start time in seconds
  end: number     // End time in seconds  
  value: VisemeKey // Phoneme letter (A-H, X)
}
```

## 🎵 Audio & Lip-Sync System

### Audio Files
- `welcome.mp3` - Greeting audio track
- `pizzas.mp3` - Pizza-themed audio track
- Multiple format support (.mp3, .ogg)

### Lip-Sync Data Format
JSON files contain precise timing for mouth movements:
```json
{
  "mouthCues": [
    {"start": 0.0, "end": 0.1, "value": "X"},
    {"start": 0.1, "end": 0.3, "value": "A"},
    {"start": 0.3, "end": 0.5, "value": "D"}
  ]
}
```

### Synchronization Process
1. Audio playback triggers in `useEffect`
2. `useFrame` hook reads current audio time
3. Lip-sync data determines active phoneme
4. Corresponding viseme morph target activates
5. Smooth interpolation creates natural movement

## 📦 Dependencies

- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Essential R3F components and helpers
- **three**: Core 3D graphics library
- **leva**: Real-time control panel