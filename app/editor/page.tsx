"use client";

import Link from "next/link";
import {
  useState,
  useRef,
  useEffect,
  MouseEvent as ReactMouseEvent,
} from "react";
import {
  MdArrowBack,
  MdDownload,
  MdZoomIn,
  MdZoomOut,
  MdImage,
  MdMovieFilter,
  MdLock,
  MdKeyboardArrowDown,
  MdUpload,
  MdRefresh,
} from "react-icons/md";
import { useEditorStore } from "@/store/editorStore";
import EditorCanvas from "@/components/editor/canvas/EditorCanvas";

// --- HELPERS ---
const PRESETS = [
  "Default",
  "Teal & Orange",
  "Cyberpunk Neon",
  "Film Noir",
  "Terminal ASCII",
  "Matrix Digital",
  "Dizzy Motion",
  "Vintage Leak",
];

const rgbToHex = (r: number, g: number, b: number) => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

const hexToRgbArr = (hex: string): [number, number, number] => {
  const bigint = parseInt(hex.replace("#", ""), 16);
  return [
    ((bigint >> 16) & 255) / 255,
    ((bigint >> 8) & 255) / 255,
    (bigint & 255) / 255,
  ];
};

// --- CUSTOM COLOR WHEEL COMPONENT ---
interface ColorWheelProps {
  label: string;
  value: [number, number, number];
  onChange: (val: [number, number, number]) => void;
  isMultiplier?: boolean;
}

function ColorWheel({
  label,
  value,
  onChange,
  isMultiplier = false,
}: ColorWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Math: Calculate position of the thumb based on the RGB offset.
  const neutral = isMultiplier ? 1 : 0;
  const currentDx = value[0] - neutral;
  const currentDy = value[2] - neutral;

  // FIX: Multiplied by 100 instead of 50 to allow full travel from 0% to 100% of the circle
  const thumbX = currentDx * 100 + 50;
  const thumbY = currentDy * 100 + 50;

  const handlePointerEvent = (clientX: number, clientY: number) => {
    if (!wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radius = rect.width / 2;

    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Clamp exactly to the edge of the circle
    if (dist > radius) {
      dx = (dx / dist) * radius;
      dy = (dy / dist) * radius;
    }

    const normX = dx / radius;
    const normY = dy / radius;

    const r = neutral + normX * 0.5;
    const g = neutral - normX * 0.25 - normY * 0.25;
    const b = neutral + normY * 0.5;

    onChange([r, g, b]);
  };

  const handleMouseDown = (e: ReactMouseEvent) => {
    setIsDragging(true);
    handlePointerEvent(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handlePointerEvent(e.clientX, e.clientY);
    };
    const handleMouseUp = () => setIsDragging(false);
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging)
        handlePointerEvent(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  const handleReset = () => {
    onChange(isMultiplier ? [1, 1, 1] : [0, 0, 0]);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex justify-between w-full px-1">
        <span className="text-[10px] text-neutral-400 font-bold tracking-wider">
          {label}
        </span>
        <button
          onClick={handleReset}
          className="text-neutral-500 hover:text-white"
        >
          <MdRefresh className="text-[12px]" />
        </button>
      </div>
      <div
        ref={wheelRef}
        onMouseDown={handleMouseDown}
        onTouchStart={(e) => {
          setIsDragging(true);
          handlePointerEvent(e.touches[0].clientX, e.touches[0].clientY);
        }}
        className="w-20 h-20 rounded-full relative cursor-crosshair"
        style={{
          background:
            "conic-gradient(from 90deg, #ff0000, #ff00ff, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)",
          boxShadow: "inset 0 0 6px rgba(0,0,0,0.4)", // Softened the inner dark shadow
        }}
      >
        {/* FIX: Brightened the center core to make the wheel look significantly more vibrant */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(50,50,50,0.9) 15%, rgba(50,50,50,0.3) 65%, transparent 100%)",
          }}
        />
        <div
          className="absolute w-3 h-3 bg-white border border-neutral-400 rounded-full pointer-events-none"
          style={{
            left: `${thumbX}%`,
            top: `${thumbY}%`,
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 4px rgba(0,0,0,0.7)",
          }}
        />
      </div>
    </div>
  );
}

// --- EXPORT MENU ---
type ExportFormat = "PNG" | "JPEG" | "WEBP" | "TIFF";
type QualityPreset = "low" | "hd" | "fullhd" | "uhd";

const QUALITY_DETAILS: Record<
  QualityPreset,
  { label: string; dimensions: string; description: string; isPremium: boolean }
