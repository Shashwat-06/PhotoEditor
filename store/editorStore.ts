import { create } from "zustand";

// Helper: Convert Hex string to WebGL-friendly RGB array
const hexToRgb = (hex: string): [number, number, number] => {
  const bigint = parseInt(hex.replace("#", ""), 16);
  return [
    ((bigint >> 16) & 255) / 255,
    ((bigint >> 8) & 255) / 255,
    (bigint & 255) / 255,
  ];
};

interface EditorState {
  exposure: number;
  contrast: number;
  saturation: number;
  temperature: number;
  tint: number;

  // DaVinci 3-Way Wheels (Stored as RGB arrays for the shader)
  lift: [number, number, number];
  gamma: [number, number, number];
  gain: [number, number, number];

  // Transform & UI State
  zoom: number;
  rotation: number;
  isRotating: boolean; // Tracks if the user is actively dragging the slider
  imageData: string | null;

  // Actions
  setExposure: (val: number) => void;
  setContrast: (val: number) => void;
  setSaturation: (val: number) => void;
  setTemperature: (val: number) => void;
  setTint: (val: number) => void;

  setLift: (hex: string) => void;
  setGamma: (hex: string) => void;
  setGain: (hex: string) => void;

  setRotation: (val: number) => void;
  setIsRotating: (val: boolean) => void;
  setZoom: (val: number | ((prev: number) => number)) => void;
  setImageData: (url: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  exposure: 0.0,
  contrast: 1.0,
  saturation: 1.0,
  temperature: 0.0,
  tint: 0.0,

  // Default to pure white (1,1,1) which means no effect mathematically
  lift: [0, 0, 0], // Lift defaults to black offset
  gamma: [1, 1, 1],
  gain: [1, 1, 1],

  zoom: 80,
  rotation: 0,
  isRotating: false,
  imageData: null,

  setExposure: (exposure) => set({ exposure }),
  setContrast: (contrast) => set({ contrast }),
  setSaturation: (saturation) => set({ saturation }),
  setTemperature: (temperature) => set({ temperature }),
  setTint: (tint) => set({ tint }),

  setLift: (hex) => set({ lift: hexToRgb(hex) }),
  setGamma: (hex) => set({ gamma: hexToRgb(hex) }),
  setGain: (hex) => set({ gain: hexToRgb(hex) }),

  setRotation: (val) => {
    // Snap logic: Snap to 0, 90, 180, 270 degrees if within 3 degrees (0.05 radians)
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
      exposure: 0,
      contrast: 1,
      saturation: 1,
      temperature: 0,
      tint: 0,
      lift: [0, 0, 0],
      gamma: [1, 1, 1],
      gain: [1, 1, 1],
    }),
}));
