import Link from "next/link";
import {
  MdColorLens,
  MdSpeed,
  MdAutoFixHigh,
  MdArrowForward,
} from "react-icons/md";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <MdColorLens className="text-blue-500 text-2xl" />
          <span className="text-xl font-bold tracking-tight">ChromaWeb</span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium hover:text-blue-400 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/editor"
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Start Grading
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center px-4 pt-32 pb-24">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Professional Color Grading, <br />
          <span className="text-blue-500">Right in your Browser.</span>
        </h1>
        <p className="mt-6 text-lg text-neutral-400 max-w-2xl">
          Harness the power of GPU-accelerated color grading without the heavy
          software. Upload your photos, apply cinematic LUTs, and export in full
          resolution.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/editor"
            className="flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Open Editor <MdArrowForward className="text-xl" />
          </Link>
          <Link
            href="#features"
            className="flex items-center justify-center px-8 py-4 text-base font-semibold bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            View Features
          </Link>
        </div>
      </main>

      {/* Features MVP Section */}
      <section
        id="features"
        className="px-8 py-24 bg-neutral-900 border-t border-neutral-800"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-start text-left">
              <div className="p-3 bg-neutral-800 rounded-lg mb-4 text-blue-400">
                <MdColorLens className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cinematic Controls</h3>
              <p className="text-neutral-400">
                Access professional lift, gamma, and gain wheels alongside
                custom RGB curves for precise shadow and highlight control.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-start text-left">
              <div className="p-3 bg-neutral-800 rounded-lg mb-4 text-blue-400">
                <MdSpeed className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">GPU Accelerated</h3>
              <p className="text-neutral-400">
                Powered by custom WebGL shaders, ensuring 60fps real-time
                adjustments even on lower-end laptops and standard browsers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-start text-left">
              <div className="p-3 bg-neutral-800 rounded-lg mb-4 text-blue-400">
                <MdAutoFixHigh className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Custom LUT Support</h3>
              <p className="text-neutral-400">
                Import industry-standard .cube files to apply complex cinematic
                looks instantly with one click.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
