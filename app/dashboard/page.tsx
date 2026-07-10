"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MdAdd, MdFolder, MdMoreVert, MdImage } from "react-icons/md";

interface Project {
  id: string;
  title: string;
  date: string;
}

export default function DashboardPage() {
  // Setup state for dynamic loading from your backend/MongoDB later
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Example hook point for fetching data from database
  useEffect(() => {
    // async function fetchProjects() {
    //   setIsLoading(true);
    //   const res = await fetch('/api/projects');
    //   const data = await res.json();
    //   setProjects(data);
    //   setIsLoading(false);
    // }
    // fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col">
      {/* Dashboard Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-neutral-800 bg-neutral-900 shrink-0">
        <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
          ME
        </div>
      </nav>

      <main className="flex-1 max-w-6xl w-full mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Recent Projects</h2>
          <Link
            href="/editor"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors"
          >
            <MdAdd className="text-xl" /> New Project
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-neutral-500 text-sm">
            Loading project assets...
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-neutral-800 rounded-xl py-20 px-4 bg-neutral-900/20">
            <MdImage className="text-5xl text-neutral-700 mb-3" />
            <p className="text-neutral-400 font-medium text-sm">
              No creative assets found
            </p>
            <p className="text-xs text-neutral-600 mt-1 mb-6">
              Create a new project workspace to begin grading
            </p>
            <Link
              href="/editor"
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-sm font-medium rounded-md transition-all"
            >
              Get Started
            </Link>
          </div>
        ) : (
          /* Project Grid */
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
                  <button className="text-neutral-400 hover:text-white transition-colors">
                    <MdMoreVert className="text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
