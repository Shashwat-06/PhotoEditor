"use client";

import Link from "next/link";
import {
  MdArrowBack,
  MdDownload,
  MdZoomIn,
  MdZoomOut,
  MdImage,
  MdMovieFilter,
} from "react-icons/md";
import { useEditorStore } from "@/store/editorStore";
import EditorCanvas from "@/components/editor/canvas/EditorCanvas";

const PRESETS = [
  "Default",
  "Teal & Orange",
  "Cyberpunk Neon",
  "Film Noir",
  "Matrix Digital",
  "Dizzy Motion",
  "Vintage Leak",
];

export default function EditorPage() {
  const store = useEditorStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) store.setImageData(URL.createObjectURL(file));
  };

  return (
    <div className="h-screen w-full bg-neutral-950 text-neutral-50 flex flex-col overflow-hidden select-none">
      <header className="h-14 border-b border-neutral-800 bg-neutral-900 flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <MdArrowBack className="text-xl" />
          </Link>
          <span className="text-sm font-medium text-neutral-300">
            DaVinci Web Engine
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
        <main className="flex-1 relative flex items-center justify-center bg-black overflow-hidden group">
          {!store.imageData ? (
            <div className="text-neutral-600 flex flex-col items-center gap-2">
              <MdImage className="text-5xl opacity-40" />
              <p className="text-sm tracking-wide">
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

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => store.setZoom((p) => Math.max(p - 10, 20))}
              className="p-2 hover:bg-neutral-800 rounded-md text-neutral-300 hover:text-white transition-colors"
            >
              <MdZoomOut className="text-xl" />
            </button>
            <span className="text-xs font-mono px-2 text-neutral-400">
              ZOOM
            </span>
            <button
              onClick={() => store.setZoom((p) => Math.min(p + 10, 300))}
              className="p-2 hover:bg-neutral-800 rounded-md text-neutral-300 hover:text-white transition-colors"
            >
              <MdZoomIn className="text-xl" />
            </button>
          </div>
        </main>

        <aside className="w-[340px] bg-neutral-900 border-l border-neutral-800 flex flex-col shrink-0 overflow-y-auto z-10 custom-scrollbar">
          {/* Presets */}
          <div className="p-6 border-b border-neutral-800 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <MdMovieFilter className="text-base text-blue-500" /> Cinematic
              Presets
            </h3>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((name) => (
                <button
                  key={name}
                  onClick={() => store.applyPreset(name)}
                  className={`py-1.5 px-3 text-[11px] font-medium rounded-md border transition-all ${
                    store.activePreset === name
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                      : "bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  {" "}
                  {name}{" "}
                </button>
              ))}
            </div>
          </div>

          {/* Optical FX Rack */}
          <div className="p-6 border-b border-neutral-800 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
              Optical FX Rack
              <span className="px-1.5 py-0.5 bg-purple-900/50 text-purple-400 rounded text-[10px]">
                PRO
              </span>
            </h3>

            <div className="flex flex-col gap-3">
              {/* Shutter Drag */}
              <div className="flex flex-col bg-neutral-950/50 border border-neutral-800 rounded-md overflow-hidden transition-all">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-800"
                  onClick={() => store.toggleFX("shutter")}
                >
                  <span className="text-xs font-medium">
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

              {/* Light Leak */}
              <div className="flex flex-col bg-neutral-950/50 border border-neutral-800 rounded-md overflow-hidden transition-all">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-800"
                  onClick={() => store.toggleFX("leak")}
                >
                  <span className="text-xs font-medium">
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

              {/* Hue Rotation - Uniform color fix */}
              <div className="flex flex-col bg-neutral-950/50 border border-neutral-800 rounded-md overflow-hidden transition-all">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-800"
                  onClick={() => store.toggleFX("hue")}
                >
                  <span className="text-xs font-medium">Hue Rotation</span>
                  <div
                    className={`w-8 h-4 rounded-full p-0.5 transition-colors ${store.enabledFX.hue ? "bg-indigo-500" : "bg-neutral-700"}`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full transition-transform ${store.enabledFX.hue ? "translate-x-4" : "translate-x-0"}`}
                    />
                  </div>
                </div>
                {store.enabledFX.hue && (
                  <div className="p-3 border-t border-neutral-800 bg-neutral-900/50">
                    <input
                      type="range"
                      min="-3.14"
                      max="3.14"
                      step="0.01"
                      value={store.hue}
                      onChange={(e) => store.setHue(parseFloat(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>
                )}
              </div>

              {/* Aberration */}
              <div className="flex flex-col bg-neutral-950/50 border border-neutral-800 rounded-md overflow-hidden transition-all">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-800"
                  onClick={() => store.toggleFX("aberration")}
                >
                  <span className="text-xs font-medium">
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

              {/* Vignette */}
              <div className="flex flex-col bg-neutral-950/50 border border-neutral-800 rounded-md overflow-hidden transition-all">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-800"
                  onClick={() => store.toggleFX("vignette")}
                >
                  <span className="text-xs font-medium">
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

              {/* Matrix Halftone */}
              <div className="flex flex-col bg-neutral-950/50 border border-neutral-800 rounded-md overflow-hidden transition-all">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-800"
                  onClick={() => store.toggleFX("matrix")}
                >
                  <span className="text-xs font-medium">
                    Digital Matrix Blocks
                  </span>
                  <div
                    className={`w-8 h-4 rounded-full p-0.5 transition-colors ${store.enabledFX.matrix ? "bg-green-500" : "bg-neutral-700"}`}
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

              {/* CRT Scanlines */}
              <div className="flex flex-col bg-neutral-950/50 border border-neutral-800 rounded-md overflow-hidden transition-all">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-800"
                  onClick={() => store.toggleFX("crt")}
                >
                  <span className="text-xs font-medium">CRT Scanlines</span>
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

            {/* Film Grain (Always Visible Base Layer) */}
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex justify-between text-xs font-medium">
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

          {/* DaVinci 3-Way Wheels */}
          <div className="p-6 border-b border-neutral-800 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              3-Way Color Wheels
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-neutral-400">
                  Lift (Shadow)
                </span>
                <input
                  type="color"
                  value="#000000"
                  onChange={(e) => store.setLift(e.target.value)}
                  className="w-12 h-10 p-0 border-0 rounded cursor-pointer bg-transparent"
                />
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-neutral-400">
                  Gamma (Mid)
                </span>
                <input
                  type="color"
                  value="#ffffff"
                  onChange={(e) => store.setGamma(e.target.value)}
                  className="w-12 h-10 p-0 border-0 rounded cursor-pointer bg-transparent"
                />
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-neutral-400">
                  Gain (High)
                </span>
                <input
                  type="color"
                  value="#ffffff"
                  onChange={(e) => store.setGain(e.target.value)}
                  className="w-12 h-10 p-0 border-0 rounded cursor-pointer bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Basic Controls */}
          <div className="p-6 border-b border-neutral-800 flex flex-col gap-5">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Manual Adjustment
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-medium">
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
              <div className="flex justify-between text-xs font-medium">
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
              <div className="flex justify-between text-xs font-medium">
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
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex justify-between text-xs font-medium">
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
              <div className="flex justify-between text-xs font-medium">
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
          </div>

          {/* Transform */}
          <div className="p-6 border-b border-neutral-800 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Transform
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-medium">
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
