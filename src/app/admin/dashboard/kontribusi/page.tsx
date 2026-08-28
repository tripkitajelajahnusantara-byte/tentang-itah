import { getContributionsAction } from '@/app/actions';
import AdminContributionManager from '@/components/AdminContributionManager';
import { Contribution } from '@/lib/db';

export const revalidate = 0; // Dynamic server check

export default async function AdminContributionsPage() {
  let contribs: Contribution[] = [];
  try {
    contribs = await getContributionsAction();
  } catch (error) {
    console.error('Failed to load contributions for admin:', error);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-foreground">Verifikasi Kontribusi Masyarakat</h1>
        <p className="text-xs text-muted">Tinjau kiriman cerita rakyat, seni, tradisi, dan informasi budaya dari masyarakat. Setujui untuk menerbitkan atau tolak kiriman.</p>
      </div>
      <AdminContributionManager initialContributions={contribs} />
    </div>
  );
}
