"use client";

import { Canvas, extend } from "@react-three/fiber";
import {
  useTexture,
  shaderMaterial,
  OrthographicCamera,
} from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import { useEditorStore } from "@/store/editorStore";

const ColorGradeMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uExposure: 0.0,
    uContrast: 1.0,
    uSaturation: 1.0,
    uTemperature: 0.0,
    uTint: 0.0,
    uLift: new THREE.Vector3(0, 0, 0),
    uGamma: new THREE.Vector3(1, 1, 1),
    uGain: new THREE.Vector3(1, 1, 1),
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform sampler2D uTexture;
    uniform float uExposure;
    uniform float uContrast;
    uniform float uSaturation;
    uniform float uTemperature;
    uniform float uTint;
    
    uniform vec3 uLift;
    uniform vec3 uGamma;
    uniform vec3 uGain;
    
    varying vec2 vUv;

    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      vec3 color = texColor.rgb;

      // 1. Exposure & Contrast
      color *= exp2(uExposure);
      color = (color - 0.5) * uContrast + 0.5;

      // 2. Temp & Tint
      color.r += uTemperature;
      color.b -= uTemperature;
      color.g += uTint;

      // 3. DaVinci 3-Way Color Wheels (Lift, Gamma, Gain Math)
      // Gain (Highlights multiplier)
      color = color * uGain;
      
      // Lift (Shadows offset)
      color = color + uLift * (1.0 - color);
      
      // Gamma (Midtones power curve)
      // Max bounds applied to prevent breaking pow function with negative numbers
      color = pow(max(color, vec3(0.0)), 1.0 / uGamma);

      // 4. Saturation
      float luma = dot(color, vec3(0.299, 0.587, 0.114));
      color = mix(vec3(luma), color, uSaturation);

      gl_FragColor = vec4(color, texColor.a);
    }
  `,
);

extend({ ColorGradeMaterial });

function ImagePlane({ imageUrl }: { imageUrl: string }) {
  const texture = useTexture(imageUrl);

  const {
    exposure,
    contrast,
    saturation,
    temperature,
    tint,
    rotation,
    lift,
    gamma,
    gain,
  } = useEditorStore();

  const image = texture.image as HTMLImageElement;
  const aspect = image.width / image.height;

  return (
    <mesh scale={[aspect * 5, 5, 1]} rotation={[0, 0, rotation]}>
      <planeGeometry args={[1, 1]} />
      {/* @ts-ignore */}
      <colorGradeMaterial
        uTexture={texture}
        uExposure={exposure}
        uContrast={contrast}
        uSaturation={saturation}
        uTemperature={temperature}
        uTint={tint}
        uLift={new THREE.Vector3(...lift)}
        uGamma={new THREE.Vector3(...gamma)}
        uGain={new THREE.Vector3(...gain)}
      />
    </mesh>
  );
}

export default function EditorCanvas() {
  const { imageData, zoom } = useEditorStore();

  if (!imageData) return null;

  return (
    <Canvas className="w-full h-full relative">
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={zoom} />
      <Suspense fallback={null}>
        <ImagePlane imageUrl={imageData} />
      </Suspense>
    </Canvas>
  );
}
