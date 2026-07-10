import Link from "next/link";
import { MdColorLens } from "react-icons/md";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-50 px-4">
      <div className="w-full max-w-md p-8 bg-neutral-900 border border-neutral-800 rounded-xl">
        <div className="flex flex-col items-center mb-8">
          <MdColorLens className="text-blue-500 text-4xl mb-2" />
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-neutral-400 text-sm mt-1">
            Log in to access your projects
          </p>
        </div>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-300">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="px-4 py-2 bg-neutral-950 border border-neutral-700 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-300">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="px-4 py-2 bg-neutral-950 border border-neutral-700 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            type="button"
            className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 font-semibold rounded-md transition-colors"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
