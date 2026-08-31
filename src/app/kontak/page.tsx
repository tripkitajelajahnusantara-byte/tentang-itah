import { getContact } from '@/lib/db';

export const revalidate = 0; // Dynamic server rendering to reflect admin updates immediately

export const metadata = {
  title: 'Hubungi Kontak Pengelola - Tentang Itah',
  description: 'Hubungi sekretariat pengelola Tentang Itah. Dapatkan alamat lengkap, email, media sosial, dan nomor kontak kami.',
};

export default async function ContactPage() {
  let contact;
  try {
    contact = await getContact();
  } catch (error) {
    console.error('Failed to load contact data:', error);
    contact = {
      email: 'tentangitah@gmail.com',
      instagram: '@tentangitah',
      facebook: 'Tentang Itah',
      dekranasda_kalteng: '@dekranasdaprovkalteng',
      phone: '082274595638',
      about_us: 'Platform edukasi budaya independen yang dikembangkan oleh putra-putri daerah Kalimantan Tengah untuk melestarikan identitas lokal di era globalisasi.'
    };
  }

  // Ensure contact has correct values in case some fields are missing from DB
  const email = contact.email || 'tentangitah@gmail.com';
  const instagram = contact.instagram || '@tentangitah';
  const facebook = contact.facebook || 'Tentang Itah';
  const phone = contact.phone || '082274595638';
  const dekranasda = contact.dekranasda_kalteng || '@dekranasdaprovkalteng';

  // Format WA number for URL (remove non-digits, handle local format)
  const cleanWaNumber = phone.replace(/\D/g, '');
  const waUrl = `https://wa.me/${cleanWaNumber.startsWith('0') ? '62' + cleanWaNumber.slice(1) : cleanWaNumber}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16 pt-32 bg-[radial-gradient(#FAF6EE_1px,transparent_1px)] [background-size:24px_24px]">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6 animate-fade-in">
        <span className="inline-flex items-center gap-2 text-secondary font-extrabold tracking-widest text-3xs sm:text-2xs uppercase bg-[#FAF6EE] px-4 py-1.5 rounded-full border border-card-border/60 shadow-4xs">
          <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
          Hubungi Kami
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
          Mari Terhubung Bersama Kami
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-primary via-secondary to-primary mx-auto rounded-full" />
        <p className="text-muted text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto font-sans">
          Mempunyai saran, kemitraan kebudayaan, atau masukan? Silakan hubungi kami melalui saluran resmi pengelola Tentang Itah di bawah ini.
        </p>
      </div>

      {/* Grid Content: 5 Premium Cards (Exactly representing the requested 5 channels) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* Card 1: WhatsApp */}
        <div className="bg-white border border-card-border/60 p-5 rounded-2xl shadow-3xs hover:shadow-2xs transition-all duration-300 flex flex-col justify-between items-center text-center space-y-5 group hover:-translate-y-1">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-3xs group-hover:scale-110 transition-transform duration-300">
            <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.66.986 3.288 1.487 4.885 1.488 5.275 0 9.56-4.283 9.564-9.56.002-2.556-.994-4.959-2.805-6.77C16.429 2.498 14.032 1.5 11.48 1.5 6.204 1.5 1.92 5.78 1.916 11.057c-.001 1.692.457 3.327 1.33 4.773L2.2 20.394l4.447-1.24zm12.18-5.834c-.269-.134-1.594-.787-1.84-.875-.246-.089-.425-.134-.605.134-.18.269-.695.875-.853 1.053-.158.178-.316.2-.585.067-.27-.134-1.14-.419-2.17-1.34-.803-.715-1.345-1.6-1.503-1.869-.158-.269-.017-.415.118-.549.12-.12.27-.316.404-.473.134-.158.18-.269.269-.448.09-.179.045-.337-.022-.472-.068-.135-.605-1.458-.828-1.995-.219-.527-.456-.63-.464-.162-.008-.347-.009-.533-.009-.186 0-.489.07-.745.347-.256.277-.98.957-.98 2.33 0 1.373 1 2.699 1.14 2.884.14.185 1.968 3.005 4.767 4.212.666.287 1.185.459 1.589.587.671.213 1.28.183 1.761.111.536-.08 1.594-.65 1.819-1.277.225-.627.225-1.164.158-1.277-.067-.113-.246-.179-.515-.313z"/>
            </svg>
          </div>
          <div className="space-y-1.5 flex-grow">
            <h3 className="font-serif text-base font-bold text-foreground">WhatsApp</h3>
            <p className="text-[10px] text-muted leading-relaxed font-light font-sans max-w-[160px] mx-auto">Konsultasi cepat atau pertanyaan langsung lewat chat WA.</p>
          </div>
          <a 
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-emerald-600 hover:bg-emerald-600 hover:text-white font-bold block text-xs py-2.5 rounded-xl border border-emerald-100 bg-emerald-50/50 transition-all duration-300"
          >
            {phone}
          </a>
        </div>

        {/* Card 2: Instagram */}
        <div className="bg-white border border-card-border/60 p-5 rounded-2xl shadow-3xs hover:shadow-2xs transition-all duration-300 flex flex-col justify-between items-center text-center space-y-5 group hover:-translate-y-1">
          <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center shadow-3xs group-hover:scale-110 transition-transform duration-300">
            <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </div>
          <div className="space-y-1.5 flex-grow">
            <h3 className="font-serif text-base font-bold text-foreground">Instagram</h3>
            <p className="text-[10px] text-muted leading-relaxed font-light font-sans max-w-[160px] mx-auto">Update berkala kegiatan pelestarian dan galeri visual kami.</p>
          </div>
          <a 
            href={`https://www.instagram.com/${instagram.replace('@', '')}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-pink-600 hover:bg-pink-600 hover:text-white font-bold block text-xs py-2.5 rounded-xl border border-pink-100 bg-pink-50/50 transition-all duration-300"
          >
            {instagram}
          </a>
        </div>

        {/* Card 3: Facebook */}
        <div className="bg-white border border-card-border/60 p-5 rounded-2xl shadow-3xs hover:shadow-2xs transition-all duration-300 flex flex-col justify-between items-center text-center space-y-5 group hover:-translate-y-1">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-3xs group-hover:scale-110 transition-transform duration-300">
            <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
            </svg>
          </div>
          <div className="space-y-1.5 flex-grow">
            <h3 className="font-serif text-base font-bold text-foreground">Facebook</h3>
            <p className="text-[10px] text-muted leading-relaxed font-light font-sans max-w-[160px] mx-auto">Media komunikasi sosial dan komunitas digital kami.</p>
          </div>
          <a 
            href="https://www.instagram.com/tentangitah/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-blue-600 hover:bg-blue-600 hover:text-white font-bold block text-xs py-2.5 rounded-xl border border-blue-100 bg-blue-50/50 transition-all duration-300"
          >
            {facebook}
          </a>
        </div>

        {/* Card 4: Email */}
        <div className="bg-white border border-card-border/60 p-5 rounded-2xl shadow-3xs hover:shadow-2xs transition-all duration-300 flex flex-col justify-between items-center text-center space-y-5 group hover:-translate-y-1">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-3xs group-hover:scale-110 transition-transform duration-300">
            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="space-y-1.5 flex-grow">
            <h3 className="font-serif text-base font-bold text-foreground">Surel Resmi</h3>
            <p className="text-[10px] text-muted leading-relaxed font-light font-sans max-w-[160px] mx-auto">Kirim surat elektronik umum atau proposal kolaborasi riset.</p>
          </div>
          <a 
            href={`mailto:${email}`} 
            className="w-full text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold block text-xs py-2.5 rounded-xl border border-indigo-100 bg-indigo-50/50 transition-all duration-300"
          >
            {email}
          </a>
        </div>

        {/* Card 5: Dekranasda Kalteng */}
        <div className="bg-white border border-card-border/60 p-5 rounded-2xl shadow-3xs hover:shadow-2xs transition-all duration-300 flex flex-col justify-between items-center text-center space-y-5 group hover:-translate-y-1">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shadow-3xs group-hover:scale-110 transition-transform duration-300">
            <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </div>
          <div className="space-y-1.5 flex-grow">
            <h3 className="font-serif text-base font-bold text-foreground">Dekranasda</h3>
            <p className="text-[10px] text-muted leading-relaxed font-light font-sans max-w-[160px] mx-auto">Mitra resmi pelestarian kerajinan & seni budaya Kalteng.</p>
          </div>
          <a 
            href="https://www.instagram.com/dekranasdaprovkalteng/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-amber-700 hover:bg-amber-600 hover:text-white font-bold block text-xs py-2.5 rounded-xl border border-amber-100 bg-amber-50/50 transition-all duration-300"
          >
            {dekranasda}
          </a>
        </div>

      </div>

      {/* Description / Summary Callout */}
      <div className="bg-[#120F0D] text-white/90 border border-card-border/20 rounded-3xl p-8 max-w-5xl mx-auto text-center space-y-4 shadow-sm relative overflow-hidden font-sans">
        {/* Subtle decorative quote marks */}
        <span className="absolute top-4 left-6 text-white/5 font-serif text-8xl leading-none select-none">“</span>
        <span className="absolute bottom-2 right-6 text-white/5 font-serif text-8xl leading-none select-none">”</span>
        <h4 className="font-serif text-lg font-bold text-secondary tracking-wide z-10 relative">Deskripsi Pengelola Tentang Itah</h4>
        <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light max-w-2xl mx-auto z-10 relative text-justify md:text-center">
          {contact.about_us || 'Platform edukasi budaya independen yang dikembangkan oleh putra-putri daerah Kalimantan Tengah untuk melestarikan identitas lokal di era globalisasi.'}
        </p>
      </div>

    </div>
  );
}
