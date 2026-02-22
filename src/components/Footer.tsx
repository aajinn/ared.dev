import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            <a 
              href="https://github.com/aajinn" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              <Image src="https://img.shields.io/badge/GitHub-0F172A?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" width={120} height={28} />
            </a>
            <a 
              href="https://x.com/areddev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              <Image src="https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white" alt="X" width={120} height={28} />
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            © 2026 Ajin Varghese Chandy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}