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

    // --- FILE SIZE VALIDATION ---
    const fileType = file.type || '';
    const fileSize = file.size; // in bytes

    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_DEFAULT_SIZE = 2 * 1024 * 1024; // 2MB

    if (fileType.startsWith('image/')) {
      if (fileSize > MAX_IMAGE_SIZE) {
        return NextResponse.json({ error: 'Ukuran gambar maksimal adalah 5MB' }, { status: 400 });
      }
    } else if (fileType.startsWith('audio/')) {
      if (fileSize > MAX_AUDIO_SIZE) {
        return NextResponse.json({ error: 'Ukuran file audio maksimal adalah 10MB' }, { status: 400 });
      }
    } else {
      if (fileSize > MAX_DEFAULT_SIZE) {
        return NextResponse.json({ error: 'Ukuran file maksimal adalah 2MB' }, { status: 400 });
      }
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
