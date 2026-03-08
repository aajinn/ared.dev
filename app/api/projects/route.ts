import { NextResponse } from "next/server";

export async function GET() {
  const projects = [
    { id: 1, slug: "project-one", title: "Project One" },
    { id: 2, slug: "project-two", title: "Project Two" },
  ];

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ success: true, data: body }, { status: 201 });
}
