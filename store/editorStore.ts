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
  title: string;
  exposure: number;
  contrast: number;
  saturation: number;
  temperature: number;
  tint: number;
  lift: [number, number, number];
  gamma: [number, number, number];
  gain: [number, number, number];
  offset: [number, number, number];
  shadowsAmount: number;
  midtonesAmount: number;
  highlightsAmount: number;
  noiseReduction: number;
  grain: number;
  matrixSize: number;
  matrixDensity: number;
  asciiSize: number;
  asciiDensity: number;
  asciiColor: [number, number, number];
  vignette: number;
  aberration: number;
  hue: number;
  blurStrength: number;
  blurAngle: number;
  lightLeak: number;
  scanlines: number;
  maskRadius: number;
  maskFeather: number;
  enabledFX: {
    matrix: boolean;
    ascii: boolean;
    vignette: boolean;
    aberration: boolean;
    hue: boolean;
    shutter: boolean;
    leak: boolean;
    crt: boolean;
    mask: boolean;
  };

  zoom: number;
  rotation: number;
  isRotating: boolean;
  imageData: string | null;
  activePreset: string;

  setTitle: (val: string) => void;
  setExposure: (val: number) => void;
  setContrast: (val: number) => void;
  setSaturation: (val: number) => void;
  setTemperature: (val: number) => void;
  setTint: (val: number) => void;
  setLift: (val: [number, number, number]) => void;
  setGamma: (val: [number, number, number]) => void;
  setGain: (val: [number, number, number]) => void;
  setOffset: (val: [number, number, number]) => void;
  setShadowsAmount: (val: number) => void;
  setMidtonesAmount: (val: number) => void;
  setHighlightsAmount: (val: number) => void;
  setNoiseReduction: (val: number) => void;
  setGrain: (val: number) => void;
  setMatrixSize: (val: number) => void;
  setMatrixDensity: (val: number) => void;
  setAsciiSize: (val: number) => void;
  setAsciiDensity: (val: number) => void;
  setAsciiColor: (val: [number, number, number]) => void;
  setVignette: (val: number) => void;
  setAberration: (val: number) => void;
  setHue: (val: number) => void;
  setBlurStrength: (val: number) => void;
  setBlurAngle: (val: number) => void;
  setLightLeak: (val: number) => void;
  setScanlines: (val: number) => void;
  setMaskRadius: (val: number) => void;
  setMaskFeather: (val: number) => void;

  toggleFX: (fxName: keyof EditorState["enabledFX"]) => void;
  setRotation: (val: number) => void;
  setIsRotating: (val: boolean) => void;
  setZoom: (val: number | ((prev: number) => number)) => void;
  setImageData: (url: string, isMobile?: boolean) => void;
  applyPreset: (presetName: string) => void;
}

const defaultAdjustments = {
  exposure: 0.0,
  contrast: 1.0,
  saturation: 1.0,
  temperature: 0.0,
  tint: 0.0,
  lift: [0, 0, 0] as [number, number, number],
  gamma: [1, 1, 1] as [number, number, number],
  gain: [1, 1, 1] as [number, number, number],
  offset: [0, 0, 0] as [number, number, number],
  shadowsAmount: 0.0,
  midtonesAmount: 0.0,
  highlightsAmount: 0.0,
  noiseReduction: 0.0,
  grain: 0.0,
  matrixSize: 0.0,
  matrixDensity: 100.0,
  asciiSize: 0.0,
  asciiDensity: 100.0,
  asciiColor: [0.0, 1.0, 0.0] as [number, number, number],
  vignette: 0.0,
  aberration: 0.0,
  hue: 0.0,
  blurStrength: 0.0,
  blurAngle: 0.78,
  lightLeak: 0.0,
  scanlines: 0.0,
  maskRadius: 0.5,
  maskFeather: 0.2,
  enabledFX: {
    matrix: false,
    ascii: false,
    vignette: false,
    aberration: false,
    hue: false,
    shutter: false,
    leak: false,
    crt: false,
    mask: false,
  },
};

