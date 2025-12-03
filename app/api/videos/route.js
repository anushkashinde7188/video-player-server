import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = 'nodejs';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("file");
  const uploadDir = path.join(process.cwd(), "uploads");

  // STREAM A VIDEO
  if (fileName) {
    const filePath = path.join(uploadDir, fileName);

    if (!fs.existsSync(filePath)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const fileStream = fs.createReadStream(filePath);
    return new NextResponse(fileStream, {
      headers: {
        "Content-Type": "video/mp4",
      },
    });
  }

  // LIST ALL VIDEOS
  const files = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];
  const videos = files.map(file => ({
    fileName: file,
    url: `/api/videos?file=${file}`
  }));

  return NextResponse.json({ videos });
}
