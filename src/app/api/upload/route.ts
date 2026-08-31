import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'Tidak ada berkas yang diunggah' }, { status: 400 });
    }

    // --- FILE SIZE & FORMAT VALIDATION ---
    const fileType = file.type || '';
    const fileSize = file.size; // in bytes
    const fileName = file.name.toLowerCase();

    const MIN_FILE_SIZE = 10 * 1024; // 10KB
    const MAX_IMAGE_SIZE = 500 * 1024; // 500KB
    const MAX_AUDIO_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_VIDEO_SIZE = 4 * 1024 * 1024; // 4MB

    const isImage = fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/jpg' || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png');
    const isAudio = fileType === 'audio/mpeg' || fileType === 'audio/mp3' || fileName.endsWith('.mp3') || fileType === 'audio/x-mpeg-3' || fileType === 'audio/mp3';
    const isVideo = fileType.startsWith('video/') || fileName.endsWith('.mp4') || fileName.endsWith('.webm') || fileName.endsWith('.mov');

    if (isImage) {
      if (fileSize < MIN_FILE_SIZE || fileSize > MAX_IMAGE_SIZE) {
        return NextResponse.json({ error: 'Ukuran gambar minimal 10 KB dan maksimal 500 KB' }, { status: 400 });
      }
    } else if (isAudio) {
      if (fileSize < MIN_FILE_SIZE || fileSize > MAX_AUDIO_SIZE) {
        return NextResponse.json({ error: 'Ukuran audio minimal 10 KB dan maksimal 5 MB' }, { status: 400 });
      }
    } else if (isVideo) {
      if (fileSize < MIN_FILE_SIZE || fileSize > MAX_VIDEO_SIZE) {
        return NextResponse.json({ error: 'Ukuran video minimal 10 KB dan maksimal 4 MB' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Format berkas tidak didukung. Hanya gambar (JPG, JPEG, PNG), audio (MP3), dan video (MP4, WEBM, MOV) yang diperbolehkan' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64DataUrl = `data:${file.type || 'application/octet-stream'};base64,${buffer.toString('base64')}`;

    const fileExtension = path.extname(file.name).toLowerCase();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExtension}`;

    // --- 1. TRY SUPABASE STORAGE UPLOAD ---
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) && supabase) {
      try {
        const { data, error } = await supabase.storage
          .from('tentang-itah')
          .upload(uniqueFilename, buffer, {
            contentType: file.type || 'application/octet-stream',
            cacheControl: '3600',
            upsert: false
          });
        
        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('tentang-itah')
            .getPublicUrl(uniqueFilename);
          
          return NextResponse.json({ url: publicUrlData.publicUrl });
        }
        console.warn('Supabase storage upload returned error, falling back to Data URL / local storage:', error?.message);
      } catch (storageError: any) {
        console.warn('Supabase storage exception, falling back to Data URL / local storage:', storageError?.message);
      }
    }

    // --- 2. TRY LOCAL STORAGE WRITE ---
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, uniqueFilename);
      await fs.promises.writeFile(filePath, buffer);

      return NextResponse.json({ 
        url: `/uploads/${uniqueFilename}` 
      });
    } catch (localError: any) {
      console.warn('Local storage write skipped on serverless platform, using Data URL fallback:', localError?.message);
    }

    // --- 3. SEAMLESS FALLBACK: DATA URL (Guaranteed to work 100% on serverless / Vercel without RLS errors) ---
    return NextResponse.json({ 
      url: base64DataUrl 
    });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: error.message || 'Gagal memproses berkas' }, { status: 400 });
  }
}
