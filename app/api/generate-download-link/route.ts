import { NextRequest, NextResponse } from "next/server";
import { generateDownloadToken } from "@/lib/downloadToken";
import { getProjectBySlug, getAllProjects } from "@/lib/projects";

export async function POST(request: NextRequest) {
  try {
    const { projectId, userId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Verify project exists
    const projects = getAllProjects();
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Generate secure token
    const token = generateDownloadToken(projectId, userId);
    
    // Create download URL
    const downloadUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/download?token=${token}`;

    return NextResponse.json({
      success: true,
      downloadUrl,
      expiresIn: "24 hours",
    });
  } catch (error) {
    console.error("Error generating download link:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate download link" },
      { status: 500 }
    );
  }
}
