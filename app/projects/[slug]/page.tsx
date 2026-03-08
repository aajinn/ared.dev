import { getProjectBySlug, getAllProjects } from "@/lib/projects";
import { notFound } from "next/navigation";
import Link from "next/link";
import BuyNowButton from "@/components/BuyNowButton";
import Script from "next/script";

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const features = [
    "User authentication and authorization",
    "Responsive design for all devices",
    "Admin dashboard with analytics",
    "Database integration",
    "RESTful API implementation",
    "Comprehensive error handling",
  ];

  const whatYouGet = [
    {
      icon: "💻",
      title: "Source Code",
      description: "Complete, well-documented source code with comments",
    },
    {
      icon: "📄",
      title: "Project Report",
      description: "Detailed documentation covering all aspects of the project",
    },
    {
      icon: "📊",
      title: "PPT Presentation",
      description: "Professional presentation slides for your project defense",
    },
    {
      icon: "📖",
      title: "Setup Guide",
      description: "Step-by-step installation and configuration instructions",
    },
    {
      icon: "🎥",
      title: "Demo Video",
      description: "Video walkthrough demonstrating all features",
    },
  ];

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/projects"
            className="inline-block text-blue-200 hover:text-white mb-6"
          >
            ← Back to Projects
          </Link>
          <h1 className="text-5xl font-bold mb-4">{project.title}</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            {project.description}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Screenshots Section */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold mb-6">Screenshots</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center"
                  >
                    <span className="text-gray-500 text-lg">
                      Screenshot {num}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Tech Stack */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold mb-6">Tech Stack</h2>
              <div className="flex flex-wrap gap-3">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            {/* Features */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold mb-6">Key Features</h2>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-3 text-xl">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* What You Get */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold mb-6">What You Get</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {whatYouGet.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="text-4xl">{item.icon}</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-8 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  ₹{project.price.toLocaleString()}
                </div>
                <p className="text-gray-600">One-time payment</p>
              </div>

              <BuyNowButton
                projectId={project.id}
                projectTitle={project.title}
                price={project.price}
              />

              <div className="border-t pt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Instant download access</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Lifetime updates</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>24/7 support</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
