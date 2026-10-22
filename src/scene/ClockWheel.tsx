import { useMemo, useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { SHICHEN } from "../data/shichen";
import {
  angleDegFromMinutes,
  dateFromMinutes,
  minutesFromAngleDeg,
  shichenIndexFromHour,
  wedgeStartDeg,
} from "../lib/time";
import { charTexture, createSectorGeometry } from "./geometry";

const INNER = 1.55;
const OUTER = 4.85;
const DEPTH = 0.22;
const LABEL_R = 3.35;

type Props = {
  minutes: number;
  selectedIndex: number;
  onScrubMinutes: (minutes: number) => void;
  onSelectIndex: (index: number) => void;
};

export function ClockWheel({
  minutes,
  selectedIndex,
  onScrubMinutes,
  onSelectIndex,
}: Props) {
  const group = useRef<THREE.Group>(null);
  const drag = useRef({ active: false, moved: false, x: 0, y: 0 });

  const geometries = useMemo(
    () =>
      SHICHEN.map((item) =>
        createSectorGeometry(INNER, OUTER, wedgeStartDeg(item.index), 30, DEPTH),
      ),
    [],
  );

  const toLocal = (event: ThreeEvent<PointerEvent>) => {
    const point = event.point.clone();
    group.current?.worldToLocal(point);
    const radius = Math.hypot(point.x, point.y);
    const deg = (Math.atan2(point.y, point.x) * 180) / Math.PI;
    return { minutes: minutesFromAngleDeg(deg), radius };
  };

  const capture = (event: ThreeEvent<PointerEvent>) => {
    const target = event.nativeEvent.target;
    if (target instanceof HTMLElement) {
      target.setPointerCapture(event.pointerId);
    }
  };

  const onDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    drag.current = {
      active: true,
      moved: false,
      x: event.nativeEvent.clientX,
      y: event.nativeEvent.clientY,
    };
    capture(event);
  };

  const onMove = (event: ThreeEvent<PointerEvent>) => {
    if (!drag.current.active) return;
    event.stopPropagation();
    const dx = event.nativeEvent.clientX - drag.current.x;
    const dy = event.nativeEvent.clientY - drag.current.y;
    if (Math.hypot(dx, dy) > 8) drag.current.moved = true;
    if (drag.current.moved) {
      const local = toLocal(event);
      if (local.radius > 1.2) onScrubMinutes(local.minutes);
    }
  };

  const onUp = (event: ThreeEvent<PointerEvent>) => {
    if (!drag.current.active) return;
    event.stopPropagation();
    const moved = drag.current.moved;
    drag.current.active = false;
    if (moved) return;
    const local = toLocal(event);
    if (local.radius < INNER) return;
    const hours = dateFromMinutes(local.minutes, new Date()).getHours();
    onSelectIndex(shichenIndexFromHour(hours));
  };

  const needle = angleDegFromMinutes(minutes);
  const needleRad = (needle * Math.PI) / 180;
  const nx = Math.cos(needleRad);
  const ny = Math.sin(needleRad);
  const needleLen = OUTER - 1.45;

  return (
    <group
      ref={group}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.14]} receiveShadow>
        <cylinderGeometry args={[5.25, 5.25, 0.12, 64]} />
        <meshStandardMaterial color="#2a2118" metalness={0.25} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0, -0.06]}>
        <torusGeometry args={[5.08, 0.07, 8, 80]} />
        <meshStandardMaterial color="#c4a46a" metalness={0.7} roughness={0.28} />
      </mesh>

      {SHICHEN.map((item) => {
        const selected = item.index === selectedIndex;
        const labelRad = (wedgeStartDeg(item.index) + 15) * (Math.PI / 180);
        return (
          <group key={item.id}>
            <mesh
              geometry={geometries[item.index]}
              position={[0, 0, selected ? 0.05 : 0]}
              castShadow
            >
              <meshStandardMaterial
                color={selected ? "#7a1e1e" : item.sky.disc}
                emissive={selected ? "#5a120f" : "#000000"}
                emissiveIntensity={selected ? 0.45 : 0}
                metalness={0.32}
                roughness={0.42}
              />
            </mesh>
            <mesh
              position={[
                Math.cos(labelRad) * LABEL_R,
                Math.sin(labelRad) * LABEL_R,
                0.16,
              ]}
            >
              <planeGeometry args={[0.72, 0.72]} />
              <meshBasicMaterial
                map={charTexture(
                  item.branch,
                  selected ? "#f8e7c2" : item.sky.brass,
                )}
                transparent
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}

      {Array.from({ length: 24 }, (_, hour) => {
        const deg = 90 - hour * 15;
        const rad = (deg * Math.PI) / 180;
        const long = hour % 2 === 0;
        const len = long ? 0.32 : 0.18;
        const mid = 4.92 - len / 2;
        return (
          <mesh
            key={hour}
            position={[Math.cos(rad) * mid, Math.sin(rad) * mid, 0.13]}
            rotation={[0, 0, rad]}
          >
            <boxGeometry args={[len, long ? 0.045 : 0.025, 0.04]} />
            <meshStandardMaterial color="#d9c29a" metalness={0.4} roughness={0.4} />
          </mesh>
        );
      })}

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.12]} castShadow>
        <cylinderGeometry args={[1.28, 1.38, 0.28, 32]} />
        <meshStandardMaterial color="#3a2c20" metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.55, 0.55, 0.12, 24]} />
        <meshStandardMaterial color="#b89048" metalness={0.75} roughness={0.25} />
      </mesh>

      <mesh
        position={[nx * (needleLen / 2 + 0.7), ny * (needleLen / 2 + 0.7), 0.3]}
        rotation={[0, 0, needleRad]}
      >
        <boxGeometry args={[needleLen, 0.07, 0.07]} />
        <meshStandardMaterial
          color="#e8c878"
          emissive="#a87820"
          emissiveIntensity={0.35}
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[nx * (OUTER - 0.12), ny * (OUTER - 0.12), 0.34]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#f0d090"
          emissive="#d4a040"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
