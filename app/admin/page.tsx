"use client";

import { useState, useEffect } from "react";
import { getAllProjects, Project } from "@/lib/projects";

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    techStack: "",
    price: "",
  });
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const allProjects = getAllProjects();
    setProjects(allProjects);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("slug", formData.slug);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("techStack", formData.techStack);
    formDataToSend.append("price", formData.price);

    if (zipFile) {
      formDataToSend.append("zipFile", zipFile);
    }
    if (imageFile) {
      formDataToSend.append("imageFile", imageFile);
    }

    if (editingProject) {
      formDataToSend.append("id", editingProject.id.toString());
    }

    try {
      const response = await fetch("/api/admin/projects", {
        method: editingProject ? "PUT" : "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        alert(
          editingProject
            ? "Project updated successfully!"
            : "Project added successfully!"
        );
        resetForm();
        loadProjects();
      } else {
        alert(data.error || "Failed to save project");
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project");
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description,
      techStack: project.techStack.join(", "),
      price: project.price.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (projectId: number) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const response = await fetch("/api/admin/projects", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: projectId }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Project deleted successfully!");
        loadProjects();
      } else {
        alert(data.error || "Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      techStack: "",
      price: "",
    });
    setZipFile(null);
    setImageFile(null);
    setEditingProject(null);
    setShowForm(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {showForm ? "Cancel" : "Add New Project"}
          </button>
        </div>

        {/* Add/Edit Project Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingProject ? "Edit Project" : "Add New Project"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  placeholder="React, Node.js, MongoDB"
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Project ZIP File
                </label>
                <input
                  type="file"
                  accept=".zip"
                  onChange={(e) => setZipFile(e.target.files?.[0] || null)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  {editingProject ? "Update Project" : "Add Project"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-2xl font-bold">All Projects</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tech Stack
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{project.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{project.title}</div>
                      <div className="text-sm text-gray-500">
                        {project.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      ₹{project.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
