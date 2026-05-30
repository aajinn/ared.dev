import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

const BUCKET = "images";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const BASE_URL = `${supabaseUrl}/storage/v1/object/public/${BUCKET}`;

export async function GET(request: NextRequest) {
  const supabase = getAdminClient();

  const { data, error } = await supabase.storage.from(BUCKET).list("", {
    sortBy: { column: "created_at", order: "desc" },
    limit: 200,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const images = (data || []).map((file) => ({
    name: file.name,
    url: `${BASE_URL}/${file.name}`,
    size: (file.metadata as any)?.size,
  }));

  const etag = `"${images.length}-${Date.now()}"`;

  if (request.headers.get("if-none-match") === etag) {
    return new NextResponse(null, { status: 304 });
  }

  return NextResponse.json({ images }, {
    headers: {
      "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300",
      "Vary": "Accept-Encoding",
      "ETag": etag,
      "CDN-Cache-Control": "public, max-age=60, stale-while-revalidate=600",
    },
  });
}

export async function POST(req: NextRequest) {
  const supabase = getAdminClient();
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const fileName = formData.get("name") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "";
  let name = fileName || file.name.replace(/\.[^.]+$/, "");
  name = name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!name) name = "image";
  const fullName = `${name}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { data, error } = await supabase.storage.from(BUCKET).upload(fullName, buffer, {
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${data.path}`;

  return NextResponse.json({ url: publicUrl, path: data.path });
}

export async function DELETE(req: NextRequest) {
  const supabase = getAdminClient();
  const { path } = await req.json();

  if (!path) {
    return NextResponse.json({ error: "No path provided" }, { status: 400 });
  }

  const { error } = await supabase.storage.from(BUCKET).remove([path]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
