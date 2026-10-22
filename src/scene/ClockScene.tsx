import { Color } from "three";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { SkyTone } from "../data/shichen";
import { ClockWheel } from "./ClockWheel";

type Props = {
  minutes: number;
  selectedIndex: number;
  sky: SkyTone;
  onScrubMinutes: (minutes: number) => void;
  onSelectIndex: (index: number) => void;
};

function Lights({ sky, minutes }: { sky: SkyTone; minutes: number }) {
  const hour = minutes / 60;
  const dayness = Math.max(0, Math.cos(((hour - 12) / 12) * Math.PI));
  const sunAngle = ((90 - minutes * 0.25) * Math.PI) / 180;
  const lift = 4 + dayness * 6;
  return (
    <>
      <color attach="background" args={[sky.zenith]} />
      <fog attach="fog" args={[sky.zenith, 14, 28]} />
      <ambientLight intensity={0.28 + dayness * 0.22} color={sky.horizon} />
      <directionalLight
        castShadow
        position={[
          Math.cos(sunAngle) * 8,
          Math.sin(sunAngle) * 8,
          lift,
        ]}
        intensity={0.9 + dayness * 1.1}
        color={new Color(sky.brass).lerp(new Color("#fff4d8"), dayness)}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <hemisphereLight
        args={[sky.horizon, "#1a120c", 0.35]}
      />
    </>
  );
}

export function ClockScene({
  minutes,
  selectedIndex,
  sky,
  onScrubMinutes,
  onSelectIndex,
}: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      frameloop="demand"
      camera={{ position: [0, -5.2, 11.5], fov: 38, near: 0.1, far: 60 }}
      gl={{ antialias: true }}
    >
      <Lights sky={sky} minutes={minutes} />
      <group rotation={[-0.52, 0, 0]} position={[0, 0.3, 0]}>
        <ClockWheel
          minutes={minutes}
          selectedIndex={selectedIndex}
          onScrubMinutes={onScrubMinutes}
          onSelectIndex={onSelectIndex}
        />
      </group>
      <ContactShadows
        position={[0, -3.6, 0]}
        opacity={0.45}
        scale={16}
        blur={2.4}
        far={8}
      />
    </Canvas>
  );
}
