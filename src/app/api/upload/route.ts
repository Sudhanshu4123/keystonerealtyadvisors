import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided for upload' }, { status: 400 });
    }

    const uploadedFiles: { url: string; fileName: string; isPdf: boolean }[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type for ${file.name}. Only JPG, PNG, WebP, and PDF brochures are allowed.` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds maximum 10MB size limit.` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || (file.type === 'application/pdf' ? '.pdf' : '.jpg');
      const safeBasename = path.basename(file.name, ext).replace(/[^a-z0-9_-]+/gi, '_');
      const uniqueName = `file_${Date.now()}_${safeBasename}${ext}`;
      const filePath = path.join(uploadDir, uniqueName);

      await writeFile(filePath, buffer);
      
      uploadedFiles.push({
        url: `/uploads/${uniqueName}`,
        fileName: file.name,
        isPdf: file.type === 'application/pdf',
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      urls: uploadedFiles.map((f) => f.url),
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to process file upload' }, { status: 500 });
  }
}
