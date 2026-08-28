import { getContact } from '@/lib/db';

export const revalidate = 0; // Dynamic server rendering to reflect admin updates immediately

export const metadata = {
  title: 'Hubungi Kontak Pengelola',
  description: 'Hubungi sekretariat pengelola Tentang Itah. Dapatkan alamat lengkap, email, media sosial, dan nomor kontak kami.',
};

export default async function ContactPage() {
  let contact;
  try {
    contact = await getContact();
  } catch (error) {
    console.error('Failed to load contact data:', error);
    contact = {
      email: 'kontak@tentangitah.id',
      instagram: '@tentangitah.kalteng',
      facebook: 'Tentang Itah Kalteng',
      twitter: '@tentangitah',
      address: 'Jl. Tjilik Riwut KM 2.5, Kota Palangka Raya, Kalimantan Tengah 73111',
      phone: '+62 811-520-2026',
      about_us: 'Platform edukasi budaya independen yang dikembangkan oleh putra-putri daerah Kalimantan Tengah untuk melestarikan identitas lokal di era globalisasi.'
    };
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16 pt-32">
      
      {/* Header (Figma Design Language) */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-secondary font-extrabold tracking-widest text-3xs sm:text-2xs uppercase">
          ◆ HUBUNGI KAMI ◆
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          Hubungi Pengelola Tentang Itah
        </h1>
        <div className="w-20 h-0.5 bg-secondary mx-auto" />
        <p className="text-muted text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto font-sans">
          Mempunyai saran, kerja sama kebudayaan, atau koreksi data penelitian? Hubungi kami melalui saluran resmi sekretariat pengelola di bawah ini.
        </p>
      </div>

      {/* Grid Content: 3-column horizontal grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1: Email */}
        <div className="bg-white border border-card-border/60 p-8 rounded-2xl shadow-3xs card-lift flex flex-col items-center text-center space-y-5">
          <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center text-primary shrink-0 shadow-3xs">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="space-y-3 flex-grow flex flex-col justify-between w-full">
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground">Surel Resmi</h3>
              <p className="text-3xs text-muted leading-relaxed font-light font-sans mt-1">Kirim surat elektronik umum atau proposal kolaborasi riset.</p>
            </div>
            <a href={`mailto:${contact.email}`} className="text-primary hover:text-primary-hover font-bold block text-sm pt-3 break-all bg-primary/5 py-2.5 rounded-lg border border-primary/10 transition-colors">
              {contact.email}
            </a>
          </div>
        </div>

        {/* Card 2: Phone */}
        {contact.phone && (
          <div className="bg-white border border-card-border/60 p-8 rounded-2xl shadow-3xs card-lift flex flex-col items-center text-center space-y-5">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center text-primary shrink-0 shadow-3xs">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="space-y-3 flex-grow flex flex-col justify-between w-full">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">Telepon & WA</h3>
                <p className="text-3xs text-muted leading-relaxed font-light font-sans mt-1">Layanan sambungan telepon call center sekretariat.</p>
              </div>
              <a href={`tel:${contact.phone}`} className="text-primary hover:text-primary-hover font-bold block text-sm pt-3 bg-primary/5 py-2.5 rounded-lg border border-primary/10 transition-colors">
                {contact.phone}
              </a>
            </div>
          </div>
        )}

        {/* Card 3: Address */}
        <div className="bg-white border border-card-border/60 p-8 rounded-2xl shadow-3xs card-lift flex flex-col items-center text-center space-y-5">
          <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center text-primary shrink-0 shadow-3xs">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="space-y-3 flex-grow flex flex-col justify-between w-full">
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground">Sekretariat Kantor</h3>
              <p className="text-3xs text-muted leading-relaxed font-light font-sans mt-1">Alamat fisik operasional redaksi Tentang Itah.</p>
            </div>
            <p className="text-foreground/90 text-xs font-semibold pt-3 leading-relaxed break-words bg-primary/5 py-2 px-3 rounded-lg border border-primary/10 min-h-[44px] flex items-center justify-center">
              {contact.address}
            </p>
          </div>
        </div>

      </div>

      {/* Redesigned Mock Location Map card (Adding premium aesthetic) */}
      <div className="bg-white border border-card-border/60 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-card-border/40 pb-4">
          <div className="space-y-1">
            <span className="text-3xs uppercase tracking-widest font-extrabold text-secondary">PETA LOKASI SEKRETARIAT</span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">Palangka Raya, Kalimantan Tengah</h3>
          </div>
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#120F0D] hover:bg-[#221A15] text-white text-xs font-bold rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-black/10"
          >
            <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Buka Petunjuk Arah
          </a>
        </div>
        
        {/* Breathtaking CSS Map Mockup representing local coordinate */}
        <div className="h-64 rounded-2xl bg-[#EBE4DC] border border-card-border/40 relative overflow-hidden flex items-center justify-center">
          {/* Abstract map lines */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#120F0D_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute w-full h-1 bg-[#120F0D]/10 top-1/3 transform -rotate-12" />
          <div className="absolute w-full h-1.5 bg-[#120F0D]/10 top-1/2 transform rotate-6" />
          <div className="absolute h-full w-1 bg-[#120F0D]/10 left-1/3 transform rotate-12" />
          <div className="absolute h-full w-1.5 bg-[#120F0D]/10 left-2/3 transform -rotate-6" />
          
          {/* Animated Gold Location Marker Pin */}
          <div className="relative z-10 flex flex-col items-center space-y-2">
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-secondary/30 opacity-75" />
              <div className="w-10 h-10 bg-[#C0482B] rounded-full flex items-center justify-center text-white border-2 border-white shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
            </div>
            <div className="bg-[#120F0D] text-white px-3.5 py-1.5 rounded-lg text-3xs font-bold uppercase tracking-wider shadow-md border border-card-border/20 text-center">
              <p className="text-secondary font-extrabold tracking-widest pb-0.5">TENTANG ITAH OFFICE</p>
              <p className="text-white/60 lowercase text-[9px] font-normal leading-none font-sans">Palangka Raya, Kalteng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Social Media Section */}
      {(contact.instagram || contact.facebook || contact.twitter) && (
        <div className="bg-[#FAF6EE] border border-card-border p-6 rounded-2xl shadow-3xs max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs">
          <span className="font-extrabold text-foreground/80 uppercase tracking-widest text-3xs">MEDIA SOSIAL RESMI PENGELOLA</span>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
            {contact.instagram && (
              <a 
                href={`https://instagram.com/${contact.instagram.replace('@', '')}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-105 transition-all flex items-center gap-2 px-4 py-2 border border-card-border bg-white rounded-full text-foreground/80 shadow-3xs"
              >
                <span className="text-[#C68A35] font-extrabold tracking-widest text-[9px] uppercase">Instagram</span>
                <span className="font-bold text-3xs">{contact.instagram}</span>
              </a>
            )}
            {contact.facebook && (
              <a 
                href="#"
                className="hover:scale-105 transition-all flex items-center gap-2 px-4 py-2 border border-card-border bg-white rounded-full text-foreground/80 shadow-3xs"
              >
                <span className="text-[#C68A35] font-extrabold tracking-widest text-[9px] uppercase">Facebook</span>
                <span className="font-bold text-3xs">{contact.facebook}</span>
              </a>
            )}
            {contact.twitter && (
              <a 
                href={`https://twitter.com/${contact.twitter.replace('@', '')}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-105 transition-all flex items-center gap-2 px-4 py-2 border border-card-border bg-white rounded-full text-foreground/80 shadow-3xs"
              >
                <span className="text-[#C68A35] font-extrabold tracking-widest text-[9px] uppercase">Twitter</span>
                <span className="font-bold text-3xs">{contact.twitter}</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Description / Summary Callout */}
      <div className="bg-[#120F0D] text-white/90 border border-card-border/20 rounded-3xl p-8 max-w-4xl mx-auto text-center space-y-4 shadow-sm font-sans relative overflow-hidden">
        {/* Subtle decorative quote marks */}
        <span className="absolute top-4 left-6 text-white/5 font-serif text-8xl leading-none">“</span>
        <span className="absolute bottom-2 right-6 text-white/5 font-serif text-8xl leading-none">”</span>
        <h4 className="font-serif text-lg font-bold text-secondary tracking-wide z-10 relative">Deskripsi Pengelola Tentang Itah</h4>
        <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light max-w-2xl mx-auto z-10 relative text-justify md:text-center">
          {contact.about_us || 'Platform edukasi budaya independen yang dikembangkan oleh putra-putri daerah Kalimantan Tengah untuk melestarikan identitas lokal di era globalisasi.'}
        </p>
      </div>

    </div>
  );
}
