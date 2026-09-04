'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

const THREAD = new THREE.Color('#26304F');
const SPIDER = new THREE.Color('#F03A42');
const WEB = new THREE.Color('#6E93F5');
const SILK = new THREE.Color('#F2F4F8');

type WebGeometry = {
  positions: Float32Array;
  colors: Float32Array;
  /** Anchor points where a radial crosses a ring — drawn as dew. */
  nodes: Float32Array;
  nodeColors: Float32Array;
};

/**
 * Builds an orb web as line segments, plus the node cloud that sits on it.
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
  const nodes: number[] = [];
  const nodeColors: number[] = [];
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
        push(point(i + t0, sag(t0)), point(i + t1, sag(t1)), crossColor);
      }
    }

    /*
     * Dew. Only on the outer rings — a node at every intersection turns the
     * web into a dot grid and kills the line work that carries the shape.
     */
    for (let k = Math.ceil(rings / 2); k <= rings; k++) {
      const p = point(i, (radius * k) / rings);
      nodes.push(p.x, p.y, p.z);
      const c = isAccent ? SPIDER : k === rings ? WEB : SILK;
      nodeColors.push(c.r, c.g, c.b);
    }
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    nodes: new Float32Array(nodes),
    nodeColors: new Float32Array(nodeColors),
  };
}

function Web({
  radials,
  rings,
  radius,
  accentEvery,
  opacity,
  dew = 0,
  ...props
}: {
  radials: number;
  rings: number;
  radius: number;
  accentEvery: number;
  opacity: number;
  /** Point size for the dew cloud. Zero omits it entirely. */
  dew?: number;
} & ThreeElements['group']) {
  const { lines, points } = useMemo(() => {
    const built = buildWeb(radials, rings, radius, accentEvery);

    const l = new THREE.BufferGeometry();
    l.setAttribute('position', new THREE.BufferAttribute(built.positions, 3));
    l.setAttribute('color', new THREE.BufferAttribute(built.colors, 3));

    const p = new THREE.BufferGeometry();
    p.setAttribute('position', new THREE.BufferAttribute(built.nodes, 3));
    p.setAttribute('color', new THREE.BufferAttribute(built.nodeColors, 3));

    return { lines: l, points: p };
  }, [radials, rings, radius, accentEvery]);

  return (
    <group {...props}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={opacity}
          depthWrite={false}
        />
      </lineSegments>

      {dew > 0 ? (
        <points geometry={points}>
          <pointsMaterial
            vertexColors
            transparent
            size={dew}
            sizeAttenuation
            opacity={opacity * 0.9}
            depthWrite={false}
            // Additive keeps the dew reading as light on a dark ground rather
            // than as flat dots sitting on top of the threads.
            blending={THREE.AdditiveBlending}
          />
        </points>
      ) : null}
    </group>
  );
}

/** Three webs at different depths, plus pointer parallax on the whole rig. */
function Scene() {
  const rig = useRef<THREE.Group>(null);
  const near = useRef<THREE.Group>(null);
  const mid = useRef<THREE.Group>(null);
  const far = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Clamp: a backgrounded tab resumes with a huge delta and the whole rig
    // would snap a quarter-turn on the first frame back.
    const dt = Math.min(delta, 0.05);

    // Counter-rotation between the layers is what reads as depth.
    if (near.current) near.current.rotation.z += dt * 0.035;
    if (mid.current) mid.current.rotation.z -= dt * 0.014;
    if (far.current) far.current.rotation.z -= dt * 0.022;

    // Slow breathing on the near layer. Small enough to feel alive, not float.
    if (near.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.35) * 0.018;
      near.current.scale.setScalar(s);
    }

    if (rig.current) {
      const { x, y } = state.pointer;
      // Damped follow, so the rig trails the pointer instead of snapping.
      const k = Math.min(1, dt * 2.4);
      rig.current.rotation.y += (x * 0.3 - rig.current.rotation.y) * k;
      rig.current.rotation.x += (-y * 0.22 - rig.current.rotation.x) * k;
    }
  });

  return (
    <group ref={rig}>
      <Web
        ref={far}
        position={[1.4, 0.2, -5]}
        rotation={[0.5, 0.35, 0.4]}
        radials={16}
        rings={6}
        radius={7.2}
        accentEvery={16}
        opacity={0.4}
      />
      <Web
        ref={mid}
        position={[-2.6, -1.4, -2.4]}
        rotation={[-0.42, 0.5, 1.1]}
        radials={12}
        rings={5}
        radius={4.4}
        accentEvery={12}
        opacity={0.3}
      />
      <Web
        ref={near}
        position={[0, 0, 0]}
        rotation={[0.32, -0.28, 0]}
        radials={20}
        rings={8}
        radius={5.4}
        accentEvery={7}
        opacity={0.95}
        dew={0.075}
      />
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
