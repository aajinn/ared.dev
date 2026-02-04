import Badge from '@/components/Badge';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container mx-auto px-3 sm:px-6 py-8 md:py-12">
      {/* 
        ANCHOR LAW & IDENTITY MIRROR LAW:
        The opening headline frames everything that follows.
        It reflects the visitor's self-image back at them.
      */}
      <section className="mb-12 animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          You deserve a developer who delivers.
        </h1>
        
        {/* 
          ATOMIC AGREEMENT LAW:
          Start from uncontested truths everyone agrees with.
          These build foundation before introducing anything new.
          
          COGNITIVE HOSPITALITY LAW:
          Simple sentences reduce mental load for faster understanding.
        */}
        <div className="space-y-3 mb-8 max-w-2xl">
          <p className="text-base text-gray-700">
            Your time matters. Results matter. Quality is non-negotiable.
            Every project deserves someone who actually finishes what they start.
          </p>
          
          {/* 
            CONFIRMATION BIAS LAW:
            Ride their existing beliefs rather than fighting them.
            They already believe quality matters—confirm it here.
            
            WORLD-FIT LAW:
            This fits into what they already believe about needing reliability.
          */}
          <p className="text-base text-gray-700">
            That&apos;s why I build applications that work—ones you don&apos;t have to explain to users,
            ones that just run reliably in production, day after day, without drama.
          </p>
        </div>

        {/* 
          GRADUAL SHIFT LAW:
          Enter their world -> Align -> Shift slightly -> Reinforce -> Expand
          This section shifts from "what everyone wants" to "what I deliver"
        */}
        <div className="flex flex-wrap gap-4 mb-8 text-sm">
          <span className="text-gray-700">careerajin@gmail.com</span>
          <span className="text-gray-300">|</span>
          <a href="https://github.com/aajinn" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a>
          <span className="text-gray-300">|</span>
          <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
        </div>

        {/* 
          PROTOTYPE LAW:
          Create a mental prototype of what working with me looks like.
          This gives them something tangible to imagine.
        */}
        <div className="flex gap-3">
          <a href="/projects" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 text-sm font-medium">
            See My Work
          </a>
        </div>
      </section>

      {/* 
        STORY OVER STATISTICS LAW:
        Instead of dry numbers, tell mini-stories of outcomes.
        This section uses narrative rather than stats.
      */}
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900">
          What you actually get:
        </h2>
        
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          {/* 
            EXAMPLE ANCHORING LAW:
            Concrete examples root abstract ideas.
            Each point is a mini-example of what I deliver.
          */}
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-semibold text-gray-800 mb-1">A working application—not code that looks good but breaks in production.</p>
            <p className="text-sm text-gray-600">Production-ready code with proper error handling, testing, and monitoring.</p>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-semibold text-gray-800 mb-1">Clear communication—no guesswork about where things stand.</p>
            <p className="text-sm text-gray-600">Regular updates, straightforward answers, and a developer who actually responds.</p>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-semibold text-gray-800 mb-1">Scalable architecture—not technical debt you&apos;ll pay back later.</p>
            <p className="text-sm text-gray-600">Clean code, proper database design, and systems that grow with your users.</p>
          </div>
        </div>
      </section>

      {/* 
        IN-GROUP LANGUAGE LAW:
        Using vocabulary that signals I speak their language.
        Technical terms mixed with business outcomes.
      */}
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900">
          The stack that ships fast, scales reliably:
        </h2>
        
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
<<<<<<< HEAD
            <p className="font-semibold mb-2 text-gray-700">Also Working With</p>
=======
            <p className="font-semibold mb-2 text-gray-700">Also Proficient In</p>
>>>>>>> b4777b6 (Add Razorpay to tech stack in home and projects page)
            <p className="text-sm text-gray-600">MongoDB, Express.js, Tailwind CSS, Docker, AWS, CI/CD, Jest, OAuth/JWT, Razorpay</p>
          </div>
        </div>
      </section>

      {/* 
        SINGLE LEVER LAW:
        One clear call to action rather than multiple weak ones.
        Clear, low-resistance path to the next step.
      */}
      <section className="text-center py-8">
        <p className="text-gray-700 mb-4">
          Got a project in mind? Let&apos;s talk about what you&apos;re building.
        </p>
        <a href="mailto:careerajin@gmail.com" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 text-sm font-medium">
          Get In Touch
        </a>
      </section>
    </main>
  );
}
