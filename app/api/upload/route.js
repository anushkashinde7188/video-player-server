import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const uploadDir = path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 200 * 1024 * 1024,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
}

export async function POST(req) {
  try {
    const { files } = await parseForm(req);
    const video = files.video;
    const uploaded = Array.isArray(video) ? video[0] : video;

    const fileName = path.basename(uploaded.filepath);

    return NextResponse.json({
      success: true,
      message: "Video uploaded successfully",
      fileName,
      url: `/api/videos?file=${fileName}`
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
