import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getAllContent, updateContent } from "@/lib/content";

function isAuthorized(request: NextRequest): boolean {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) return false;
  const auth = request.headers.get("x-admin-key");
  return auth === adminKey;
}

export async function GET() {
  const content = await getAllContent();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { section, data } = body;

  if (!section || !data) {
    return NextResponse.json(
      { error: "section and data are required" },
      { status: 400 }
    );
  }

  const validSections = [
    "skills",
    "experience",
    "project",
    "hero",
    "social",
    "email",
    "footer",
  ];

  if (!validSections.includes(section)) {
    return NextResponse.json(
      { error: "Invalid section" },
      { status: 400 }
    );
  }

  const result = await updateContent(section, data);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    );
  }

  revalidatePath("/");

  return NextResponse.json({ success: true });
}
