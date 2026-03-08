"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getAllProjects } from "@/lib/projects";
import { Suspense, useState, useEffect } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  
  const projects = getAllProjects();
  const project = projects.find((p) => p.id === Number(projectId));

  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (projectId) {
      generateDownloadLink();
    }
  }, [projectId]);

  const generateDownloadLink = async () => {
    try {
      const response = await fetch("/api/generate-download-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: Number(projectId),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setDownloadUrl(data.downloadUrl);
      } else {
        setError(data.error || "Failed to generate download link");
      }
    } catch (err) {
      setError("Failed to generate download link");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-white rounded-lg shadow-md p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold mb-4 text-green-600">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Your payment has been processed successfully.
          </p>

          {project && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-xl mb-4">
                Download your project below
              </h2>
              <p className="text-gray-700 mb-6">
                Project: <span className="font-semibold">{project.title}</span>
              </p>
              
              {loading ? (
                <div className="text-gray-600">Generating secure download link...</div>
              ) : error ? (
                <div className="text-red-600">{error}</div>
              ) : (
                <>
                  <a
                    href={downloadUrl}
                    className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition mb-4"
                  >
                    Download Project
                  </a>
                  <p className="text-sm text-gray-500">
                    Download link expires in 24 hours
                  </p>
                </>
              )}
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-lg mb-3">Package Includes:</h2>
            <ul className="text-left space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Complete source code</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Project report (PDF)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>PPT presentation</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Setup guide</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Demo video</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/projects"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Browse More Projects
            </Link>
            <Link
              href="/"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="bg-white rounded-lg shadow-md p-12">
            <p>Loading...</p>
          </div>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
