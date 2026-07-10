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
      <nav className="flex flex-wrap items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-neutral-800">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <MdColorLens className="text-blue-500 text-xl md:text-2xl" />
          <span className="text-lg md:text-xl font-bold tracking-tight">
            Photo Editor
          </span>
        </div>
        <div className="flex gap-2 sm:gap-4">
          <Link
            href="/login"
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium hover:text-blue-400 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/editor"
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Start Grading
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center px-4 pt-20 md:pt-32 pb-16 md:pb-24">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Professional Color Grading, <br className="hidden sm:block" />
          <span className="text-blue-500">Right in your Browser.</span>
        </h1>
        <p className="mt-6 text-base md:text-lg text-neutral-400 max-w-2xl">
          Edit photos directly in your browser. Adjust colors, apply filters,
          and export your images quickly without downloading heavy software.
        </p>
        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
          <Link
            href="/editor"
            className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors w-full sm:w-auto"
          >
            Open Editor <MdArrowForward className="text-lg md:text-xl" />
          </Link>
          <Link
            href="#features"
            className="flex items-center justify-center px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-semibold bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors w-full sm:w-auto"
          >
            View Features
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section
        id="features"
        className="px-4 md:px-8 py-16 md:py-24 bg-neutral-900 border-t border-neutral-800"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-start text-left">
              <div className="p-3 bg-neutral-800 rounded-lg mb-4 text-blue-400">
                <MdColorLens className="text-2xl md:text-3xl" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">
                Color Controls
              </h3>
              <p className="text-sm md:text-base text-neutral-400">
                Adjust shadows, midtones, and highlights using simple color
                wheels and sliders for precise visual control.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-start text-left">
              <div className="p-3 bg-neutral-800 rounded-lg mb-4 text-blue-400">
                <MdSpeed className="text-2xl md:text-3xl" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">
                Fast Performance
              </h3>
              <p className="text-sm md:text-base text-neutral-400">
                Built with WebGL for smooth, real-time image editing that works
                directly in standard web browsers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-start text-left">
              <div className="p-3 bg-neutral-800 rounded-lg mb-4 text-blue-400">
                <MdAutoFixHigh className="text-2xl md:text-3xl" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">
                Instant Filters
              </h3>
              <p className="text-sm md:text-base text-neutral-400">
                Apply built-in presets and optical effects like grain,
                halftones, and color shifts with a single click.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
