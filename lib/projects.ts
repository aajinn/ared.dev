export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  price: number;
  image: string;
  downloadUrl: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    slug: "ecommerce-platform",
    description: "A full-featured online shopping system with user authentication, product catalog, shopping cart, order management, and payment gateway integration. Includes admin panel for inventory management.",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Stripe"],
    price: 2999,
    image: "/images/ecommerce.jpg",
    downloadUrl: "/downloads/ecommerce-platform.zip",
  },
  {
    id: 2,
    title: "AI Chatbot System",
    slug: "ai-chatbot-system",
    description: "Intelligent conversational AI chatbot with natural language processing capabilities. Features include intent recognition, context management, and multi-language support. Perfect for customer service automation.",
    techStack: ["Python", "TensorFlow", "Flask", "NLP", "SQLite"],
    price: 3499,
    image: "/images/chatbot.jpg",
    downloadUrl: "/downloads/ai-chatbot.zip",
  },
  {
    id: 3,
    title: "Hospital Management System",
    slug: "hospital-management-system",
    description: "Complete healthcare management solution with patient records, appointment scheduling, doctor management, billing system, and prescription tracking. Includes role-based access control.",
    techStack: ["Java", "Spring Boot", "MySQL", "Thymeleaf", "Bootstrap"],
    price: 3999,
    image: "/images/hospital.jpg",
    downloadUrl: "/downloads/hospital-management.zip",
  },
  {
    id: 4,
    title: "Social Media Dashboard",
    slug: "social-media-dashboard",
    description: "Modern social networking platform with user profiles, posts, comments, likes, real-time notifications, and messaging system. Features responsive design and dark mode support.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Socket.io"],
    price: 3299,
    image: "/images/social-media.jpg",
    downloadUrl: "/downloads/social-dashboard.zip",
  },
  {
    id: 5,
    title: "Online Learning Platform",
    slug: "online-learning-platform",
    description: "Educational platform with course management, video streaming, quizzes, progress tracking, and certificate generation. Includes instructor and student portals with analytics dashboard.",
    techStack: ["Vue.js", "Django", "PostgreSQL", "Redis", "AWS S3"],
    price: 4299,
    image: "/images/learning.jpg",
    downloadUrl: "/downloads/learning-platform.zip",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAllProjects(): Project[] {
  return projects;
}
