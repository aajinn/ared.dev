import Link from "next/link";

export default function Home() {
  const featuredProjects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Full-stack online shopping system with payment integration",
      tech: "React, Node.js, MongoDB",
    },
    {
      id: 2,
      title: "AI Chatbot System",
      description: "Intelligent conversational AI with NLP capabilities",
      tech: "Python, TensorFlow, Flask",
    },
    {
      id: 3,
      title: "Hospital Management",
      description: "Complete healthcare management solution",
      tech: "Java, Spring Boot, MySQL",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Final Year Project Kits for CS Students
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Complete project packages including source code, detailed reports, and presentation slides. 
            Everything you need to ace your final year project.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-4">Choose Project</h3>
              <p className="text-gray-600">
                Browse our collection and select the perfect project for your requirements
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-4">Pay Securely</h3>
              <p className="text-gray-600">
                Complete your purchase through our secure payment gateway
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-4">Download Instantly</h3>
              <p className="text-gray-600">
                Get immediate access to source code, documentation, and presentation files
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Featured Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="border rounded-lg p-6 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="text-sm text-blue-600 font-medium">{project.tech}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Explore our complete collection of project kits
          </p>
          <Link
            href="/projects"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition"
          >
            Browse Projects
          </Link>
        </div>
      </section>
    </main>
  );
}
