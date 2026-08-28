'use client';

import { useState } from 'react';
import { Contribution } from '@/lib/db';
import { verifyContributionAction, deleteContributionAction } from '@/app/actions';

interface AdminContributionManagerProps {
  initialContributions: Contribution[];
}

export default function AdminContributionManager({
  initialContributions
}: AdminContributionManagerProps) {
  const [contribs, setContribs] = useState<Contribution[]>(initialContributions);
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedItem, setSelectedItem] = useState<Contribution | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleVerify = async (id: string, status: 'approved' | 'rejected') => {
    setIsSubmitting(id);
    setError('');
    
    try {
      const updated = await verifyContributionAction(id, status);
      setContribs(contribs.map(c => c.id === id ? updated : c));
      showSuccess(`Kontribusi berhasil ${status === 'approved' ? 'disetujui (diterbitkan)' : 'ditolak'}`);
      
      // Update selected item preview if open
      if (selectedItem?.id === id) {
        setSelectedItem(updated);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mengubah status kontribusi');
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data kontribusi ini?')) return;
    setIsSubmitting(id);
    setError('');
    
    try {
      const ok = await deleteContributionAction(id);
      if (ok) {
        setContribs(contribs.filter(c => c.id !== id));
        showSuccess('Kontribusi berhasil dihapus');
        if (selectedItem?.id === id) {
          setSelectedItem(null);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus data');
    } finally {
      setIsSubmitting(null);
    }
  };

  // Filter contributions
  const filteredContribs = activeFilter === 'all'
    ? contribs
    : contribs.filter(c => c.status === activeFilter);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* List Column */}
      <div className="lg:col-span-7 bg-card-bg border border-card-border/60 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          <div className="p-4 border-b border-card-border/40 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <span className="font-bold text-sm text-foreground">Daftar Kontribusi Masyarakat</span>
            
            {/* Filter buttons */}
            <div className="flex gap-1.5">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-2 py-1 rounded text-3xs font-bold uppercase transition-all ${
                    activeFilter === filter
                      ? 'bg-primary text-white'
                      : 'bg-background text-foreground/80 border border-card-border hover:border-primary hover:text-primary'
                  }`}
                >
                  {filter === 'all' ? 'Semua' : filter}
                </button>
              ))}
            </div>
          </div>

          {success && (
            <div className="bg-secondary/10 border-l-4 border-secondary p-3 rounded-r-lg text-xs text-secondary font-semibold animate-pulse m-4">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-accent/10 border-l-4 border-accent p-3 rounded-r-lg text-xs text-accent font-semibold m-4">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-muted">
              <thead className="bg-background text-foreground/80 uppercase text-3xs font-bold border-b border-card-border">
                <tr>
                  <th className="px-4 py-3">Pengirim</th>
                  <th className="px-4 py-3">Judul</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border/40">
                {filteredContribs.map((c) => (
                  <tr 
                    key={c.id} 
                    onClick={() => setSelectedItem(c)}
                    className={`cursor-pointer transition-colors ${
                      selectedItem?.id === c.id ? 'bg-primary/10' : 'hover:bg-primary/5'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-semibold text-foreground block">{c.sender_name}</span>
                      <span className="text-3xs font-light text-muted">{c.sender_email}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground max-w-[130px] truncate">{c.title}</td>
                    <td className="px-4 py-3">{c.category}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-3xs font-bold uppercase ${
                        c.status === 'approved' 
                          ? 'bg-secondary/10 text-secondary' 
                          : c.status === 'rejected' 
                            ? 'bg-accent/10 text-accent' 
                            : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      {c.status === 'pending' && (
                        <>
                          <button
                            disabled={isSubmitting !== null}
                            onClick={() => handleVerify(c.id, 'approved')}
                            className="px-2 py-1 rounded bg-secondary text-white hover:bg-secondary-hover transition-all font-semibold text-3xs disabled:opacity-50"
                            title="Setujui dan Publikasikan"
                          >
                            Approve
                          </button>
                          <button
                            disabled={isSubmitting !== null}
                            onClick={() => handleVerify(c.id, 'rejected')}
                            className="px-2 py-1 rounded bg-accent text-white hover:bg-accent-hover transition-all font-semibold text-3xs disabled:opacity-50"
                            title="Tolak"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        disabled={isSubmitting !== null}
                        onClick={() => handleDelete(c.id)}
                        className="px-2 py-1 rounded border border-card-border hover:bg-accent/15 hover:text-accent hover:border-accent text-muted font-semibold text-3xs disabled:opacity-50"
                        title="Hapus"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredContribs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted">Tidak ada kiriman kontribusi ditemukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Preview Column */}
      <div className="lg:col-span-5">
        {selectedItem ? (
          <div className="bg-card-bg border border-card-border/60 rounded-2xl overflow-hidden shadow-sm space-y-4">
            
            {/* Header info */}
            <div className="p-6 border-b border-card-border/40 space-y-2">
              <div className="flex justify-between items-center">
                <span className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary text-3xs font-semibold uppercase">
                  {selectedItem.category}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-3xs font-bold uppercase ${
                  selectedItem.status === 'approved' 
                    ? 'bg-secondary/10 text-secondary' 
                    : selectedItem.status === 'rejected' 
                      ? 'bg-accent/10 text-accent' 
                      : 'bg-amber-500/10 text-amber-600'
                }`}>
                  {selectedItem.status}
                </span>
              </div>
              <h2 className="font-serif text-xl font-bold text-foreground leading-snug">{selectedItem.title}</h2>
              <div className="text-3xs text-muted">
                Oleh: <span className="font-semibold text-foreground/80">{selectedItem.sender_name}</span> ({selectedItem.sender_email})
              </div>
            </div>

            {/* Description detail */}
            <div className="px-6 pb-6 space-y-4">
              {selectedItem.image_url && (
                <div className="w-full aspect-[16/10] border border-card-border/40 rounded-xl overflow-hidden shadow-sm">
                  <img src={selectedItem.image_url} alt="Attached Preview" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="space-y-1.5">
                <span className="text-3xs font-bold text-muted uppercase tracking-wider block">Isi Kontribusi:</span>
                <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line text-justify font-sans bg-background/50 border border-card-border/40 p-4 rounded-xl max-h-64 overflow-y-auto">
                  {selectedItem.description}
                </p>
              </div>

              {/* Action shortcuts inside preview */}
              {selectedItem.status === 'pending' && (
                <div className="flex gap-2 pt-2 border-t border-card-border/40">
                  <button
                    disabled={isSubmitting !== null}
                    onClick={() => handleVerify(selectedItem.id, 'approved')}
                    className="flex-1 py-2 rounded-lg bg-secondary hover:bg-secondary-hover text-white text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    Setujui & Publikasikan
                  </button>
                  <button
                    disabled={isSubmitting !== null}
                    onClick={() => handleVerify(selectedItem.id, 'rejected')}
                    className="flex-1 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    Tolak Kontribusi
                  </button>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="bg-card-bg border border-card-border/60 rounded-2xl p-8 text-center text-muted">
            Pilih baris kontribusi masyarakat di tabel sebelah kiri untuk melihat pratinjau isi berkas detail di sini.
          </div>
        )}
      </div>

    </div>
  );
}
