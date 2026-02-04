import Badge from '@/src/components/Badge';

export default function Home() {
  return (
    <main className="container mx-auto px-3 sm:px-6 py-8 md:py-12">
      <section className="mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Ajin Varghese Chandy</h1>
        <p className="text-lg text-gray-600 mb-6">Full Stack Developer</p>
        
        <p className="text-base mb-6 max-w-2xl">
          Building scalable, production-ready web applications with clean architecture and modern development practices.
        </p>

        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <span className="text-gray-700">careerajin@gmail.com</span>
          <span className="text-gray-300">|</span>
          <a href="https://github.com/aajinn" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a>
          <span className="text-gray-300">|</span>
          <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
        </div>

        <div className="flex gap-3">
          <a href="/projects" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 text-sm font-medium">
            View Projects
          </a>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Technical Skills</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <p className="font-semibold mb-2 text-gray-700">Primary Stack</p>
            <div className="flex flex-wrap gap-2">
              <Badge label="Next.js" color="#000000" />
              <Badge label="React" color="#61DAFB" />
              <Badge label="TypeScript" color="#3178C6" />
              <Badge label="Node.js" color="#339933" />
              <Badge label="PostgreSQL" color="#4169E1" />
            </div>
          </div>

          <div>
            <p className="font-semibold mb-2 text-gray-700">Also Proficient In</p>
            <p className="text-sm text-gray-600">MongoDB, Express.js, Tailwind CSS, Docker, AWS, CI/CD, Jest, OAuth/JWT, Razorpay</p>
          </div>
        </div>
      </section>
    </main>
  );
}