> = {
  low: {
    label: "Low Quality (SD)",
    dimensions: "854 × 480 px",
    description: "Fast processing, ideal for web mockups",
    isPremium: false,
  },
  hd: {
    label: "Standard (HD)",
    dimensions: "1280 × 720 px",
    description: "Good for standard digital delivery",
    isPremium: false,
  },
  fullhd: {
    label: "High Quality (FHD)",
    dimensions: "1920 × 1080 px",
    description: "Sharp detail for social media",
    isPremium: false,
  },
  uhd: {
    label: "Ultra HD (4K / UHD)",
    dimensions: "3840 × 2160 px",
    description: "Maximum depth for commercial production",
    isPremium: true,
  },
};

function ExportMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>("PNG");
  const [quality, setQuality] = useState<QualityPreset>("fullhd");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const storeTitle = useEditorStore((state) => state.title);

  const handleTriggerExport = () => {
    const activeQuality = QUALITY_DETAILS[quality];
    if (activeQuality.isPremium) {
      alert("Premium Feature: Redirecting to Pro upgrade gateway...");
      return;
    }
    try {
      const canvas = document.querySelector("canvas");
      if (!canvas) {
        alert("Error: No canvas found. Please upload an image first.");
        return;
      }
      const mimeType =
        format === "JPEG"
          ? "image/jpeg"
          : format === "WEBP"
            ? "image/webp"
            : "image/png";
      const dataUrl = canvas.toDataURL(mimeType, 1.0);
      if (dataUrl === "data:,") {
        alert("Error: Canvas is blank or empty.");
        return;
      }
      const safeTitle =
        storeTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase() ||
        "untitled_project";
      const link = document.createElement("a");
      link.download = `${safeTitle}_${Date.now()}.${format.toLowerCase()}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 150);
      setIsOpen(false);
    } catch (error) {
      console.error("Export Error:", error);
      alert(
        "Export failed. Check your browser console. Ensure your browser is not blocking the export.",
      );
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 md:px-3 text-xs md:text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
      >
        <MdDownload className="text-base md:text-lg" />{" "}
        <span className="hidden sm:inline">Export</span>
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-[90vw] sm:w-80 max-w-[320px] bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-50 p-4 transition-all">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">
              Download Settings
            </h4>
            <div className="mb-4">
              <label className="block text-[10px] text-neutral-400 font-medium mb-1.5 uppercase">
                File Type
              </label>
              <div className="relative">
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as ExportFormat)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs font-medium text-neutral-200 outline-none appearance-none cursor-pointer focus:border-neutral-600"
                >
                  <option value="PNG">
                    PNG (Best for web and lossless details)
                  </option>
                  <option value="JPEG">JPEG (Small file size, standard)</option>
                  <option value="WEBP">
                    WebP (Optimized modern browser asset)
                  </option>
                  <option value="TIFF">
                    TIFF (Lossless heavy archival master)
                  </option>
                </select>
                <MdKeyboardArrowDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none text-base" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-[10px] text-neutral-400 font-medium mb-1.5 uppercase">
                Size / Quality Profile
              </label>
              <div className="flex flex-col gap-2">
                {(Object.keys(QUALITY_DETAILS) as QualityPreset[]).map(
                  (key) => {
                    const option = QUALITY_DETAILS[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setQuality(key)}
                        className={`w-full flex items-center justify-between p-2.5 text-left rounded-lg border text-xs transition-all ${quality === key ? "bg-neutral-950 border-neutral-700 text-white ring-1 ring-neutral-700" : "bg-neutral-950/40 border-neutral-800/80 text-neutral-400 hover:bg-neutral-950 hover:border-neutral-700"}`}
                      >
                        <div className="flex flex-col gap-0.5 pr-2">
                          <span className="font-medium text-neutral-200 flex items-center flex-wrap gap-1.5">
                            {option.label}
                            {option.isPremium && (
                              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-[8px] px-1 py-0.5 rounded uppercase flex items-center gap-0.5 tracking-tight">
                                <MdLock className="text-[9px]" /> PRO
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-neutral-500 hidden sm:block">
                            {option.description}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-neutral-400 whitespace-nowrap self-start pt-0.5 shrink-0">
                          {option.dimensions}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>
            <button
              onClick={handleTriggerExport}
              className={`w-full py-2.5 rounded-lg text-xs font-semibold tracking-wide shadow-md transition-all flex items-center justify-center gap-2 ${QUALITY_DETAILS[quality].isPremium ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
            >
              {QUALITY_DETAILS[quality].isPremium
                ? "Unlock Premium Quality"
                : "Download Render"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// --- MAIN PAGE LAYOUT ---
export default function EditorPage() {
  const store = useEditorStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isMobile = window.innerWidth < 768;
      store.setImageData(URL.createObjectURL(file), isMobile);
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-neutral-950 text-neutral-50 flex flex-col overflow-hidden select-none">
      <header className="relative z-[100] h-14 border-b border-neutral-800 bg-neutral-900 flex items-center justify-between px-2 sm:px-4 shrink-0">
        <div className="flex items-center gap-1 sm:gap-4">
          <Link
            href="/dashboard"
            className="text-neutral-400 hover:text-white transition-colors flex items-center p-1 sm:p-0"
          >
            <MdArrowBack className="text-xl" />
          </Link>
          <span className="hidden lg:inline text-sm font-medium text-neutral-300">
            Photo Editor
          </span>
          <input
            type="text"
            value={store.title}
            onChange={(e) => store.setTitle(e.target.value)}
            placeholder="Untitled project"
            className="text-xs sm:text-sm font-medium text-neutral-200 bg-transparent border border-transparent hover:border-neutral-700 focus:border-blue-500 focus:bg-neutral-950 rounded px-1 sm:px-2 py-1 w-24 sm:w-40 md:w-48 transition-all outline-none truncate"
          />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <label className="cursor-pointer px-2.5 py-1.5 md:px-3 text-xs md:text-sm font-medium bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors flex items-center gap-1.5">
            <MdUpload className="text-base sm:hidden" />
            <span className="hidden sm:inline">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <ExportMenu />
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        <main className="h-[45vh] md:h-auto md:flex-1 relative flex items-center justify-center bg-black overflow-hidden group shrink-0">
          {!store.imageData ? (
            <div className="text-neutral-600 flex flex-col items-center gap-2">
              <MdImage className="text-4xl md:text-5xl opacity-40" />
              <p className="text-xs md:text-sm tracking-wide px-4 text-center">
                Load imagery assets to begin grading
              </p>
            </div>
          ) : (
            <EditorCanvas />
          )}

          <div
            className={`pointer-events-none absolute inset-0 transition-opacity duration-200 ${store.isRotating ? "opacity-100" : "opacity-0"}`}
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "33.33% 33.33%",
              backgroundPosition: "center center",
            }}
          />

          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 md:gap-2 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 p-1 md:p-2 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => store.setZoom((p) => Math.max(p - 10, 20))}
              className="p-1.5 md:p-2 hover:bg-neutral-800 rounded-md text-neutral-300 hover:text-white transition-colors"
            >
              <MdZoomOut className="text-lg md:text-xl" />
            </button>
            <span className="text-[10px] md:text-xs font-mono px-1 md:px-2 text-neutral-400">
              ZOOM
            </span>
            <button
              onClick={() => store.setZoom((p) => Math.min(p + 10, 300))}
              className="p-1.5 md:p-2 hover:bg-neutral-800 rounded-md text-neutral-300 hover:text-white transition-colors"
            >
              <MdZoomIn className="text-lg md:text-xl" />
            </button>
          </div>
        </main>

        <aside className="flex-1 md:flex-none w-full md:w-[360px] bg-neutral-900 border-t md:border-t-0 md:border-l border-neutral-800 flex flex-col overflow-y-auto z-10 custom-scrollbar pb-6 md:pb-0">
          <div className="p-4 md:p-6 border-b border-neutral-800 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <MdMovieFilter className="text-base text-blue-500" /> Cinematic
              Presets
            </h3>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((name) => (
                <button
                  key={name}
                  onClick={() => store.applyPreset(name)}
                  className={`py-1.5 px-3 text-[10px] md:text-[11px] font-medium rounded-md border transition-all ${store.activePreset === name ? "bg-blue-600 border-blue-500 text-white shadow-lg" : "bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:bg-neutral-800"}`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-6 border-b border-neutral-800 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Tone Curve Controls
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[10px] font-medium text-neutral-400">
                  <span>Highlights</span>
                  <span className="font-mono">
                    {store.highlightsAmount.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={store.highlightsAmount}
                  onChange={(e) =>
                    store.setHighlightsAmount(parseFloat(e.target.value))
                  }
                  className="w-full accent-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[10px] font-medium text-neutral-400">
                  <span>Midtones</span>
                  <span className="font-mono">
                    {store.midtonesAmount.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={store.midtonesAmount}
                  onChange={(e) =>
                    store.setMidtonesAmount(parseFloat(e.target.value))
                  }
                  className="w-full accent-neutral-400"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[10px] font-medium text-neutral-400">
                  <span>Shadows</span>
                  <span className="font-mono">
                    {store.shadowsAmount.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={store.shadowsAmount}
                  onChange={(e) =>
                    store.setShadowsAmount(parseFloat(e.target.value))
                  }
                  className="w-full accent-neutral-600"
                />
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 border-b border-neutral-800 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              4-Way Color Wheels
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 gap-y-6">
              <ColorWheel
                label="LIFT (Shadows)"
                value={store.lift}
                onChange={store.setLift}
                isMultiplier={false}
              />
              <ColorWheel
                label="GAMMA (Mids)"
                value={store.gamma}
                onChange={store.setGamma}
                isMultiplier={true}
              />
              <ColorWheel
                label="GAIN (Highs)"
                value={store.gain}
                onChange={store.setGain}
                isMultiplier={true}
              />
              <ColorWheel
                label="OFFSET (Global)"
                value={store.offset}
                onChange={store.setOffset}
                isMultiplier={false}
              />
            </div>
          </div>

          <div className="p-4 md:p-6 border-b border-neutral-800 flex flex-col gap-5">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Base Corrections
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[11px] font-medium">
                <span>Temperature</span>
                <span className="font-mono text-amber-400">
                  {store.temperature.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="-0.5"
                max="0.5"
                step="0.01"
                value={store.temperature}
                onChange={(e) =>
                  store.setTemperature(parseFloat(e.target.value))
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[11px] font-medium">
                <span>Tint</span>
                <span className="font-mono text-fuchsia-400">
                  {store.tint.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="-0.5"
                max="0.5"
                step="0.01"
                value={store.tint}
                onChange={(e) => store.setTint(parseFloat(e.target.value))}
                className="w-full accent-fuchsia-500 cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[11px] font-medium">
                <span>Saturation</span>
                <span className="font-mono text-blue-400">
                  {store.saturation.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.01"
                value={store.saturation}
                onChange={(e) =>
                  store.setSaturation(parseFloat(e.target.value))
                }
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[11px] font-medium">
                <span>Exposure</span>
                <span className="font-mono text-blue-400">
                  {store.exposure.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.01"
                value={store.exposure}
                onChange={(e) => store.setExposure(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[11px] font-medium">
                <span>Contrast</span>
                <span className="font-mono text-blue-400">
                  {store.contrast.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.01"
                value={store.contrast}
                onChange={(e) => store.setContrast(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-neutral-800">
              <div className="flex justify-between text-[11px] font-medium">
                <span>Noise Reduction</span>
                <span className="font-mono text-purple-400">
                  {store.noiseReduction.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={store.noiseReduction}
                onChange={(e) =>
                  store.setNoiseReduction(parseFloat(e.target.value))
                }
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-4 md:p-6 border-b border-neutral-800 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
              Optical FX Rack
              <span className="px-1.5 py-0.5 bg-purple-900/50 text-purple-400 rounded text-[10px]">
                PRO
              </span>
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col bg-neutral-950/50 border border-neutral-800 rounded-md overflow-hidden transition-all">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-800"
                  onClick={() => store.toggleFX("mask")}
                >
                  <span className="text-[11px] font-medium">
                    Radial Subject Mask
                  </span>
                  <div
                    className={`w-8 h-4 rounded-full p-0.5 transition-colors ${store.enabledFX.mask ? "bg-indigo-500" : "bg-neutral-700"}`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full transition-transform ${store.enabledFX.mask ? "translate-x-4" : "translate-x-0"}`}
                    />
                  </div>
                </div>
                {store.enabledFX.mask && (
                  <div className="p-3 border-t border-neutral-800 bg-neutral-900/50 flex flex-col gap-4">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1 text-neutral-400">
                        <span>Radius</span>
                        <span>{store.maskRadius.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1.5"
                        step="0.01"
                        value={store.maskRadius}
                        onChange={(e) =>
                          store.setMaskRadius(parseFloat(e.target.value))
                        }
                        className="w-full accent-indigo-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-1 text-neutral-400">
                        <span>Feather Softness</span>
                        <span>{store.maskFeather.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1.0"
                        step="0.01"
                        value={store.maskFeather}
                        onChange={(e) =>
                          store.setMaskFeather(parseFloat(e.target.value))
                        }
                        className="w-full accent-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col bg-neutral-950/50 border border-neutral-800 rounded-md overflow-hidden transition-all">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-800"
                  onClick={() => store.toggleFX("shutter")}
                >
                  <span className="text-[11px] font-medium">
                    Shutter Drag (Blur)
                  </span>
                  <div
                    className={`w-8 h-4 rounded-full p-0.5 transition-colors ${store.enabledFX.shutter ? "bg-orange-500" : "bg-neutral-700"}`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full transition-transform ${store.enabledFX.shutter ? "translate-x-4" : "translate-x-0"}`}
                    />
                  </div>
                </div>
                {store.enabledFX.shutter && (
                  <div className="p-3 border-t border-neutral-800 bg-neutral-900/50 flex flex-col gap-4">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1 text-neutral-400">
                        <span>Motion Amount</span>
                        <span>{store.blurStrength.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="0.1"
                        step="0.001"
                        value={store.blurStrength}
                        onChange={(e) =>
                          store.setBlurStrength(parseFloat(e.target.value))
                        }
                        className="w-full accent-orange-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-1 text-neutral-400">
                        <span>Angle</span>
                        <span>
                          {(store.blurAngle * (180 / Math.PI)).toFixed(0)}°
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="6.28"
                        step="0.01"
                        value={store.blurAngle}
                        onChange={(e) =>
                          store.setBlurAngle(parseFloat(e.target.value))
                        }
                        className="w-full accent-orange-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col bg-neutral-950/50 border border-neutral-800 rounded-md overflow-hidden transition-all">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-800"
                  onClick={() => store.toggleFX("leak")}
                >
                  <span className="text-[11px] font-medium">
                    Vintage Light Leak
                  </span>
                  <div
                    className={`w-8 h-4 rounded-full p-0.5 transition-colors ${store.enabledFX.leak ? "bg-red-500" : "bg-neutral-700"}`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full transition-transform ${store.enabledFX.leak ? "translate-x-4" : "translate-x-0"}`}
                    />
                  </div>
                </div>
                {store.enabledFX.leak && (
                  <div className="p-3 border-t border-neutral-800 bg-neutral-900/50">
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={store.lightLeak}
                      onChange={(e) =>
                        store.setLightLeak(parseFloat(e.target.value))
                      }
                      className="w-full accent-red-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col bg-neutral-950/50 border border-neutral-800 rounded-md overflow-hidden transition-all">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-800"
                  onClick={() => store.toggleFX("aberration")}
                >
                  <span className="text-[11px] font-medium">
                    RGB Split (Aberration)
                  </span>
                  <div
                    className={`w-8 h-4 rounded-full p-0.5 transition-colors ${store.enabledFX.aberration ? "bg-fuchsia-500" : "bg-neutral-700"}`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full transition-transform ${store.enabledFX.aberration ? "translate-x-4" : "translate-x-0"}`}
                    />
                  </div>
                </div>
                {store.enabledFX.aberration && (
                  <div className="p-3 border-t border-neutral-800 bg-neutral-900/50">
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={store.aberration}
                      onChange={(e) =>
                        store.setAberration(parseFloat(e.target.value))
                      }
                      className="w-full accent-fuchsia-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col bg-neutral-950/50 border border-neutral-800 rounded-md overflow-hidden transition-all">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-800"
                  onClick={() => store.toggleFX("vignette")}
                >
                  <span className="text-[11px] font-medium">
                    Cinematic Vignette
                  </span>
                  <div
                    className={`w-8 h-4 rounded-full p-0.5 transition-colors ${store.enabledFX.vignette ? "bg-blue-500" : "bg-neutral-700"}`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full transition-transform ${store.enabledFX.vignette ? "translate-x-4" : "translate-x-0"}`}
                    />
                  </div>
                </div>
                {store.enabledFX.vignette && (
                  <div className="p-3 border-t border-neutral-800 bg-neutral-900/50">
                    <input
                      type="range"
                      min="0"
                      max="1.5"
                      step="0.01"
                      value={store.vignette}
                      onChange={(e) =>
                        store.setVignette(parseFloat(e.target.value))
                      }
                      className="w-full accent-blue-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col bg-neutral-950/50 border border-neutral-800 rounded-md overflow-hidden transition-all">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-800"
                  onClick={() => store.toggleFX("matrix")}
                >
                  <span className="text-[11px] font-medium">
                    Digital Matrix (Natural)
                  </span>
                  <div
                    className={`w-8 h-4 rounded-full p-0.5 transition-colors ${store.enabledFX.matrix ? "bg-teal-500" : "bg-neutral-700"}`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full transition-transform ${store.enabledFX.matrix ? "translate-x-4" : "translate-x-0"}`}
                    />
                  </div>
                </div>
                {store.enabledFX.matrix && (
                  <div className="p-3 border-t border-neutral-800 bg-neutral-900/50 flex flex-col gap-4">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1 text-neutral-400">
                        <span>Size</span>
                        <span>{store.matrixSize.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.5"
                        step="0.01"
                        value={store.matrixSize}
                        onChange={(e) =>
                          store.setMatrixSize(parseFloat(e.target.value))
                        }
                        className="w-full accent-teal-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-1 text-neutral-400">
                        <span>Density</span>
                        <span>{store.matrixDensity.toFixed(0)}</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="300"
                        step="1"
                        value={store.matrixDensity}
                        onChange={(e) =>
                          store.setMatrixDensity(parseFloat(e.target.value))
                        }
                        className="w-full accent-teal-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col bg-neutral-950/50 border border-neutral-800 rounded-md overflow-hidden transition-all">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-800"
                  onClick={() => store.toggleFX("ascii")}
                >
                  <span className="text-[11px] font-medium">
                    Terminal ASCII Art
                  </span>
                  <div
                    className={`w-8 h-4 rounded-full p-0.5 transition-colors ${store.enabledFX.ascii ? "bg-green-500" : "bg-neutral-700"}`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full transition-transform ${store.enabledFX.ascii ? "translate-x-4" : "translate-x-0"}`}
                    />
                  </div>
                </div>
                {store.enabledFX.ascii && (
                  <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 flex flex-col gap-4">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1 text-neutral-400">
                        <span>Terminal Ink Color</span>
                      </div>
                      <input
                        type="color"
                        value={rgbToHex(...store.asciiColor)}
                        onChange={(e) =>
                          store.setAsciiColor(hexToRgbArr(e.target.value))
                        }
                        className="w-full h-8 p-0 border-0 rounded cursor-pointer bg-transparent"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-1 text-neutral-400">
                        <span>Character Scale</span>
                        <span>{store.asciiSize.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.5"
                        step="0.01"
                        value={store.asciiSize}
                        onChange={(e) =>
                          store.setAsciiSize(parseFloat(e.target.value))
                        }
                        className="w-full accent-green-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-1 text-neutral-400">
                        <span>Density</span>
                        <span>{store.asciiDensity.toFixed(0)}</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="300"
                        step="1"
                        value={store.asciiDensity}
                        onChange={(e) =>
                          store.setAsciiDensity(parseFloat(e.target.value))
                        }
                        className="w-full accent-green-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col bg-neutral-950/50 border border-neutral-800 rounded-md overflow-hidden transition-all">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-800"
                  onClick={() => store.toggleFX("crt")}
                >
                  <span className="text-[11px] font-medium">CRT Scanlines</span>
                  <div
                    className={`w-8 h-4 rounded-full p-0.5 transition-colors ${store.enabledFX.crt ? "bg-emerald-500" : "bg-neutral-700"}`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full transition-transform ${store.enabledFX.crt ? "translate-x-4" : "translate-x-0"}`}
                    />
                  </div>
                </div>
                {store.enabledFX.crt && (
                  <div className="p-3 border-t border-neutral-800 bg-neutral-900/50">
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={store.scanlines}
                      onChange={(e) =>
                        store.setScanlines(parseFloat(e.target.value))
                      }
                      className="w-full accent-emerald-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <div className="flex justify-between text-[11px] font-medium">
                <span>Film Grain Noise</span>
                <span className="font-mono text-neutral-400">
                  {store.grain.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.01"
                value={store.grain}
                onChange={(e) => store.setGrain(parseFloat(e.target.value))}
                className="w-full accent-neutral-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-4 md:p-6 border-b border-neutral-800 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Transform
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[11px] font-medium">
                <span>Rotation Axis</span>
                <span className="font-mono text-blue-400">
                  {(store.rotation * (180 / Math.PI)).toFixed(0)}°
                </span>
              </div>
              <input
                type="range"
                min="-3.14159"
                max="3.14159"
                step="0.01"
                value={store.rotation}
                onChange={(e) => store.setRotation(parseFloat(e.target.value))}
                onMouseDown={() => store.setIsRotating(true)}
                onMouseUp={() => store.setIsRotating(false)}
                onTouchStart={() => store.setIsRotating(true)}
                onTouchEnd={() => store.setIsRotating(false)}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
