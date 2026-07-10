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
    uGrain: 0.0,
    uAsciiSize: 0.0,
    uAsciiDensity: 100.0,
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
    
    uniform float uGrain;
    uniform float uAsciiSize;
    uniform float uAsciiDensity;
    
    varying vec2 vUv;

    // Pseudo-random noise function for Film Grain
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vec2 sampleUv = vUv;
      
      // 1. Matrix Base Pixelation
      if (uAsciiSize > 0.0) {
        vec2 pixelSize = vec2(1.0 / uAsciiDensity);
        sampleUv = floor(vUv / pixelSize) * pixelSize;
      }

      vec4 texColor = texture2D(uTexture, sampleUv);
      vec3 color = texColor.rgb;

      // 2. Base Math (Exposure, Contrast, Temp, Tint)
      color *= exp2(uExposure);
      color = (color - 0.5) * uContrast + 0.5;
      color.r += uTemperature; 
      color.b -= uTemperature; 
      color.g += uTint;

      // 3. DaVinci 3-Way Wheels (Gain, Lift, Gamma)
      color = color * uGain;
      color = color + uLift * (1.0 - color);
      color = pow(max(color, vec3(0.0)), 1.0 / max(uGamma, vec3(0.001)));

      // 4. Matrix/Halftone Shape Masking
      if (uAsciiSize > 0.0) {
        float luma = dot(color, vec3(0.299, 0.587, 0.114));
        vec2 cellUv = fract(vUv * uAsciiDensity) - 0.5;
        float dist = length(cellUv);
        
        float radius = luma * 0.7 * uAsciiSize;
        float shape = 1.0 - smoothstep(radius - 0.05, radius + 0.05, dist);
        color = color * shape;
      }

      // 5. Film Grain
      if (uGrain > 0.0) {
        float noise = (random(vUv) - 0.5) * uGrain;
        color += noise;
      }

      // 6. Final Saturation
      float finalLuma = dot(color, vec3(0.299, 0.587, 0.114));
      color = mix(vec3(finalLuma), color, uSaturation);

      gl_FragColor = vec4(color, texColor.a);
    }
  `,
);

extend({ ColorGradeMaterial });

function ImagePlane({ imageUrl }: { imageUrl: string }) {
  const texture = useTexture(imageUrl);
  const state = useEditorStore();

  // Fix Typescript error by casting image type
  const image = texture.image as HTMLImageElement;
  const aspect = image.width / image.height;

  return (
    <mesh scale={[aspect * 5, 5, 1]} rotation={[0, 0, state.rotation]}>
      <planeGeometry args={[1, 1]} />
      {/* @ts-ignore */}
      <colorGradeMaterial
        uTexture={texture}
        uExposure={state.exposure}
        uContrast={state.contrast}
        uSaturation={state.saturation}
        uTemperature={state.temperature}
        uTint={state.tint}
        uLift={new THREE.Vector3(...state.lift)}
        uGamma={new THREE.Vector3(...state.gamma)}
        uGain={new THREE.Vector3(...state.gain)}
        uGrain={state.grain}
        uAsciiSize={state.asciiSize}
        uAsciiDensity={state.asciiDensity}
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
