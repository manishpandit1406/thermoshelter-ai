'use client';
import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Grid, Html, Environment } from '@react-three/drei';
import * as THREE from 'three';

// ── Types ──────────────────────────────────────────────────────────
interface MonthlyData {
  m: string;
  out: number;
  in: number;
  heat: number;
  cool: number;
}

interface ShelterConfig {
  width?: number;
  length?: number;
  height?: number;
  roofType?: 'flat' | 'pitched' | 'vaulted' | 'mono';
}

interface ShelterViewer3DProps {
  monthly: MonthlyData[];
  config?: ShelterConfig;
}

// ── Color Helpers ──────────────────────────────────────────────────
/** Map temperature to HSL colour (blue=cold → green=comfortable → red=hot) */
function tempToColor(temp: number, minT = 8, maxT = 48): THREE.Color {
  const t = Math.max(0, Math.min(1, (temp - minT) / (maxT - minT)));
  // blue (240°) → green (120°) → yellow (60°) → red (0°)
  const hue = (1 - t) * 0.667; // 0.667 = blue, 0 = red in Three.js HSL
  return new THREE.Color().setHSL(hue, 0.85, 0.52);
}

function tempToHex(temp: number, minT = 8, maxT = 48): string {
  return '#' + tempToColor(temp, minT, maxT).getHexString();
}

// ── Sub-components ─────────────────────────────────────────────────

/** Single wall face as a box mesh */
function WallFace({
  position, size, color, label, temp
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: THREE.Color;
  label?: string;
  temp: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshStandardMaterial).color.lerp(
        hovered ? new THREE.Color('#ffffff') : color,
        0.05
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.6}
        metalness={0.05}
        envMapIntensity={0.4}
      />
      {hovered && label && (
        <Html distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(15,23,42,.9)',
            color: 'white',
            padding: '.4rem .7rem',
            borderRadius: '6px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 12px rgba(0,0,0,.3)',
          }}>
            {label}<br />
            <span style={{ color: '#94A3B8', fontSize: '11px' }}>{temp.toFixed(1)}°C surface</span>
          </div>
        </Html>
      )}
    </mesh>
  );
}

