import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import Image from "next/image";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="min-h-screen py-12 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">All Projects</h1>
          <p className="text-xl text-gray-600">
            Choose from our collection of ready-to-use project kits
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold opacity-20">
                  {project.title.charAt(0)}
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3">{project.title}</h2>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="text-3xl font-bold text-blue-600 mb-6">
                  ₹{project.price.toLocaleString()}
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  View Project
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
