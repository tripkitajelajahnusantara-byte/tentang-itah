import { getAbout } from '@/lib/db';
import DynamicImage from '@/components/DynamicImage';

export const revalidate = 0; // Ensure live update on admin edits

export default async function AboutPage() {
  let about;
  try {
    about = await getAbout();
  } catch (error) {
    console.error('Failed to load about data:', error);
    about = {
      title: 'Mengenal Tentang Itah',
      content: 'Tentang Itah (berarti "Tentang Kita" dalam Bahasa Dayak Ngaju) adalah wadah pelestarian warisan leluhur Kalimantan Tengah secara digital. Berawal dari keprihatinan atas mulai memudarnya pengetahuan generasi muda terhadap budaya daerah, website ini dirancang untuk mendokumentasikan serta mengedukasi masyarakat luas mengenai keragaman bahasa, tari-tarian, cerita rakyat, adat istiadat, dan nilai filosofis luhur seperti "Falsafah Huma Betang" (hidup rukun berdampingan dalam perbedaan). Kami berharap platform ini dapat menjembatani nilai masa lalu dengan teknologi masa kini agar keunikan budaya Bumi Tambun Bungai tidak lekang oleh waktu.',
      image_url: '/images/about-illustration.jpg',
    };
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16 pt-28">
      
      {/* Header and Breadcrumbs */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-secondary font-extrabold tracking-widest text-3xs sm:text-2xs uppercase">
          ◆ DIGITAL CULTURAL PRESERVATION PLATFORM ◆
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          {about.title}
        </h1>
        <p className="text-muted text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
          Misi digitalisasi warisan budaya Kalimantan Tengah demi masa depan generasi penerus, menghubungkan masa lalu yang agung dengan masa kini yang inklusif.
        </p>
      </div>

      {/* Gold diamond separator */}
      <div className="text-center text-secondary text-xs tracking-widest font-serif">
        ◆ ◆ ◆
      </div>

      {/* Main Content & Illustration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Illustration Image */}
        <div className="lg:col-span-5 relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-card-border">
          <DynamicImage 
            src={about.image_url} 
            alt="Ilustrasi Rumah Adat Betang" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Right: History Text */}
        <div className="lg:col-span-7 space-y-6">
          <span className="text-primary font-bold tracking-wider text-3xs sm:text-2xs uppercase block">
            ASAL-USUL & SEJARAH
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Latar Belakang Website</h2>
          <div className="text-sm text-muted leading-relaxed space-y-4 text-justify font-light">
            <p>
              <strong className="text-primary font-semibold">Tentang Itah</strong> (yang berarti "Tentang Kita" dalam ragam bahasa Dayak Ngaju) merupakan inisiatif digital independen yang berdedikasi melestarikan dan mendokumentasikan kekayaan khazanah budaya, tradisi, dan kearifan lokal Kalimantan Tengah secara lestari.
            </p>
            <p>
              Terinspirasi oleh spirit persatuan Huma Betang yang inklusif, kami mengumpulkan berbagai ragam bahasa daerah, dongeng rakyat, seni tari, upacara adat, serta arsitektur tradisional yang diwariskan secara turun-temurun dari generasi Dayak terdahulu agar tetap dapat dipelajari dengan mudah oleh generasi muda di era serba modern.
            </p>
          </div>
        </div>
      </div>

      {/* Gold diamond separator */}
      <div className="text-center text-secondary text-xs tracking-widest font-serif">
        ◆ ◆ ◆
      </div>

      {/* Visi & Misi cards */}
      <div className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-secondary font-bold text-3xs sm:text-2xs uppercase tracking-widest">ARAH & LANDASAN</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Visi, Misi & Tujuan Kami</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Dokumentasi */}
          <div className="bg-card-bg border border-card-border p-6 rounded-xl space-y-4 shadow-2xs card-lift relative">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-foreground">Dokumentasi Budaya</h3>
            <p className="text-xs text-muted leading-relaxed text-justify font-light">
              Mengarsipkan ragam kosakata bahasa daerah, gerakan tari tradisional, instrumen musik kuno, dan ritual upacara adat Kalimantan Tengah secara komprehensif.
            </p>
          </div>

          {/* Card 2: Edukasi (With Figma gold marker top line) */}
          <div className="bg-card-bg border border-card-border p-6 rounded-xl space-y-4 shadow-2xs card-lift relative border-t-2 border-t-primary">
            {/* Figma Red Dot Marker */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary" />
            
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-foreground">Edukasi Interaktif</h3>
            <p className="text-xs text-muted leading-relaxed text-justify font-light">
              Menyajikan materi pembelajaran kebudayaan yang menyenangkan melalui kuis interaktif, rekaman pelafalan audio yang akurat, serta visualisasi peta adat.
            </p>
          </div>

          {/* Card 3: Kolaborasi */}
          <div className="bg-card-bg border border-card-border p-6 rounded-xl space-y-4 shadow-2xs card-lift relative">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-foreground">Kolaborasi Publik</h3>
            <p className="text-xs text-muted leading-relaxed text-justify font-light">
              Membuka wadah gotong royong digital bagi masyarakat umum untuk ikut berkontribusi mengirimkan dokumentasi cerita rakyat dan foto sejarah daerah masing-masing.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
