import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = 'nodejs';

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("file");

  if (!fileName) {
    return NextResponse.json({ success: false, message: "file param missing" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "uploads", fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  }

  return NextResponse.json({ success: false, message: "File not found" }, { status: 404 });
}