/** Pitched roof using custom triangular prism geometry */
function PitchedRoof({
  w, l, baseY, ridgeH, color
}: {
  w: number; l: number; baseY: number; ridgeH: number; color: THREE.Color;
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const hw = w / 2, hl = l / 2;
    // vertices: 4 base corners + 2 ridge top
    const verts = new Float32Array([
      -hw, baseY,  hl,   // 0 front-left
       hw, baseY,  hl,   // 1 front-right
       hw, baseY, -hl,   // 2 back-right
      -hw, baseY, -hl,   // 3 back-left
        0, baseY + ridgeH,  hl,  // 4 front-ridge
        0, baseY + ridgeH, -hl,  // 5 back-ridge
    ]);
    // triangles
    const idx = new Uint16Array([
      // left slope
      0, 4, 3,  4, 5, 3,
      // right slope
      1, 2, 4,  2, 5, 4,
      // front gable
      0, 1, 4,
      // back gable
      3, 5, 2,
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geo.setIndex(new THREE.BufferAttribute(idx, 1));
    geo.computeVertexNormals();
    return geo;
  }, [w, l, baseY, ridgeH]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.05} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** Window pane — transparent blue glass */
function WindowPane({ position, size }: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={new THREE.Color(0.4, 0.7, 1)}
        transparent
        opacity={0.35}
        roughness={0.05}
        metalness={0.1}
      />
    </mesh>
  );
}

/** Rotating sun indicator */
function SunIndicator({ month }: { month: number }) {
  // Solar elevation varies by month for Jaisalmer lat ~27°N
  const elevations = [40, 50, 63, 75, 82, 80, 78, 76, 68, 55, 43, 37];
  const el = (elevations[month] ?? 60) * (Math.PI / 180);
  // azimuth: sun rises E, sets W; peak at S in winter
  const az = (month < 6 ? 0.2 : -0.2); // slight east-west bias by season
  const dist = 12;
  const sx = Math.sin(az) * dist;
  const sy = Math.sin(el) * dist;
  const sz = -Math.cos(az) * dist;

  return (
    <>
      {/* Sun sphere */}
      <mesh position={[sx, sy, sz]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color={new THREE.Color(1, 0.95, 0.3)} emissive={new THREE.Color(1, 0.8, 0)} emissiveIntensity={1.5} />
      </mesh>
      {/* Sun rays (line) */}
      <directionalLight
        position={[sx, sy, sz]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color={new THREE.Color(1, 0.97, 0.88)}
      />
    </>
  );
}

/** Main shelter model */
function ShelterModel({
  w, l, h, monthly, monthIdx, roofType
}: {
  w: number; l: number; h: number;
  monthly: MonthlyData[];
  monthIdx: number;
  roofType: string;
}) {
  const data = monthly[monthIdx];
  const minT = Math.min(...monthly.map(m => m.out));
  const maxT = Math.max(...monthly.map(m => m.out));

  // Surface temps: apply solar multipliers per face
  const southTemp = data.out + 8;   // direct sun
  const northTemp = data.out - 2;   // shaded
  const eastTemp  = data.out + 4;   // morning sun
  const westTemp  = data.out + 6;   // afternoon sun
  const roofTemp  = data.out + 12;  // direct overhead
  const floorTemp = data.out - 5;   // ground insulation

  const wallT = 0.2; // wall thickness

  return (
    <group>
      {/* Floor */}
      <WallFace
        position={[0, -wallT / 2, 0]} size={[w, wallT, l]}
        color={tempToColor(floorTemp, minT, maxT)}
        label="Floor" temp={floorTemp}
      />

      {/* South wall */}
      <WallFace
        position={[0, h / 2, l / 2]} size={[w, h, wallT]}
        color={tempToColor(southTemp, minT, maxT)}
        label="South Wall (☀️ most sun)" temp={southTemp}
      />

      {/* North wall */}
      <WallFace
        position={[0, h / 2, -l / 2]} size={[w, h, wallT]}
        color={tempToColor(northTemp, minT, maxT)}
        label="North Wall (shaded)" temp={northTemp}
      />

      {/* East wall */}
      <WallFace
        position={[w / 2, h / 2, 0]} size={[wallT, h, l]}
        color={tempToColor(eastTemp, minT, maxT)}
        label="East Wall (morning ☀️)" temp={eastTemp}
      />

      {/* West wall */}
      <WallFace
        position={[-w / 2, h / 2, 0]} size={[wallT, h, l]}
        color={tempToColor(westTemp, minT, maxT)}
        label="West Wall (afternoon ☀️)" temp={westTemp}
      />

      {/* Roof */}
      {roofType === 'pitched' ? (
        <PitchedRoof
          w={w + wallT} l={l + wallT} baseY={h} ridgeH={h * 0.4}
          color={tempToColor(roofTemp, minT, maxT)}
        />
      ) : (
        <WallFace
          position={[0, h + wallT / 2, 0]} size={[w + wallT, wallT, l + wallT]}
          color={tempToColor(roofTemp, minT, maxT)}
          label="Roof (hottest 🔥)" temp={roofTemp}
        />
      )}

      {/* Windows — south wall, 2 × small panes */}
      <WindowPane position={[-w * 0.2, h * 0.5, l / 2]} size={[w * 0.2, h * 0.35, 0.05]} />
      <WindowPane position={[ w * 0.2, h * 0.5, l / 2]} size={[w * 0.2, h * 0.35, 0.05]} />

      {/* Interior temp indicator — floating text */}
      <Html position={[0, h * 0.6, 0]} distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(15,23,42,.85)',
          color: 'white',
          padding: '.3rem .6rem',
          borderRadius: '5px',
          fontSize: '11px',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}>
          🌡 Interior: <strong style={{ color: tempToHex(data.in, minT, maxT) }}>{data.in}°C</strong>
        </div>
      </Html>
    </group>
  );
}

// ── Main Exported Component ────────────────────────────────────────
export default function ShelterViewer3D({
  monthly,
  config = {},
}: ShelterViewer3DProps) {
  const {
    width = 8,
    length = 12,
    height = 3,
    roofType = 'flat',
  } = config;

  const [monthIdx, setMonthIdx] = useState(4); // May by default (hottest)
  const [autoRotate, setAutoRotate] = useState(true);
  const [showWireframe, setShowWireframe] = useState(false);
  const data = monthly[monthIdx];
  const minT = Math.min(...monthly.map(m => m.out));
  const maxT = Math.max(...monthly.map(m => m.out));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* Controls bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
        padding: '.75rem 1rem',
        background: '#0F172A',
        borderRadius: '12px 12px 0 0',
        borderBottom: '1px solid rgba(255,255,255,.08)',
      }}>
        <span style={{ fontSize: '.75rem', fontWeight: 600, color: '#64748B', letterSpacing: '.06em', textTransform: 'uppercase' }}>
          3D Thermal View
        </span>

        {/* Month selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginLeft: 'auto' }}>
          <span style={{ fontSize: '.75rem', color: '#94A3B8' }}>Month:</span>
          <div style={{ display: 'flex', gap: '3px' }}>
            {monthly.map((m, i) => (
              <button
                key={m.m}
                onClick={() => setMonthIdx(i)}
                style={{
                  padding: '.25rem .375rem',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '.65rem',
                  fontWeight: monthIdx === i ? 700 : 400,
                  background: monthIdx === i
                    ? tempToHex(m.out, minT, maxT)
                    : 'rgba(255,255,255,.06)',
                  color: monthIdx === i ? 'white' : '#64748B',
                  transition: 'all .1s',
                  minWidth: '26px',
                }}
              >
                {m.m}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <button
          onClick={() => setAutoRotate(r => !r)}
          style={{
            background: autoRotate ? 'rgba(37,99,235,.3)' : 'rgba(255,255,255,.06)',
            border: '1px solid rgba(255,255,255,.1)',
            color: autoRotate ? '#93C5FD' : '#64748B',
            padding: '.25rem .625rem',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '.7rem',
            fontWeight: 500,
          }}
        >
          ↻ Auto-rotate
        </button>
      </div>

      {/* Canvas */}
      <div style={{ height: '420px', background: '#0F172A', borderRadius: '0 0 12px 12px', overflow: 'hidden', position: 'relative' }}>
        <Canvas
          shadows
          camera={{ position: [width * 1.6, height * 2.2, length * 1.6], fov: 45 }}
          gl={{ antialias: true, alpha: false }}
          style={{ background: '#0B1120' }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.4} color="#E0EEFF" />
          <SunIndicator month={monthIdx} />

          {/* Ground grid */}
          <Grid
            args={[40, 40]}
            cellSize={1}
            cellThickness={0.3}
            cellColor="#1E293B"
            sectionSize={4}
            sectionThickness={0.8}
            sectionColor="#334155"
            fadeDistance={30}
            position={[0, -0.01, 0]}
          />

          {/* Ground plane (shadow catcher) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
            <planeGeometry args={[40, 40]} />
            <shadowMaterial opacity={0.25} />
          </mesh>

          {/* Shelter */}
          <ShelterModel
            w={width} l={length} h={height}
            monthly={monthly}
            monthIdx={monthIdx}
            roofType={roofType}
          />

          {/* Controls */}
          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={0.6}
            enablePan={true}
            enableZoom={true}
            minDistance={4}
            maxDistance={35}
            maxPolarAngle={Math.PI / 2.05}
          />
        </Canvas>

        {/* Month info overlay */}
        <div style={{
          position: 'absolute', bottom: '1rem', left: '1rem',
          background: 'rgba(15,23,42,.88)',
          borderRadius: '8px',
          padding: '.625rem .875rem',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,.08)',
        }}>
          <div style={{ fontSize: '.7rem', color: '#64748B', fontWeight: 600, letterSpacing: '.06em', marginBottom: '.25rem' }}>
            {data.m.toUpperCase()} — OUTDOOR
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: tempToHex(data.out, minT, maxT), lineHeight: 1 }}>
            {data.out}°C
          </div>
          <div style={{ fontSize: '.7rem', color: '#94A3B8', marginTop: '.25rem' }}>
            Indoor: {data.in}°C
          </div>
        </div>

        {/* Heatmap legend */}
        <div style={{
          position: 'absolute', bottom: '1rem', right: '1rem',
          background: 'rgba(15,23,42,.88)',
          borderRadius: '8px',
          padding: '.625rem .875rem',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,.08)',
          display: 'flex', flexDirection: 'column', gap: '.375rem',
        }}>
          <div style={{ fontSize: '.65rem', color: '#64748B', fontWeight: 600, letterSpacing: '.06em' }}>SURFACE TEMP</div>
          <div style={{
            width: '80px', height: '10px',
            borderRadius: '4px',
            background: 'linear-gradient(to right, #3B82F6, #34D399, #FBBF24, #EF4444)',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.6rem', color: '#64748B' }}>
            <span>{minT}°C</span>
            <span>{maxT}°C</span>
          </div>
          <div style={{ fontSize: '.65rem', color: '#475569', marginTop: '.1rem' }}>
            Hover walls for details
          </div>
        </div>

        {/* Hint */}
        <div style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'rgba(15,23,42,.7)',
          borderRadius: '6px',
          padding: '.375rem .625rem',
          fontSize: '.65rem',
          color: '#64748B',
        }}>
          🖱 Drag to orbit · Scroll to zoom
        </div>
      </div>
    </div>
  );
}
