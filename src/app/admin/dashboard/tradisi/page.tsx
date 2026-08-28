import { getTraditions, Tradition } from '@/lib/db';
import AdminTraditionsManager from '@/components/AdminTraditionsManager';

export const revalidate = 0; // Dynamic server check

export default async function AdminTraditionsPage() {
  let traditions: Tradition[] = [];
  try {
    traditions = await getTraditions();
  } catch (error) {
    console.error('Failed to load traditions for admin:', error);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-foreground">Kelola Tradisi Adat</h1>
        <p className="text-xs text-muted">Sunting upacara ritual kematian Tiwah, olahraga menyipet, and adat istiadat leluhur Kalimantan Tengah.</p>
      </div>
      <AdminTraditionsManager initialTraditions={traditions} />
    </div>
  );
}
