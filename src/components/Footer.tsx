import Link from 'next/link';
import { getContact } from '@/lib/db';

export default async function Footer() {
  let contact;
  try {
    contact = await getContact();
  } catch (error) {
    console.error('Failed to load contact in footer:', error);
    contact = {
      email: 'tentangitah@gmail.com',
      address: 'Jl. Tjilik Riwut KM 2.5, Kota Palangka Raya, Kalimantan Tengah 73111',
      phone: '+62 822-7459-5638',
      instagram: '@tentangitah',
      facebook: 'Tentang Itah',
      dekranasda_kalteng: '@dekranasdaprovkalteng',
      about_us: 'Platform edukasi budaya independen yang dikembangkan oleh putra-putri daerah Kalimantan Tengah untuk melestarikan identitas lokal di era globalisasi.'
    };
  }

  // Ensure contact has correct values in case some fields are missing from DB
  const email = contact.email || 'tentangitah@gmail.com';
  const instagram = contact.instagram || '@tentangitah';
  const facebook = contact.facebook || 'Tentang Itah';
  const phone = contact.phone || '+62 822-7459-5638';
  const dekranasda = contact.dekranasda_kalteng || '@dekranasdaprovkalteng';
  const address = contact.address || 'Jl. Tjilik Riwut KM 2.5, Kota Palangka Raya, Kalimantan Tengah 73111';

  // Format WA number for URL
  const cleanWaNumber = phone.replace(/\D/g, '');
  const waUrl = `https://wa.me/${cleanWaNumber.startsWith('0') ? '62' + cleanWaNumber.slice(1) : cleanWaNumber}`;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#120F0D] border-t border-card-border/10 text-white/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns: Simplified Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Left Column: Brand section (6 cols on desktop) */}
          <div className="md:col-span-6 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-wide text-secondary flex items-center gap-1.5">
              <svg className="w-6 h-6 fill-current text-secondary" viewBox="0 0 24 24">
                <path d="M12 2C10 6 7 9 4 10c0 4.5 1.5 8.5 8 12 6.5-3.5 8-7.5 8-12-3-1-6-4-8-8zM12 4.5c1.2 2.5 3.2 4.6 5.8 5.4-1.2 3-2.8 5.7-5.8 8.6-3-2.9-4.6-5.6-5.8-8.6 2.6-.8 4.6-2.9 5.8-5.4z"/>
              </svg>
              Tentang Itah
            </span>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-xl text-justify font-light font-sans">
              {contact.about_us || 'Platform edukasi budaya independen yang dikembangkan oleh putra-putri daerah Kalimantan Tengah untuk melestarikan identitas lokal di era globalisasi.'}
            </p>
          </div>

          {/* Right Column: Contact details directly (6 cols on desktop) */}
          <div className="md:col-span-6 space-y-4 md:pl-6">
            <h3 className="font-serif text-lg font-bold text-secondary">Hubungi Kami</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-white/70 font-light font-sans">
              {/* Left Column of contact details */}
              <div className="space-y-3">
                {email && (
                  <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${email}`} className="hover:text-primary transition-all font-medium text-secondary break-all">{email}</a>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-secondary shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.66.986 3.288 1.487 4.885 1.488 5.275 0 9.56-4.283 9.564-9.56.002-2.556-.994-4.959-2.805-6.77C16.429 2.498 14.032 1.5 11.48 1.5 6.204 1.5 1.92 5.78 1.916 11.057c-.001 1.692.457 3.327 1.33 4.773L2.2 20.394l4.447-1.24zm12.18-5.834c-.269-.134-1.594-.787-1.84-.875-.246-.089-.425-.134-.605.134-.18.269-.695.875-.853 1.053-.158.178-.316.2-.585.067-.27-.134-1.14-.419-2.17-1.34-.803-.715-1.345-1.6-1.503-1.869-.158-.269-.017-.415.118-.549.12-.12.27-.316.404-.473.134-.158.18-.269.269-.448.09-.179.045-.337-.022-.472-.068-.135-.605-1.458-.828-1.995-.219-.527-.459-.456-.63-.464-.162-.008-.347-.009-.533-.009-.186 0-.489.07-.745.347-.256.277-.98.957-.98 2.33 0 1.373 1 2.699 1.14 2.884.14.185 1.968 3.005 4.767 4.212.666.287 1.185.459 1.589.587.671.213 1.28.183 1.761.111.536-.08 1.594-.65 1.819-1.277.225-.627.225-1.164.158-1.277-.067-.113-.246-.179-.515-.313z"/></svg>
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all font-medium text-secondary">{phone}</a>
                  </div>
                )}
              </div>

              {/* Right Column of contact details (Social media with beautiful links) */}
              <div className="space-y-3 sm:pl-4">
                {instagram && (
                  <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-secondary shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    <a href={`https://instagram.com/${instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all font-medium text-secondary">Instagram ({instagram})</a>
                  </div>
                )}
                {facebook && (
                  <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-secondary shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all font-medium text-secondary">Facebook ({facebook})</a>
                  </div>
                )}
                {dekranasda && (
                  <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-secondary shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    <a href="https://www.instagram.com/dekranasdaprovkalteng/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all font-medium text-secondary">Dekranasda ({dekranasda})</a>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-card-border/10 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-white/40 font-sans">
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
