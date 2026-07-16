/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useLoader, useThree } from '@react-three/fiber';
import {
    useTexture,
    Environment,
    Lightformer,
    RoundedBox,
    shaderMaterial,
} from '@react-three/drei';
import {
    BallCollider,
    CuboidCollider,
    Physics,
    RigidBody,
    useRopeJoint,
    useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
    roundedImageMaterial: any;
  }
}

import * as THREE from 'three';
import './Lanyard.css';

const PHOTO_TEXTURE = '/lanyard/maruf.jpg';
const LANYARD_PNG = '/lanyard/lanyard.png';

const RoundedImageMaterial = shaderMaterial(
    {
        uTexture: null,
        uRadius: 0.05,
        uSize: new THREE.Vector2(1.6, 2.3),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uRadius;
    uniform vec2 uSize;

    float sdRoundedBox(in vec2 p, in vec2 b, in float r) {
        vec2 q = abs(p) - b + r;
        return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
    }

    void main() {
        vec2 p = (vUv - 0.5) * uSize;
        float d = sdRoundedBox(p, uSize * 0.5, uRadius);
        float alpha = 1.0 - smoothstep(-0.005, 0.005, d);
        if (alpha <= 0.0) discard;
        vec4 color = texture2D(uTexture, vUv);
        gl_FragColor = vec4(color.rgb, color.a * alpha);
    }
    `
);

extend({ MeshLineGeometry, MeshLineMaterial, RoundedImageMaterial });

type LanyardProps = {
    position?: [number, number, number];
    gravity?: [number, number, number];
    fov?: number;
    transparent?: boolean;
};

export default function Lanyard({
    position = [0, 0, 30],
    gravity = [0, -40, 0],
    fov = 20,
    transparent = true,
}: LanyardProps) {
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== 'undefined' && window.innerWidth < 768,
    );

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="lanyard-wrapper" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Canvas
                camera={{ position: position, fov: fov }}
                dpr={[1, isMobile ? 1.5 : 2]}
                gl={{ alpha: transparent }}
                onCreated={({ gl }) =>
                    gl.setClearColor(
                        new THREE.Color(0x000000),
                        transparent ? 0 : 1,
                    )
                }
            >
                <ambientLight intensity={Math.PI} />
                <Physics
                    gravity={gravity}
                    timeStep={isMobile ? 1 / 30 : 1 / 60}
                >
                    <Band isMobile={isMobile} />
                </Physics>
                <Environment blur={0.75}>
                    <Lightformer
                        intensity={2}
                        color="white"
                        position={[0, -1, 5]}
                        rotation={[0, 0, Math.PI / 3]}
                        scale={[100, 0.1, 1]}
                    />
                    <Lightformer
                        intensity={3}
                        color="white"
                        position={[-1, -1, 1]}
                        rotation={[0, 0, Math.PI / 3]}
                        scale={[100, 0.1, 1]}
                    />
                    <Lightformer
                        intensity={3}
                        color="white"
                        position={[1, 1, 1]}
                        rotation={[0, 0, Math.PI / 3]}
                        scale={[100, 0.1, 1]}
                    />
                    <Lightformer
                        intensity={10}
                        color="white"
                        position={[-10, 0, 14]}
                        rotation={[0, Math.PI / 2, Math.PI / 3]}
                        scale={[100, 10, 1]}
                    />
                </Environment>
            </Canvas>
        </div>
    );
}

function PhotoCard({ isMobile }: { isMobile: boolean }) {
    const photoTexture = useLoader(THREE.TextureLoader, PHOTO_TEXTURE);
    photoTexture.colorSpace = THREE.SRGBColorSpace;

    return (
        <group>
            {/* Glow border behind the card */}
            <RoundedBox
                args={[1.82, 2.52, 0.01]}
                radius={0.07}
                smoothness={4}
                position={[0, 0, -0.02]}
            >
                <meshBasicMaterial
                    color="#00ff41"
                    transparent
                    opacity={isMobile ? 0.15 : 0.25}
                />
            </RoundedBox>

            {/* Outer frame */}
            <RoundedBox
                args={[1.78, 2.48, 0.03]}
                radius={0.06}
                smoothness={4}
                position={[0, 0, -0.01]}
            >
                <meshPhysicalMaterial
                    color="#1a1a1a"
                    roughness={0.3}
                    metalness={0.9}
                />
            </RoundedBox>

            {/* Photo surface */}
            <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[1.6, 2.3]} />
                {/* @ts-ignore */}
                <roundedImageMaterial
                    uTexture={photoTexture}
                    uRadius={0.06}
                    uSize={new THREE.Vector2(1.6, 2.3)}
                    transparent
                />
            </mesh>

            {/* Top accent line */}
            <mesh position={[0, 1.2, 0.02]}>
                <planeGeometry args={[1.6, 0.003]} />
                <meshBasicMaterial color="#00ff41" transparent opacity={0.6} />
            </mesh>
        </group>
    );
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }) {
    const band = useRef<any>(null),
        fixed = useRef<any>(null),
        j1 = useRef<any>(null),
        j2 = useRef<any>(null),
        j3 = useRef<any>(null),
        card = useRef<any>(null);
    const vec = new THREE.Vector3(),
        ang = new THREE.Vector3(),
        rot = new THREE.Vector3(),
        dir = new THREE.Vector3();
    const segmentProps = {
        type: 'dynamic' as const,
        canSleep: true,
        colliders: false as const,
        angularDamping: 4,
        linearDamping: 4,
    };
    const texture = useTexture(LANYARD_PNG);
    const { width, height } = useThree((state) => state.size);
    const [curve] = useState(
        () =>
            new THREE.CatmullRomCurve3([
                new THREE.Vector3(),
                new THREE.Vector3(),
                new THREE.Vector3(),
                new THREE.Vector3(),
            ]),
    );
    const [dragged, drag] = useState<any>(false);
    const [hovered, hover] = useState(false);

    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
    useSphericalJoint(j3, card, [
        [0, 0, 0],
        [0, 1.5, 0],
    ]);

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = dragged ? 'grabbing' : 'grab';
            return () => void (document.body.style.cursor = 'auto');
        }
    }, [hovered, dragged]);

    useFrame((state, delta) => {
        if (dragged) {
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(
                state.camera,
            );
            dir.copy(vec)
                .sub(state.camera.position)
                .normalize();
            vec.add(dir.multiplyScalar(state.camera.position.length()));
            [card, j1, j2, j3, fixed].forEach((ref) =>
                ref.current?.wakeUp(),
            );
            card.current?.setNextKinematicTranslation({
                x: vec.x - dragged.x,
                y: vec.y - dragged.y,
                z: vec.z - dragged.z,
            });
        }
        if (fixed.current) {
            [j1, j2].forEach((ref) => {
                if (!ref.current.lerped)
                    ref.current.lerped = new THREE.Vector3().copy(
                        ref.current.translation(),
                    );
                const clampedDistance = Math.max(
                    0.1,
                    Math.min(
                        1,
                        ref.current.lerped.distanceTo(
                            ref.current.translation(),
                        ),
                    ),
                );
                ref.current.lerped.lerp(
                    ref.current.translation(),
                    delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
                );
            });
            curve.points[0].copy(j3.current.translation());
            curve.points[1].copy(j2.current.lerped);
            curve.points[2].copy(j1.current.lerped);
            curve.points[3].copy(fixed.current.translation());
            band.current.geometry.setPoints(
                curve.getPoints(isMobile ? 16 : 32),
            );
            ang.copy(card.current.angvel());
            rot.copy(card.current.rotation());
            card.current.setAngvel({
                x: ang.x,
                y: ang.y - rot.y * 0.25,
                z: ang.z,
            });
        }
    });

    curve.curveType = 'chordal';
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    return (
        <>
            <group position={[0, 4, 0]}>
                <RigidBody ref={fixed} {...segmentProps} type="fixed" />
                <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody
                    position={[2, 0, 0]}
                    ref={card}
                    {...segmentProps}
                    type={dragged ? 'kinematicPosition' : 'dynamic'}
                >
                    <CuboidCollider args={[0.8, 1.2, 0.02]} />
                    <group
                        scale={2.25}
                        position={[0, -1.2, -0.05]}
                        onPointerOver={() => hover(true)}
                        onPointerOut={() => hover(false)}
                        onPointerUp={(e: any) => (
                            e.target.releasePointerCapture(e.pointerId),
                            drag(false)
                        )}
                        onPointerDown={(e: any) => (
                            e.target.setPointerCapture(e.pointerId),
                            drag(
                                new THREE.Vector3()
                                    .copy(e.point)
                                    .sub(
                                        vec.copy(card.current.translation()),
                                    ),
                            )
                        )}
                    >
                        <PhotoCard isMobile={isMobile} />
                    </group>
                </RigidBody>
            </group>
            <mesh ref={band}>
                <meshLineGeometry />
                <meshLineMaterial
                    color="white"
                    depthTest={false}
                    resolution={[width, height]}
                    useMap
                    map={texture}
                    repeat={[-4, 1]}
                    lineWidth={1}
                    transparent={true}
                />
            </mesh>
        </>
    );
}
