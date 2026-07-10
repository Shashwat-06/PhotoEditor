import Link from "next/link";
import { MdAdd, MdFolder, MdMoreVert } from "react-icons/md";

export default function DashboardPage() {
  // Placeholder data - this will eventually come from MongoDB
  const projects = [
    { id: "1", title: "Cinematic Forest", date: "2 hours ago" },
    { id: "2", title: "Product Shoot - Neon", date: "Yesterday" },
    { id: "3", title: "Wedding Portraits", date: "Jul 4, 2026" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      {/* Dashboard Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-neutral-800 bg-neutral-900">
        <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
          ME
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Recent Projects</h2>
          <Link
            href="/editor"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors"
          >
            <MdAdd className="text-xl" /> New Project
          </Link>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-neutral-600 transition-colors cursor-pointer"
            >
              {/* Image Placeholder */}
              <div className="h-40 bg-neutral-800 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-700 transition-colors">
                <MdFolder className="text-4xl" />
              </div>
              {/* Project Info */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold truncate">{project.title}</h3>
                  <p className="text-xs text-neutral-400">{project.date}</p>
                </div>
                <button className="text-neutral-400 hover:text-white">
                  <MdMoreVert className="text-xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
