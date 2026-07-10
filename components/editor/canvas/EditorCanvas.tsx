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
    uMatrixSize: 0.0,
    uMatrixDensity: 100.0,
    uAsciiSize: 0.0,
    uAsciiDensity: 100.0,
    uAsciiColor: new THREE.Vector3(0, 1, 0),
    uVignette: 0.0,
    uAberration: 0.0,
    uHue: 0.0,
    uBlurStrength: 0.0,
    uBlurAngle: 0.0,
    uLightLeak: 0.0,
    uScanlines: 0.0,
  },
  `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  `
    uniform sampler2D uTexture;
    uniform float uExposure; uniform float uContrast; uniform float uSaturation; uniform float uTemperature; uniform float uTint;
    uniform vec3 uLift; uniform vec3 uGamma; uniform vec3 uGain;
    uniform float uGrain; 
    uniform float uMatrixSize; uniform float uMatrixDensity;
    uniform float uAsciiSize; uniform float uAsciiDensity; uniform vec3 uAsciiColor;
    uniform float uVignette; uniform float uAberration; uniform float uHue;
    uniform float uBlurStrength; uniform float uBlurAngle; uniform float uLightLeak; uniform float uScanlines;
    varying vec2 vUv;

    float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }

    vec3 hueShift(vec3 color, float hue) {
        const vec3 k = vec3(0.57735, 0.57735, 0.57735); float cosAngle = cos(hue);
        return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
    }

    void main() {
      vec2 sampleUv = vUv;
      
      float activeDensity = 0.0;
      if (uAsciiSize > 0.0) activeDensity = uAsciiDensity;
      else if (uMatrixSize > 0.0) activeDensity = uMatrixDensity;

      if (activeDensity > 0.0) {
        vec2 pixelSize = vec2(1.0 / activeDensity);
        sampleUv = floor(vUv / pixelSize) * pixelSize;
      }

      vec3 color = vec3(0.0);
      float a = 1.0;

      if (uBlurStrength > 0.0) {
        vec2 dir = vec2(cos(uBlurAngle), sin(uBlurAngle)) * uBlurStrength;
        vec4 sum = vec4(0.0);
        for (float i = -4.0; i <= 4.0; i++) {
           sum += texture2D(uTexture, sampleUv + dir * (i / 8.0));
        }
        color = (sum / 9.0).rgb;
        a = (sum / 9.0).a;
      } else {
        vec2 rOffset = vec2(uAberration * 0.01, 0.0);
        vec2 bOffset = vec2(-uAberration * 0.01, 0.0);
        color.r = texture2D(uTexture, sampleUv + rOffset).r;
        color.g = texture2D(uTexture, sampleUv).g;
        color.b = texture2D(uTexture, sampleUv + bOffset).b;
        a = texture2D(uTexture, sampleUv).a;
      }

      color *= exp2(uExposure);
      color = (color - 0.5) * uContrast + 0.5;
      color.r += uTemperature; color.b -= uTemperature; color.g += uTint;
      if (uHue != 0.0) { color = hueShift(color, uHue); }
      color = color * uGain;
      color = color + uLift * (1.0 - color);
      color = pow(max(color, vec3(0.0)), 1.0 / max(uGamma, vec3(0.001)));

      float luma = dot(color, vec3(0.299, 0.587, 0.114));

      // 1. Natural Matrix Halftone Dots (Restored to Circles!)
      if (uMatrixSize > 0.0) {
        vec2 cellUv = fract(vUv * uMatrixDensity) - 0.5;
        // Use true distance from center to create a circle
        float dist = length(cellUv);
        float radius = luma * 0.7 * uMatrixSize; 
        // Smoothstep makes the edges of the dots soft and natural
        float shape = 1.0 - smoothstep(radius - 0.05, radius + 0.05, dist);
        color = color * shape;
      }

      // 2. Procedural ASCII Characters
      if (uAsciiSize > 0.0) {
        vec2 cellUv = (fract(vUv * uAsciiDensity) - 0.5) / max(uAsciiSize, 0.01);
        float charShape = 0.0;
        
        if (abs(cellUv.x) < 0.5 && abs(cellUv.y) < 0.5) {
            if (luma > 0.8) {
                charShape = step(max(abs(cellUv.x), abs(cellUv.y)), 0.4);
            } else if (luma > 0.6) {
                charShape = max(0.0, step(max(abs(cellUv.x), abs(cellUv.y)), 0.4) - step(max(abs(cellUv.x), abs(cellUv.y)), 0.2));
            } else if (luma > 0.4) {
                charShape = max(step(abs(cellUv.x), 0.1) * step(abs(cellUv.y), 0.4), step(abs(cellUv.y), 0.1) * step(abs(cellUv.x), 0.4));
            } else if (luma > 0.2) {
                charShape = 1.0 - step(0.15, length(cellUv));
            }
        }
        color = uAsciiColor * charShape; 
      }

      if (uLightLeak > 0.0) {
        float leakX = max(0.0, 1.0 - vUv.x * 2.5);
        float leakY = max(0.0, vUv.y * 2.0 - 1.0);
        vec3 leakColor = vec3(1.0, 0.4, 0.1) * (leakX + leakY) * uLightLeak;
        color += leakColor;
      }

      if (uScanlines > 0.0) {
        float scanline = sin(vUv.y * 800.0) * 0.04 * uScanlines;
        color -= scanline;
      }

      if (uGrain > 0.0) { color += (random(vUv) - 0.5) * uGrain; }

      if (uVignette > 0.0) {
        float dist = distance(vUv, vec2(0.5));
        float vignetteEffect = smoothstep(0.8, 0.2, dist * (1.0 + uVignette));
        color *= vignetteEffect;
      }

      float finalLuma = dot(color, vec3(0.299, 0.587, 0.114));
      color = mix(vec3(finalLuma), color, uSaturation);
      gl_FragColor = vec4(color, a);
    }
  `,
);

extend({ ColorGradeMaterial });

function ImagePlane({ imageUrl }: { imageUrl: string }) {
  const texture = useTexture(imageUrl);
  const state = useEditorStore();
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
        uMatrixSize={state.enabledFX.matrix ? state.matrixSize : 0.0}
        uMatrixDensity={state.matrixDensity}
        uAsciiSize={state.enabledFX.ascii ? state.asciiSize : 0.0}
        uAsciiDensity={state.asciiDensity}
        uAsciiColor={new THREE.Vector3(...state.asciiColor)}
        uVignette={state.enabledFX.vignette ? state.vignette : 0.0}
        uAberration={state.enabledFX.aberration ? state.aberration : 0.0}
        uHue={state.enabledFX.hue ? state.hue : 0.0}
        uBlurStrength={state.enabledFX.shutter ? state.blurStrength : 0.0}
        uBlurAngle={state.blurAngle}
        uLightLeak={state.enabledFX.leak ? state.lightLeak : 0.0}
        uScanlines={state.enabledFX.crt ? state.scanlines : 0.0}
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
