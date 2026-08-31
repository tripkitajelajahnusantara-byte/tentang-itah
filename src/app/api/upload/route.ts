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

    const isImage = fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/jpg' || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png');
    const isAudio = fileType === 'audio/mpeg' || fileType === 'audio/mp3' || fileName.endsWith('.mp3');

    if (isImage) {
      if (fileSize < MIN_FILE_SIZE || fileSize > MAX_IMAGE_SIZE) {
        return NextResponse.json({ error: 'Ukuran gambar minimal 10 KB dan maksimal 500 KB' }, { status: 400 });
      }
    } else if (isAudio) {
      if (fileSize < MIN_FILE_SIZE || fileSize > MAX_AUDIO_SIZE) {
        return NextResponse.json({ error: 'Ukuran audio minimal 10 KB dan maksimal 5 MB' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Format berkas tidak didukung. Hanya gambar (JPG, JPEG, PNG) dan audio (MP3) yang diperbolehkan' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = path.extname(file.name).toLowerCase();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExtension}`;

    // --- SUPABASE STORAGE UPLOAD FALLBACK ---
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && supabase) {
      try {
        const { data, error } = await supabase.storage
          .from('tentang-itah')
          .upload(uniqueFilename, buffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          });
        
        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('tentang-itah')
            .getPublicUrl(uniqueFilename);
          
          return NextResponse.json({ url: publicUrlData.publicUrl });
        }
      } catch (storageError) {
        console.error('Supabase storage upload error, falling back to local:', storageError);
      }
    }

    // --- LOCAL STORAGE UPLOAD ---
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueFilename);
    await fs.promises.writeFile(filePath, buffer);

    return NextResponse.json({ 
      url: `/uploads/${uniqueFilename}` 
    });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: error.message || 'Gagal mengunggah berkas' }, { status: 500 });
  }
}
