import { getRegions, Region } from '@/lib/db';
import AdminRegionManager from '@/components/AdminRegionManager';

export const revalidate = 0; // Dynamic server check

export default async function AdminRegionsPage() {
  let regions: Region[] = [];
  try {
    regions = await getRegions();
  } catch (error) {
    console.error('Failed to load regions for admin:', error);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-foreground">Kelola Jelajah Daerah</h1>
        <p className="text-xs text-muted">Sunting deskripsi kebudayaan, potensi kerajinan, dan foto cagar alam untuk 13 kabupaten dan 1 kota di Kalimantan Tengah.</p>
      </div>
      <AdminRegionManager initialRegions={regions} />
    </div>
  );
}
