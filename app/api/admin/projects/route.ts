import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// In production, this would use a real database
// For now, we'll work with the static file
let projectsData = [
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

// POST - Add new project
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const techStack = (formData.get("techStack") as string).split(",").map(t => t.trim());
    const price = parseInt(formData.get("price") as string);
    const zipFile = formData.get("zipFile") as File | null;
    const imageFile = formData.get("imageFile") as File | null;

    // Generate new ID
    const newId = Math.max(...projectsData.map(p => p.id), 0) + 1;

    // Handle file uploads
    let zipPath = `/downloads/${slug}.zip`;
    let imagePath = `/images/${slug}.jpg`;

    if (zipFile) {
      const storageDir = join(process.cwd(), "storage", "projects");
      if (!existsSync(storageDir)) {
        await mkdir(storageDir, { recursive: true });
      }
      
      const bytes = await zipFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = join(storageDir, `${slug}.zip`);
      await writeFile(filePath, buffer);
    }

    if (imageFile) {
      const publicDir = join(process.cwd(), "public", "images");
      if (!existsSync(publicDir)) {
        await mkdir(publicDir, { recursive: true });
      }
      
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = join(publicDir, `${slug}.jpg`);
      await writeFile(filePath, buffer);
    }

    const newProject = {
      id: newId,
      title,
      slug,
      description,
      techStack,
      price,
      image: imagePath,
      downloadUrl: zipPath,
    };

    projectsData.push(newProject);

    return NextResponse.json({
      success: true,
      project: newProject,
    });
  } catch (error) {
    console.error("Error adding project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add project" },
      { status: 500 }
    );
  }
}

// PUT - Update project
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const id = parseInt(formData.get("id") as string);
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const techStack = (formData.get("techStack") as string).split(",").map(t => t.trim());
    const price = parseInt(formData.get("price") as string);
    const zipFile = formData.get("zipFile") as File | null;
    const imageFile = formData.get("imageFile") as File | null;

    const projectIndex = projectsData.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Handle file uploads if provided
    if (zipFile) {
      const storageDir = join(process.cwd(), "storage", "projects");
      const bytes = await zipFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = join(storageDir, `${slug}.zip`);
      await writeFile(filePath, buffer);
    }

    if (imageFile) {
      const publicDir = join(process.cwd(), "public", "images");
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = join(publicDir, `${slug}.jpg`);
      await writeFile(filePath, buffer);
    }

    projectsData[projectIndex] = {
      ...projectsData[projectIndex],
      title,
      slug,
      description,
      techStack,
      price,
    };

    return NextResponse.json({
      success: true,
      project: projectsData[projectIndex],
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    const projectIndex = projectsData.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    projectsData.splice(projectIndex, 1);

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
