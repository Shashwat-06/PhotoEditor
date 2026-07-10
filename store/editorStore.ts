import { create } from "zustand";

const hexToRgb = (hex: string): [number, number, number] => {
  const bigint = parseInt(hex.replace("#", ""), 16);
  return [
    ((bigint >> 16) & 255) / 255,
    ((bigint >> 8) & 255) / 255,
    (bigint & 255) / 255,
  ];
};

interface EditorState {
  // Base Controls
  exposure: number;
  contrast: number;
  saturation: number;
  temperature: number;
  tint: number;

  // DaVinci 3-Way Wheels
  lift: [number, number, number];
  gamma: [number, number, number];
  gain: [number, number, number];

  // Shaders & FX
  grain: number;
  asciiSize: number;
  asciiDensity: number;
  vignette: number;
  aberration: number;
  hue: number;

  // Toggle Rack State
  enabledFX: {
    matrix: boolean;
    vignette: boolean;
    aberration: boolean;
    hue: boolean;
  };

  // Transform & System
  zoom: number;
  rotation: number;
  isRotating: boolean;
  imageData: string | null;
  activePreset: string;

  // Actions
  setExposure: (val: number) => void;
  setContrast: (val: number) => void;
  setSaturation: (val: number) => void;
  setTemperature: (val: number) => void;
  setTint: (val: number) => void;

  setLift: (hex: string) => void;
  setGamma: (hex: string) => void;
  setGain: (hex: string) => void;

  setGrain: (val: number) => void;
  setAsciiSize: (val: number) => void;
  setAsciiDensity: (val: number) => void;
  setVignette: (val: number) => void;
  setAberration: (val: number) => void;
  setHue: (val: number) => void;
  toggleFX: (fxName: keyof EditorState["enabledFX"]) => void;

  setRotation: (val: number) => void;
  setIsRotating: (val: boolean) => void;
  setZoom: (val: number | ((prev: number) => number)) => void;
  setImageData: (url: string) => void;
  applyPreset: (presetName: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  exposure: 0.0,
  contrast: 1.0,
  saturation: 1.0,
  temperature: 0.0,
  tint: 0.0,
  lift: [0, 0, 0],
  gamma: [1, 1, 1],
  gain: [1, 1, 1],

  grain: 0.0,
  asciiSize: 0.0,
  asciiDensity: 100.0,
  vignette: 0.0,
  aberration: 0.0,
  hue: 0.0,

  enabledFX: {
    matrix: false,
    vignette: false,
    aberration: false,
    hue: false,
  },

  zoom: 80,
  rotation: 0,
  isRotating: false,
  imageData: null,
  activePreset: "Default",

  setExposure: (exposure) => set({ exposure, activePreset: "Custom" }),
  setContrast: (contrast) => set({ contrast, activePreset: "Custom" }),
  setSaturation: (saturation) => set({ saturation, activePreset: "Custom" }),
  setTemperature: (temperature) => set({ temperature, activePreset: "Custom" }),
  setTint: (tint) => set({ tint, activePreset: "Custom" }),

  setLift: (hex) => set({ lift: hexToRgb(hex), activePreset: "Custom" }),
  setGamma: (hex) => set({ gamma: hexToRgb(hex), activePreset: "Custom" }),
  setGain: (hex) => set({ gain: hexToRgb(hex), activePreset: "Custom" }),

  setGrain: (grain) => set({ grain, activePreset: "Custom" }),
  setAsciiSize: (asciiSize) => set({ asciiSize, activePreset: "Custom" }),
  setAsciiDensity: (asciiDensity) =>
    set({ asciiDensity, activePreset: "Custom" }),
  setVignette: (vignette) => set({ vignette, activePreset: "Custom" }),
  setAberration: (aberration) => set({ aberration, activePreset: "Custom" }),
  setHue: (hue) => set({ hue, activePreset: "Custom" }),

  toggleFX: (fxName) =>
    set((state) => ({
      enabledFX: { ...state.enabledFX, [fxName]: !state.enabledFX[fxName] },
      activePreset: "Custom",
    })),

  setRotation: (val) => {
    const snapThreshold = 0.05;
    const angles = [0, Math.PI / 2, Math.PI, -Math.PI / 2, -Math.PI];
    let snappedVal = val;
    for (const angle of angles) {
      if (Math.abs(val - angle) < snapThreshold) {
        snappedVal = angle;
        break;
      }
    }
    set({ rotation: snappedVal });
  },

  setIsRotating: (isRotating) => set({ isRotating }),
  setZoom: (val) =>
    set((state) => ({
      zoom: typeof val === "function" ? val(state.zoom) : val,
    })),

  setImageData: (url) =>
    set({
      imageData: url,
      zoom: 80,
      rotation: 0,
      activePreset: "Default",
      exposure: 0,
      contrast: 1,
      saturation: 1,
      temperature: 0,
      tint: 0,
      lift: [0, 0, 0],
      gamma: [1, 1, 1],
      gain: [1, 1, 1],
      grain: 0,
      asciiSize: 0,
      asciiDensity: 100,
      vignette: 0,
      aberration: 0,
      hue: 0,
      enabledFX: {
        matrix: false,
        vignette: false,
        aberration: false,
        hue: false,
      },
    }),

  applyPreset: (name) =>
    set((state) => {
      const base = {
        activePreset: name,
        exposure: 0,
        contrast: 1,
        saturation: 1,
        temperature: 0,
        tint: 0,
        lift: [0, 0, 0] as [number, number, number],
        gamma: [1, 1, 1] as [number, number, number],
        gain: [1, 1, 1] as [number, number, number],
        grain: 0,
        asciiSize: 0,
        asciiDensity: 100,
        vignette: 0,
        aberration: 0,
        hue: 0,
        enabledFX: {
          matrix: false,
          vignette: false,
          aberration: false,
          hue: false,
        },
      };

      switch (name) {
        case "Teal & Orange":
          return {
            ...base,
            contrast: 1.15,
            temperature: 0.1,
            lift: [-0.05, 0.02, 0.05],
            gain: [1.1, 1.02, 0.9],
          };
        case "Cyberpunk Neon":
          return {
            ...base,
            saturation: 1.4,
            tint: 0.15,
            lift: [0.02, 0.0, 0.1],
            gain: [0.9, 1.1, 1.2],
            grain: 0.08,
          };
        case "Film Noir":
          return {
            ...base,
            saturation: 0.0,
            contrast: 1.4,
            exposure: -0.1,
            grain: 0.22,
            lift: [-0.02, -0.02, -0.02],
          };
        case "Vintage Matte":
          return {
            ...base,
            contrast: 0.85,
            exposure: 0.1,
            temperature: 0.15,
            grain: 0.12,
            lift: [0.08, 0.06, 0.04],
            gamma: [1.05, 1.0, 0.95],
          };
        case "Matrix Digital":
          return {
            ...base,
            asciiSize: 0.95,
            asciiDensity: 140,
            tint: -0.2,
            saturation: 0.8,
            enabledFX: { ...base.enabledFX, matrix: true },
          };
        case "Faded Vignette":
          return {
            ...base,
            vignette: 0.8,
            contrast: 0.9,
            saturation: 0.8,
            enabledFX: { ...base.enabledFX, vignette: true },
          };
        default:
          return base;
      }
    }),
}));
