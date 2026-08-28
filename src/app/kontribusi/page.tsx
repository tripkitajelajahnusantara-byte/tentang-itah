import ContributionForm from '@/components/ContributionForm';
import DynamicImage from '@/components/DynamicImage';

export const metadata = {
  title: 'Kirim Kontribusi Budaya',
  description: 'Partisipasi melestarikan budaya Kalimantan Tengah dengan mengirimkan cerita rakyat daerah, informasi kesenian, adat istiadat, atau kosakata bahasa daerah Anda.',
};

export default function KontribusiPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12 pt-28">
      
      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Form & Info */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <span className="text-secondary font-extrabold tracking-widest text-3xs sm:text-2xs uppercase">
              ◆ RUANG PARTISIPASI ◆
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Kontribusi Budaya Masyarakat
            </h1>
            <p className="text-muted text-sm sm:text-base font-light leading-relaxed text-justify">
              Miliki peranan aktif dalam mendokumentasikan adat istiadat, cerita rakyat, bahasa, dan upacara adat di daerah Kalimantan Tengah agar tidak terkikis zaman.
            </p>
          </div>

          <div className="border-t border-card-border/40 pt-8 space-y-6">
            <div>
              <span className="text-primary font-bold text-3xs sm:text-2xs uppercase tracking-wider block mb-1">
                BAGIKAN WARISAN DAERAH
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                Kirimkan Dokumentasi Budaya Anda
              </h2>
              <p className="text-xs text-muted leading-relaxed font-light mt-1 text-justify">
                Tuliskan kisah-kisah lisan suku Dayak, kosa kata lokal, foto ornamen silsilah, atau rekaman musik adat. Setiap materi yang dikirimkan akan divalidasi oleh Dewan Adat sebelum diterbitkan secara resmi.
              </p>
            </div>

            {/* The contribution form component */}
            <ContributionForm />
          </div>
        </div>

        {/* Right Column: Tall Grandmother Photo (Figma Layout) */}
        <div className="lg:col-span-5 relative w-full aspect-[3/4] lg:aspect-[3/4.2] rounded-2xl overflow-hidden shadow-sm border border-card-border sticky top-28 hidden lg:block">
          <DynamicImage 
            src="/images/kontribusi-banner.jpg" 
            alt="Tetua Adat Dayak Kalimantan Tengah" 
            className="w-full h-full object-cover"
          />
        </div>

      </div>

    </div>
  );
}
