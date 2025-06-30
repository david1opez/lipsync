import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Avatar from "./components/Avatar";

function App() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
      <color attach="background" args={["#ececec"]} />
      <OrbitControls/>
      <Avatar
        model="/models/646d9dcdc8a5f5bddbfac913.glb"
        position={[0, -3, 5]}
        scale={2}
      />
      <Environment preset="sunset" />
    </Canvas>
  );
}

export default App;
