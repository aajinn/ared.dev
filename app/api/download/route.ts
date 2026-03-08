import { NextRequest, NextResponse } from "next/server";
import { verifyDownloadToken } from "@/lib/downloadToken";
import { getAllProjects } from "@/lib/projects";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Download token is required" },
        { status: 400 }
      );
    }

    // Verify token
    const payload = verifyDownloadToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired download link" },
        { status: 401 }
      );
    }

    // Get project details
    const projects = getAllProjects();
    const project = projects.find((p) => p.id === payload.projectId);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // In production, you would fetch from cloud storage (S3, etc.)
    // For now, we'll serve from a local storage directory
    const filePath = join(process.cwd(), "storage", "projects", `${project.slug}.zip`);

    try {
      const fileBuffer = await readFile(filePath);

      // Return file with appropriate headers
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${project.slug}.zip"`,
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    } catch (fileError) {
      // If file doesn't exist, return a mock response for development
      console.error("File not found:", filePath);
      
      return NextResponse.json(
        {
          success: false,
          error: "File not found. In production, this would download from cloud storage.",
          projectTitle: project.title,
          note: "Create storage/projects directory and add ZIP files for actual downloads",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { success: false, error: "Failed to download file" },
      { status: 500 }
    );
  }
}
