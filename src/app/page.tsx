import Link from 'next/link';
import { getHomepage, getArtsCulture, getTraditions, ArtsCulture, Tradition } from '@/lib/db';
import DynamicImage from '@/components/DynamicImage';

export const revalidate = 0; // Dynamic server rendering to reflect admin updates immediately

export default async function Home() {
  let homepage;
  let arts: ArtsCulture[] = [];
  let traditions: Tradition[] = [];

  try {
    homepage = await getHomepage();
    arts = await getArtsCulture();
    traditions = await getTraditions();
  } catch (error) {
    console.error('Failed to load database content on home page:', error);
    homepage = {
      hero_title: 'Jelajahi Pesona Budaya Kalimantan Tengah',
      hero_subtitle: 'Platform edukasi digital untuk mengenal, mempelajari, dan melestarikan ragam bahasa, tradisi, seni, serta cerita rakyat Kalimantan Tengah.',
      hero_image: '/images/hero-banner.jpg',
      logo_1: '/images/logo-kalteng.png',
      logo_2: '/images/logo-itah.png',
      logo_3: '/images/logo-tutwuri.png',
      cta_text: 'Jelajahi Budaya',
    };
  }

  // Pre-filter/setup highlights based on database or fallbacks
  const mainArts = arts.filter(a => a.name.includes('Mandau') || a.name.includes('Tambun'))
  const displayArts = mainArts.length > 0 ? mainArts : arts.slice(0, 2);
  const displayTrads = traditions.filter(t => t.name.includes('Tiwah')).slice(0, 1);

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      
      {/* 1. HERO / BANNER SECTION (Centered Layout from Figma) */}
      <section className="relative min-h-[90vh] flex items-center bg-[#120F0D] overflow-hidden text-white pt-24">
        {/* Background Image / Illustration */}
        <div className="absolute inset-0 z-0 opacity-70">
          <DynamicImage 
            src={homepage.hero_image} 
            alt="Hero Banner Kebudayaan" 
            className="w-full h-full rounded-none object-cover"
            priority={true}
          />
        </div>
        
        {/* Gradient Overlay for centering contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#120F0D] z-10" />

        {/* Content Container */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-28 md:pb-24 text-center flex flex-col items-center">
          <div className="space-y-6 md:space-y-8 flex flex-col items-center">
            
            {/* Gold Prefix */}
            <span className="text-secondary font-extrabold tracking-widest text-2xs sm:text-xs uppercase flex items-center gap-2">
              ◆ DIGITAL CULTURAL PRESERVATION PLATFORM ◆
            </span>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight max-w-4xl drop-shadow-md">
              {homepage.hero_title}
            </h1>
            
            <p className="text-base sm:text-lg text-white/95 font-light leading-relaxed max-w-2xl drop-shadow-sm">
              {homepage.hero_subtitle}
            </p>
            
            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/jelajah" 
                className="inline-flex justify-center items-center px-8 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-white font-semibold transition-all duration-300 shadow-md shadow-primary/20 hover:scale-105"
              >
                {homepage.cta_text}
              </Link>
              <Link 
                href="/tentang" 
                className="inline-flex justify-center items-center px-8 py-3.5 rounded-full bg-transparent hover:bg-white/10 text-white font-semibold border border-white hover:border-white transition-all duration-300 hover:scale-105"
              >
                Mengenal Tentang Itah
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 2. DIDUKUNG DAN DIKEMBANGKAN BERSAMA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-30 w-full animate-fade-in">
        <div className="bg-white border border-card-border/60 rounded-xl shadow-md p-6 sm:p-8 text-center space-y-6">
          <p className="text-4xs sm:text-3xs font-extrabold text-muted uppercase tracking-widest">
            Didukung dan Dikembangkan Bersama
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16">
            <img 
              src="/images/logo_kemendikbud.png" 
              alt="Kementerian Kebudayaan" 
              className="h-12 sm:h-16 md:h-18 w-auto object-contain mix-blend-multiply hover:scale-105 transition-all duration-300" 
            />
            <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
            <img 
              src="/images/logo_dana_indonesiana.png" 
              alt="Dana Indonesiana" 
              className="h-20 sm:h-26 md:h-30 w-auto object-contain mix-blend-multiply hover:scale-105 transition-all duration-300" 
            />
            <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
            <img 
              src="/images/logo_lpdp.png" 
              alt="LPDP" 
              className="h-12 sm:h-16 md:h-18 w-auto object-contain mix-blend-multiply hover:scale-105 transition-all duration-300" 
            />
            <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
            <img 
              src="/images/logo_tentang_itah.png" 
              alt="Tentang Itah" 
              className="h-12 sm:h-16 md:h-18 w-auto object-contain mix-blend-multiply hover:scale-105 transition-all duration-300" 
            />
          </div>
        </div>
      </section>

      {/* 3. FALSAFAH HUMA BETANG SECTION (Screenshot 1 Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Teks Deskripsi */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-primary font-bold tracking-wider text-2xs sm:text-xs uppercase block">
              HARMONI DALAM KEBERSAMAAN
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Menjunjung Tinggi Falsafah Huma Betang
            </h2>
            <p className="text-sm text-muted leading-relaxed text-justify">
              Falsafah Huma Betang merupakan landasan kehidupan sosio-kultural suku Dayak di Kalimantan Tengah. Nilai persatuan, kebersamaan, kejujuran, dan toleransi yang kokoh terpancar dari bagaimana puluhan keluarga dapat hidup damai berdampingan dalam satu rumah panjang adat yang megah.
            </p>
            <p className="text-sm text-muted leading-relaxed text-justify">
              Bukan sekadar konstruksi arsitektur kayu ulin tradisional, Huma Betang mengajarkan arti mendalam tentang hidup bergotong-royong, memelihara kelestarian alam, serta menghargai setiap perbedaan dalam harmoni penuh kebersamaan.
            </p>
            <div className="pt-2">
              <Link 
                href="/tentang"
                className="inline-flex items-center text-primary font-bold hover:text-primary-hover hover:underline transition-all text-xs group"
              >
                Selengkapnya Tentang Kami
                <svg className="w-4 h-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Ilustrasi Betang */}
          <div className="lg:col-span-5 relative w-full aspect-[4/3] rounded-2xl shadow-md border border-card-border overflow-hidden">
            <DynamicImage src="/images/wadian-bawo.jpg" alt="Ilustrasi Falsafah Huma Betang" className="w-full h-full" />
          </div>

        </div>
      </section>

      {/* 4. STATISTICS ROW (Dark Charcoal Background from Figma) */}
      <section className="bg-[#151210] py-12 md:py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            {/* Stat 1 */}
            <div className="space-y-1.5">
              <p className="text-3xl sm:text-4xl font-extrabold text-secondary">14</p>
              <p className="text-xs sm:text-sm font-bold text-white">Daerah & Kabupaten</p>
              <p className="text-3xs text-muted">Provinsi menyeluruh</p>
            </div>

            {/* Stat 2 */}
            <div className="space-y-1.5">
              <p className="text-3xl sm:text-4xl font-extrabold text-secondary">100+</p>
              <p className="text-xs sm:text-sm font-bold text-white">Kosakata Bahasa</p>
              <p className="text-3xs text-muted">Kamus Dayak digital</p>
            </div>

            {/* Stat 3 */}
            <div className="space-y-1.5">
              <p className="text-3xl sm:text-4xl font-extrabold text-secondary">30+</p>
              <p className="text-xs sm:text-sm font-bold text-white">Rumah Betang</p>
              <p className="text-3xs text-muted">Tercatat dan dilestarikan</p>
            </div>

            {/* Stat 4 */}
            <div className="space-y-1.5">
              <p className="text-3xl sm:text-4xl font-extrabold text-secondary">50+</p>
              <p className="text-xs sm:text-sm font-bold text-white">Cerita Adat & Seni</p>
              <p className="text-3xs text-muted">Telah diarsipkan</p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. HIGHLIGHTS OF BUDAYA (Screenshot 1 Grid Cards) */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <div className="space-y-2">
              <span className="text-secondary font-bold tracking-wider text-2xs sm:text-xs uppercase block">◆ GALERI SOROTAN ◆</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Sekilas Kekayaan Budaya Bumi Tambun Bungai</h2>
            </div>
            <Link 
              href="/jelajah" 
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white font-semibold text-xs transition-all duration-300 shrink-0"
            >
              Jelajahi Peta Budaya
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Tari Mandau */}
            {displayArts[0] && (
              <div className="bg-card-bg rounded-xl border border-card-border/60 card-lift overflow-hidden group flex flex-col justify-between">
                <div>
                  <div className="w-full aspect-[16/10] overflow-hidden">
                    <DynamicImage src={displayArts[0].image_url} alt={displayArts[0].name} className="w-full h-full rounded-none" />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center text-3xs font-bold text-secondary uppercase">
                      <span>SENI TARI</span>
                      <span className="text-muted font-normal">{displayArts[0].origin_region}</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-all line-clamp-1">
                      {displayArts[0].name}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-3 text-justify">
                      Tarian kolosal kepahlawanan pemuda Dayak yang melambangkan keberanian, ketangkasan, dan rasa hormat yang sakral kepada leluhur dalam mempertahankan tanah air.
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-2">
                  <Link 
                    href="/seni-budaya" 
                    className="inline-flex items-center text-xs font-bold text-primary hover:text-primary-hover group/link"
                  >
                    Pelajari Makna
                    <svg className="w-3.5 h-3.5 ml-1 transition-transform duration-300 group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}

            {/* Card 2: Tari Tambun dan Bungai */}
            {displayArts[1] && (
              <div className="bg-card-bg rounded-xl border border-card-border/60 card-lift overflow-hidden group flex flex-col justify-between">
                <div>
                  <div className="w-full aspect-[16/10] overflow-hidden">
                    <DynamicImage src={displayArts[1].image_url} alt={displayArts[1].name} className="w-full h-full rounded-none" />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center text-3xs font-bold text-secondary uppercase">
                      <span>SENI TARI</span>
                      <span className="text-muted font-normal">{displayArts[1].origin_region}</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-all line-clamp-1">
                      {displayArts[1].name}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-3 text-justify">
                      Karya seni tari rakyat yang mengisahkan kepahlawanan Tambun dan Bungai dalam mengusir musuh yang berniat merusak kedamaian bumi Kalimantan Tengah.
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-2">
                  <Link 
                    href="/seni-budaya" 
                    className="inline-flex items-center text-xs font-bold text-primary hover:text-primary-hover group/link"
                  >
                    Pelajari Makna
                    <svg className="w-3.5 h-3.5 ml-1 transition-transform duration-300 group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}

            {/* Card 3: Upacara Tiwah */}
            {displayTrads[0] && (
              <div className="bg-card-bg rounded-xl border border-card-border/60 card-lift overflow-hidden group flex flex-col justify-between">
                <div>
                  <div className="w-full aspect-[16/10] overflow-hidden">
                    <DynamicImage src={displayTrads[0].image_url} alt={displayTrads[0].name} className="w-full h-full rounded-none" />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center text-3xs font-bold text-secondary uppercase">
                      <span>UPACARA ADAT</span>
                      <span className="text-muted font-normal">{displayTrads[0].location.split(',')[0]}</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-all line-clamp-1">
                      {displayTrads[0].name}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-3 text-justify">
                      Upacara ritual sakral penganut Hindu Kaharingan untuk mengantarkan jiwa arwah sanak saudara yang wafat menuju surga Lewu Tatau.
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-2">
                  <Link 
                    href="/tradisi" 
                    className="inline-flex items-center text-xs font-bold text-primary hover:text-primary-hover group/link"
                  >
                    Pelajari Makna
                    <svg className="w-3.5 h-3.5 ml-1 transition-transform duration-300 group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 6. CULTURAL QUOTE SECTION (Figma Quote Accent) */}
      <section className="py-12 border-t border-card-border/40 text-center space-y-4">
        <span className="text-secondary text-base block font-serif">◆</span>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold italic text-foreground tracking-wide max-w-3xl mx-auto px-4">
          "Belum Bahadat, Ela Manyundau Kahalat"
        </h2>
        <p className="text-3xs sm:text-2xs font-extrabold tracking-widest text-secondary uppercase">
          — FALSAFAH LUHUR DAYAK NGAJU TENTANG ADAB & TATA KRAMA HIDUP —
        </p>
      </section>

    </div>
  );
}
