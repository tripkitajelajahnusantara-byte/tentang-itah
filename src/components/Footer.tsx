import Link from 'next/link';
import { getContact } from '@/lib/db';

export default async function Footer() {
  let contact;
  try {
    contact = await getContact();
  } catch (error) {
    console.error('Failed to load contact in footer:', error);
    contact = {
      email: 'kontak@tentangitah.id',
      address: 'Jl. Tjilik Riwut KM 2.5, Kota Palangka Raya, Kalimantan Tengah 73111',
      phone: '+62 811-520-2026',
      about_us: 'Platform edukasi budaya independen yang dikembangkan oleh putra-putri daerah Kalimantan Tengah untuk melestarikan identitas lokal di era globalisasi.'
    };
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#120F0D] border-t border-card-border/10 text-white/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns: Simplified Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Left Column: Brand section (7 cols on desktop) */}
          <div className="md:col-span-7 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-wide text-secondary flex items-center gap-1.5">
              <svg className="w-6 h-6 fill-current text-secondary" viewBox="0 0 24 24">
                <path d="M12 2C10 6 7 9 4 10c0 4.5 1.5 8.5 8 12 6.5-3.5 8-7.5 8-12-3-1-6-4-8-8zM12 4.5c1.2 2.5 3.2 4.6 5.8 5.4-1.2 3-2.8 5.7-5.8 8.6-3-2.9-4.6-5.6-5.8-8.6 2.6-.8 4.6-2.9 5.8-5.4z"/>
              </svg>
              Tentang Itah
            </span>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-xl text-justify font-light">
              {contact.about_us || 'Platform edukasi budaya independen yang dikembangkan oleh putra-putri daerah Kalimantan Tengah untuk melestarikan identitas lokal di era globalisasi.'}
            </p>
          </div>

          {/* Right Column: Contact details directly (5 cols on desktop) */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="font-serif text-lg font-bold text-secondary">Hubungi Kami</h3>
            
            <ul className="space-y-3.5 text-xs sm:text-sm text-white/70 font-light">
              {contact.address && (
                <li className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-secondary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{contact.address}</span>
                </li>
              )}
              {contact.email && (
                <li className="flex items-center gap-2.5">
                  <svg className="w-5 h-5 text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${contact.email}`} className="hover:text-primary transition-all font-medium text-secondary">{contact.email}</a>
                </li>
              )}
              {contact.phone && (
                <li className="flex items-center gap-2.5">
                  <svg className="w-5 h-5 text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${contact.phone}`} className="hover:text-primary transition-all font-medium text-secondary">{contact.phone}</a>
                </li>
              )}
              {contact.instagram && (
                <li className="flex items-center gap-2.5">
                  <svg className="w-5 h-5 text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 12a4 4 0 11-8 0 4 4 0 018 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                  </svg>
                  <a href={`https://instagram.com/${contact.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all font-medium text-secondary">Instagram ({contact.instagram})</a>
                </li>
              )}
              {contact.facebook && (
                <li className="flex items-center gap-2.5">
                  <svg className="w-5 h-5 text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                  <span className="font-medium text-secondary">Facebook ({contact.facebook})</span>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-card-border/10 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-white/40">
          <p>© {currentYear} Tentang Itah. Dibuat dengan bangga untuk pelestarian budaya Kalimantan Tengah.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/admin/dashboard" className="hover:underline">Portal Admin</Link>
            <Link href="/tentang" className="hover:underline">Visi & Misi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