export const useEditorStore = create<EditorState>((set) => ({
  title: "Untitled project",
  ...defaultAdjustments,
  zoom: 120,
  rotation: 0,
  isRotating: false,
  imageData: null,
  activePreset: "Default",

  setTitle: (title) => set({ title }),
  setExposure: (exposure) => set({ exposure, activePreset: "Custom" }),
  setContrast: (contrast) => set({ contrast, activePreset: "Custom" }),
  setSaturation: (saturation) => set({ saturation, activePreset: "Custom" }),
  setTemperature: (temperature) => set({ temperature, activePreset: "Custom" }),
  setTint: (tint) => set({ tint, activePreset: "Custom" }),

  setLift: (lift) => set({ lift, activePreset: "Custom" }),
  setGamma: (gamma) => set({ gamma, activePreset: "Custom" }),
  setGain: (gain) => set({ gain, activePreset: "Custom" }),
  setOffset: (offset) => set({ offset, activePreset: "Custom" }),

  setShadowsAmount: (shadowsAmount) =>
    set({ shadowsAmount, activePreset: "Custom" }),
  setMidtonesAmount: (midtonesAmount) =>
    set({ midtonesAmount, activePreset: "Custom" }),
  setHighlightsAmount: (highlightsAmount) =>
    set({ highlightsAmount, activePreset: "Custom" }),
  setNoiseReduction: (noiseReduction) =>
    set({ noiseReduction, activePreset: "Custom" }),

  setGrain: (grain) => set({ grain, activePreset: "Custom" }),
  setMatrixSize: (matrixSize) => set({ matrixSize, activePreset: "Custom" }),
  setMatrixDensity: (matrixDensity) =>
    set({ matrixDensity, activePreset: "Custom" }),
  setAsciiSize: (asciiSize) => set({ asciiSize, activePreset: "Custom" }),
  setAsciiDensity: (asciiDensity) =>
    set({ asciiDensity, activePreset: "Custom" }),
  setAsciiColor: (asciiColor) => set({ asciiColor, activePreset: "Custom" }),

  setVignette: (vignette) => set({ vignette, activePreset: "Custom" }),
  setAberration: (aberration) => set({ aberration, activePreset: "Custom" }),
  setHue: (hue) => set({ hue, activePreset: "Custom" }),
  setBlurStrength: (blurStrength) =>
    set({ blurStrength, activePreset: "Custom" }),
  setBlurAngle: (blurAngle) => set({ blurAngle, activePreset: "Custom" }),
  setLightLeak: (lightLeak) => set({ lightLeak, activePreset: "Custom" }),
  setScanlines: (scanlines) => set({ scanlines, activePreset: "Custom" }),
  setMaskRadius: (maskRadius) => set({ maskRadius, activePreset: "Custom" }),
  setMaskFeather: (maskFeather) => set({ maskFeather, activePreset: "Custom" }),

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

  setImageData: (url, isMobile = false) =>
    set({
      imageData: url,
      zoom: isMobile ? 65 : 120,
      rotation: 0,
      activePreset: "Default",
      ...defaultAdjustments,
    }),

  applyPreset: (name) =>
    set((state) => {
      const base = {
        title: state.title,
        zoom: state.zoom,
        rotation: state.rotation,
        imageData: state.imageData,
        isRotating: state.isRotating,
        ...defaultAdjustments,
        activePreset: name,
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
        case "Matrix Digital":
          return {
            ...base,
            matrixSize: 0.95,
            matrixDensity: 140,
            tint: -0.2,
            saturation: 0.8,
            scanlines: 0.8,
            enabledFX: { ...base.enabledFX, matrix: true, crt: true },
          };
        case "Terminal ASCII":
          return {
            ...base,
            asciiSize: 1.0,
            asciiDensity: 100,
            asciiColor: [0.0, 1.0, 0.0] as [number, number, number],
            scanlines: 0.5,
            enabledFX: { ...base.enabledFX, ascii: true, crt: true },
          };
        case "Dizzy Motion":
          return {
            ...base,
            blurStrength: 0.05,
            blurAngle: 0.78,
            aberration: 0.5,
            vignette: 0.4,
            enabledFX: {
              ...base.enabledFX,
              shutter: true,
              aberration: true,
              vignette: true,
            },
          };
        case "Vintage Leak":
          return {
            ...base,
            lightLeak: 0.8,
            grain: 0.15,
            contrast: 0.9,
            temperature: 0.1,
            enabledFX: { ...base.enabledFX, leak: true },
          };
        default:
          return base;
      }
    }),
}));
