"use client";

import Link from "next/link";
import {
  MdArrowBack,
  MdDownload,
  MdZoomIn,
  MdZoomOut,
  MdImage,
} from "react-icons/md";
import { useEditorStore } from "@/store/editorStore";
import EditorCanvas from "@/components/editor/canvas/EditorCanvas";

export default function EditorPage() {
  const {
    exposure,
    setExposure,
    contrast,
    setContrast,
    saturation,
    setSaturation,
    temperature,
    setTemperature,
    tint,
    setTint,
    rotation,
    setRotation,
    setIsRotating,
    isRotating,
    setLift,
    setGamma,
    setGain,
    setZoom,
    setImageData,
    imageData,
  } = useEditorStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageData(URL.createObjectURL(file));
    }
  };

  return (
    <div className="h-screen w-full bg-neutral-950 text-neutral-50 flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="h-14 border-b border-neutral-800 bg-neutral-900 flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <MdArrowBack className="text-xl" />
          </Link>
          <span className="text-sm font-medium text-neutral-300">
            Working Title
          </span>
        </div>

        <div className="flex items-center gap-4">
          <label className="cursor-pointer px-3 py-1.5 text-sm font-medium bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
            <MdDownload className="text-lg" /> Export
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Workspace Canvas */}
        <main className="flex-1 relative flex items-center justify-center bg-black overflow-hidden group">
          {!imageData ? (
            <div className="text-neutral-600 flex flex-col items-center gap-2">
              <MdImage className="text-5xl opacity-50" />
              <p className="text-sm">Please upload an image to begin.</p>
            </div>
          ) : (
            <EditorCanvas />
          )}

          {/* Canva-Style Snapping Grid (Visible only when rotating) */}
          <div
            className={`pointer-events-none absolute inset-0 transition-opacity duration-200 ${isRotating ? "opacity-100" : "opacity-0"}`}
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "33.33% 33.33%", // Creates a Rule of Thirds grid
              backgroundPosition: "center center",
            }}
          />

          {/* Floating Canvas Toolbar (Zoom) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md border border-neutral-700 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setZoom((p) => Math.max(p - 10, 20))}
              className="p-2 hover:bg-neutral-700 rounded-md text-neutral-300 hover:text-white transition-colors"
            >
              <MdZoomOut className="text-xl" />
            </button>
            <span className="text-xs font-medium px-2 text-neutral-400">
              Zoom
            </span>
            <button
              onClick={() => setZoom((p) => Math.min(p + 10, 300))}
              className="p-2 hover:bg-neutral-700 rounded-md text-neutral-300 hover:text-white transition-colors"
            >
              <MdZoomIn className="text-xl" />
            </button>
          </div>
        </main>

        {/* Sidebar Controls */}
        <aside className="w-80 bg-neutral-900 border-l border-neutral-800 flex flex-col shrink-0 overflow-y-auto z-10">
          {/* Transform Section */}
          <div className="p-6 border-b border-neutral-800 flex flex-col gap-6">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Transform
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Rotate</span>
                <span className="text-blue-400">
                  {(rotation * (180 / Math.PI)).toFixed(0)}°
                </span>
              </div>
              <input
                type="range"
                min="-3.14159"
                max="3.14159"
                step="0.01"
                value={rotation}
                onChange={(e) => setRotation(parseFloat(e.target.value))}
                onMouseDown={() => setIsRotating(true)}
                onMouseUp={() => setIsRotating(false)}
                onTouchStart={() => setIsRotating(true)}
                onTouchEnd={() => setIsRotating(false)}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* DaVinci 3-Way Color Wheels */}
          <div className="p-6 border-b border-neutral-800 flex flex-col gap-6">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              3-Way Color (MVP Pickers)
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-neutral-400">Lift (Shadows)</span>
                <input
                  type="color"
                  defaultValue="#000000"
                  onChange={(e) => setLift(e.target.value)}
                  className="w-10 h-10 p-0 border-0 rounded cursor-pointer bg-transparent"
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-neutral-400">Gamma (Mid)</span>
                <input
                  type="color"
                  defaultValue="#ffffff"
                  onChange={(e) => setGamma(e.target.value)}
                  className="w-10 h-10 p-0 border-0 rounded cursor-pointer bg-transparent"
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-neutral-400">Gain (High)</span>
                <input
                  type="color"
                  defaultValue="#ffffff"
                  onChange={(e) => setGain(e.target.value)}
                  className="w-10 h-10 p-0 border-0 rounded cursor-pointer bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Color Section */}
          <div className="p-6 border-b border-neutral-800 flex flex-col gap-6">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Basic Color
            </h3>
            {/* Temp, Tint, Saturation Sliders... (Kept identical to previous step) */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Temperature</span>
                <span className="text-blue-400">{temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-0.5"
                max="0.5"
                step="0.01"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Tint</span>
                <span className="text-blue-400">{tint.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-0.5"
                max="0.5"
                step="0.01"
                value={tint}
                onChange={(e) => setTint(parseFloat(e.target.value))}
                className="w-full accent-fuchsia-500 cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Saturation</span>
                <span className="text-blue-400">{saturation.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.01"
                value={saturation}
                onChange={(e) => setSaturation(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Light Section */}
          <div className="p-6 border-b border-neutral-800 flex flex-col gap-6">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Light
            </h3>
            {/* Exposure, Contrast Sliders... (Kept identical to previous step) */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Exposure</span>
                <span className="text-blue-400">{exposure.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.01"
                value={exposure}
                onChange={(e) => setExposure(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Contrast</span>
                <span className="text-blue-400">{contrast.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.01"
                value={contrast}
                onChange={(e) => setContrast(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
