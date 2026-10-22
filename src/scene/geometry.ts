import * as THREE from "three";

const cache = new Map<string, THREE.CanvasTexture>();

export function charTexture(char: string, color: string): THREE.CanvasTexture {
  const key = `${char}:${color}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.clearRect(0, 0, 256, 256);
  ctx.fillStyle = color;
  ctx.font = '700 148px "Noto Serif SC", "Songti SC", serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, 128, 140);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  cache.set(key, texture);
  return texture;
}

export function createSectorGeometry(
  inner: number,
  outer: number,
  startDeg: number,
  lengthDeg: number,
  depth: number,
): THREE.ExtrudeGeometry {
  const start = (startDeg * Math.PI) / 180;
  const end = ((startDeg + lengthDeg) * Math.PI) / 180;
  const shape = new THREE.Shape();
  shape.moveTo(Math.cos(start) * inner, Math.sin(start) * inner);
  shape.lineTo(Math.cos(start) * outer, Math.sin(start) * outer);
  shape.absarc(0, 0, outer, start, end, false);
  shape.lineTo(Math.cos(end) * inner, Math.sin(end) * inner);
  shape.absarc(0, 0, inner, end, start, true);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    curveSegments: 28,
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}
