'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

const THREAD = new THREE.Color('#26304F');
const SPIDER = new THREE.Color('#F03A42');
const WEB = new THREE.Color('#6E93F5');

type WebGeometry = {
  positions: Float32Array;
  colors: Float32Array;
};

/**
 * Builds an orb web as line segments.
 *
 * Radial threads run from the hub outwards; cross-threads sag between adjacent
 * radials, which is why each cross edge is subdivided rather than drawn
 * straight — the sag is what stops it reading as a wagon wheel. A little z
 * displacement per radial gives the whole thing depth so rotation is legible.
 */
function buildWeb(
  radials: number,
  rings: number,
  radius: number,
  accentEvery: number,
): WebGeometry {
  const positions: number[] = [];
  const colors: number[] = [];
  const SEGMENTS = 5; // sub-segments per cross-thread, for the sag
  const SAG = 0.86;

  const point = (i: number, r: number) => {
    const a = (i / radials) * Math.PI * 2;
    // Depth wobble keyed to the radial index, scaled by distance from hub.
    const z = Math.sin(i * 1.7) * 0.28 * (r / radius);
    return new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, z);
  };

  const push = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Color) => {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    colors.push(c.r, c.g, c.b, c.r, c.g, c.b);
  };

  for (let i = 0; i < radials; i++) {
    const isAccent = i % accentEvery === 0;
    const radialColor = isAccent ? SPIDER : THREAD;

    // Radial thread, hub outwards, drawn ring to ring.
    for (let k = 0; k < rings; k++) {
      const r0 = (radius * k) / rings;
      const r1 = (radius * (k + 1)) / rings;
      push(point(i, r0), point(i, r1), radialColor);
    }

    // Cross-threads, sagging towards the hub between this radial and the next.
    for (let k = 1; k <= rings; k++) {
      const r = (radius * k) / rings;
      const crossColor = isAccent ? WEB : THREAD;

      for (let s = 0; s < SEGMENTS; s++) {
        const t0 = s / SEGMENTS;
        const t1 = (s + 1) / SEGMENTS;
        // Sag profile: full radius at the anchors, pulled in at mid-span.
        const sag = (t: number) => r * (1 - (1 - SAG) * Math.sin(t * Math.PI));
        push(
          point(i + t0, sag(t0)),
          point(i + t1, sag(t1)),
          crossColor,
        );
      }
    }
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
  };
}

function Web({
  radials,
  rings,
  radius,
  accentEvery,
  opacity,
  ...props
}: {
  radials: number;
  rings: number;
  radius: number;
  accentEvery: number;
  opacity: number;
} & ThreeElements['lineSegments']) {
  const geometry = useMemo(() => {
    const { positions, colors } = buildWeb(radials, rings, radius, accentEvery);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, [radials, rings, radius, accentEvery]);

  return (
    <lineSegments geometry={geometry} {...props}>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/** Two webs at different depths, plus pointer parallax on the whole rig. */
function Scene() {
  const rig = useRef<THREE.Group>(null);
  const near = useRef<THREE.Group>(null);
  const far = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Counter-rotation between the layers is what reads as depth.
    if (near.current) near.current.rotation.z += delta * 0.035;
    if (far.current) far.current.rotation.z -= delta * 0.022;

    if (rig.current) {
      const { x, y } = state.pointer;
      // Damped follow, so the rig trails the pointer instead of snapping.
      rig.current.rotation.y +=
        (x * 0.28 - rig.current.rotation.y) * Math.min(1, delta * 2.4);
      rig.current.rotation.x +=
        (-y * 0.2 - rig.current.rotation.x) * Math.min(1, delta * 2.4);
    }
  });

  return (
    <group ref={rig}>
      <group ref={far} position={[1.4, 0.2, -5]} rotation={[0.5, 0.35, 0.4]}>
        <Web radials={16} rings={6} radius={7.2} accentEvery={16} opacity={0.5} />
      </group>
      <group ref={near} position={[0, 0, 0]} rotation={[0.32, -0.28, 0]}>
        <Web radials={20} rings={8} radius={5.4} accentEvery={7} opacity={0.95} />
      </group>
    </group>
  );
}

export default function WebLattice() {
  return (
    <Canvas
      camera={{ position: [0, 0, 11], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      style={{ pointerEvents: 'none' }}
    >
      <Scene />
    </Canvas>
  );
}
