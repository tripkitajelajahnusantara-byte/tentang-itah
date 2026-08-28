'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Region } from '@/lib/db';
import DynamicImage from '@/components/DynamicImage';

interface RegionExplorerProps {
  regions: Region[];
}

export default function RegionExplorer({ regions }: RegionExplorerProps) {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('palangkaraya');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];

  const filteredRegions = regions.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stylized schematic geographic layout positions for SVG representation
  // Coordinates map out Central Kalimantan's districts relative to each other
  const mapNodes = [
    { id: 'murungraya', name: 'Murung Raya', cx: 280, cy: 50, r: 35, fill: '#8B5CF6' },
    { id: 'baritoutara', name: 'Barito Utara', cx: 360, cy: 110, r: 30, fill: '#EC4899' },
    { id: 'baritoselatan', name: 'Barito Selatan', cx: 350, cy: 180, r: 28, fill: '#3B82F6' },
    { id: 'baritotimur', name: 'Barito Timur', cx: 410, cy: 220, r: 25, fill: '#EF4444' },
    { id: 'gunungmas', name: 'Gunung Mas', cx: 240, cy: 120, r: 28, fill: '#F59E0B' },
    { id: 'palangkaraya', name: 'Kota Palangka Raya', cx: 260, cy: 190, r: 22, fill: '#10B981' },
    { id: 'pulangpisau', name: 'Pulang Pisau', cx: 280, cy: 260, r: 26, fill: '#14B8A6' },
    { id: 'kapuas', name: 'Kapuas', cx: 310, cy: 220, r: 30, fill: '#6366F1' },
    { id: 'katingan', name: 'Katingan', cx: 180, cy: 170, r: 35, fill: '#84CC16' },
    { id: 'kotawaringintimur', name: 'Kotawaringin Timur', cx: 120, cy: 190, r: 32, fill: '#A855F7' },
    { id: 'seruyan', name: 'Seruyan', cx: 80, cy: 230, r: 30, fill: '#06B6D4' },
    { id: 'kotawaringinbarat', name: 'Kotawaringin Barat', cx: 60, cy: 160, r: 28, fill: '#F97316' },
    { id: 'lamandau', name: 'Lamandau', cx: 40, cy: 100, r: 26, fill: '#F43F5E' },
    { id: 'sukamara', name: 'Sukamara', cx: 25, cy: 180, r: 22, fill: '#0EA5E9' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: Map & Selector */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Interactive SVG Schematic Map */}
        <div className="bg-card-bg border border-card-border/60 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col items-center">
          <span className="text-3xs font-semibold text-primary uppercase tracking-wider mb-4">PETA INTERAKTIF KABUPATEN / KOTA KALTENG</span>
          
          <div className="w-full aspect-[4/3] max-w-[500px] relative overflow-hidden bg-[#FAF6EE] dark:bg-zinc-950/20 rounded-xl border border-card-border/30">
            <svg className="w-full h-full" viewBox="0 0 460 330">
              {/* Province Background Fill & Boundary Outline (Shape of Central Kalimantan) */}
              <path 
                d="M 15 220 L 25 140 L 45 80 L 100 40 L 200 20 L 280 30 L 360 60 L 440 100 L 440 230 C 370 260 310 290 250 290 C 180 290 120 280 15 220 Z" 
                fill="var(--primary)" 
                fillOpacity="0.03" 
                stroke="var(--card-border)" 
                strokeWidth="2" 
                strokeLinejoin="round"
              />

              {/* Southern Coastline (Java Sea Boundary) */}
              <path 
                d="M 15 220 C 120 280 180 290 250 290 C 310 290 370 260 440 230" 
                fill="none" 
                stroke="var(--secondary)" 
                strokeWidth="1.5" 
                opacity="0.5"
              />

              {/* Major River Basins (Kalimantan's Lifeblood) */}
              {/* 1. Sungai Barito (East) */}
              <path d="M 300 40 Q 340 100 350 180 T 310 270" fill="none" stroke="#7DD3FC" strokeWidth="1.5" strokeDasharray="1,2" opacity="0.6" />
              <text x="330" y="295" fill="var(--primary)" fontSize="6" fontWeight="bold" opacity="0.5" className="select-none">S. Barito</text>

              {/* 2. Sungai Kahayan (Center-East) */}
              <path d="M 240 110 Q 250 180 260 210 T 270 285" fill="none" stroke="#7DD3FC" strokeWidth="1.5" strokeDasharray="1,2" opacity="0.6" />
              <text x="280" y="305" fill="var(--primary)" fontSize="6" fontWeight="bold" opacity="0.5" className="select-none">S. Kahayan</text>

              {/* 3. Sungai Katingan (Center-West) */}
              <path d="M 180 160 Q 185 210 190 240 T 195 285" fill="none" stroke="#7DD3FC" strokeWidth="1.5" strokeDasharray="1,2" opacity="0.6" />
              <text x="180" y="305" fill="var(--primary)" fontSize="6" fontWeight="bold" opacity="0.5" className="select-none">S. Katingan</text>

              {/* 4. Sungai Mentaya (West-Center) */}
              <path d="M 120 180 Q 125 210 120 240 T 120 280" fill="none" stroke="#7DD3FC" strokeWidth="1.5" strokeDasharray="1,2" opacity="0.6" />
              <text x="110" y="295" fill="var(--primary)" fontSize="6" fontWeight="bold" opacity="0.5" className="select-none">S. Mentaya</text>

              {/* 5. Sungai Seruyan (West) */}
              <path d="M 80 200 Q 80 230 85 250 T 80 278" fill="none" stroke="#7DD3FC" strokeWidth="1.5" strokeDasharray="1,2" opacity="0.6" />
              <text x="65" y="295" fill="var(--primary)" fontSize="6" fontWeight="bold" opacity="0.5" className="select-none">S. Seruyan</text>
              
              {/* Connection roads (Stylized subtle lines linking district capitals) */}
              <line x1="280" y1="50" x2="360" y2="110" stroke="var(--primary)" strokeWidth="0.75" strokeDasharray="2,3" opacity="0.3" />
              <line x1="360" y1="110" x2="350" y2="180" stroke="var(--primary)" strokeWidth="0.75" strokeDasharray="2,3" opacity="0.3" />
              <line x1="350" y1="180" x2="410" y2="220" stroke="var(--primary)" strokeWidth="0.75" strokeDasharray="2,3" opacity="0.3" />
              <line x1="240" y1="120" x2="260" y2="190" stroke="var(--primary)" strokeWidth="0.75" strokeDasharray="2,3" opacity="0.3" />
              <line x1="260" y1="190" x2="280" y2="260" stroke="var(--primary)" strokeWidth="0.75" strokeDasharray="2,3" opacity="0.3" />
              <line x1="260" y1="190" x2="310" y2="220" stroke="var(--primary)" strokeWidth="0.75" strokeDasharray="2,3" opacity="0.3" />
              <line x1="180" y1="170" x2="260" y2="190" stroke="var(--primary)" strokeWidth="0.75" strokeDasharray="2,3" opacity="0.3" />
              <line x1="120" y1="190" x2="180" y2="170" stroke="var(--primary)" strokeWidth="0.75" strokeDasharray="2,3" opacity="0.3" />
              <line x1="120" y1="190" x2="80" y2="230" stroke="var(--primary)" strokeWidth="0.75" strokeDasharray="2,3" opacity="0.3" />
              <line x1="60" y1="160" x2="120" y2="190" stroke="var(--primary)" strokeWidth="0.75" strokeDasharray="2,3" opacity="0.3" />
              <line x1="40" y1="100" x2="60" y2="160" stroke="var(--primary)" strokeWidth="0.75" strokeDasharray="2,3" opacity="0.3" />
              <line x1="25" y1="180" x2="60" y2="160" stroke="var(--primary)" strokeWidth="0.75" strokeDasharray="2,3" opacity="0.3" />

              {/* Map Nodes */}
              {mapNodes.map((node) => {
                const isSelected = selectedRegionId === node.id;
                return (
                  <g 
                    key={node.id} 
                    className="cursor-pointer group"
                    onClick={() => setSelectedRegionId(node.id)}
                  >
                    {/* Ring for selection */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={node.r + 5} 
                      fill="none" 
                      stroke="var(--primary)" 
                      strokeWidth={isSelected ? "2" : "0"} 
                      className="transition-all duration-300"
                    />
                    {/* Node body */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={node.r} 
                      fill={node.fill} 
                      opacity={isSelected ? "1" : "0.7"} 
                      className="transition-all duration-300 group-hover:opacity-100 shadow-md"
                    />
                    {/* Node Text Label */}
                    <text 
                      x={node.cx} 
                      y={node.cy + 4} 
                      textAnchor="middle" 
                      fill="#FFF" 
                      fontSize="9" 
                      fontWeight="600" 
                      className="pointer-events-none drop-shadow-sm select-none"
                    >
                      {node.name.replace('Kabupaten ', '').replace('Kota ', '').substring(0, 7)}..
                    </text>
                    
                    {/* Tooltip on hover */}
                    <title>{node.name}</title>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="text-3xs text-muted text-center mt-3">
            *Peta di atas merupakan representasi skematis hubungan geografis kabupaten/kota di Kalimantan Tengah. Klik bulatan daerah untuk detailnya.
          </p>
        </div>

        {/* Region Search & List Selection */}
        <div className="bg-card-bg border border-card-border/60 rounded-2xl p-6 shadow-sm space-y-4">
          <input
            type="text"
            placeholder="Cari kabupaten atau kota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-card-border/80 bg-background text-foreground placeholder-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
          />
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
            {filteredRegions.map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegionId(reg.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  selectedRegionId === reg.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-background text-foreground/80 border border-card-border hover:border-primary hover:text-primary'
                }`}
              >
                {reg.name}
              </button>
            ))}
            {filteredRegions.length === 0 && (
              <p className="text-xs text-muted text-center py-4 w-full">Daerah tidak ditemukan.</p>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Selected Region Details */}
      <div className="lg:col-span-5">
        {selectedRegion ? (
          <div className="bg-card-bg border border-card-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            {/* Region Photo */}
            <div className="w-full aspect-[16/10] relative">
              <DynamicImage 
                src={selectedRegion.image_url} 
                alt={selectedRegion.name} 
                className="w-full h-full rounded-none"
              />
            </div>
            
            {/* Region Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <span className="inline-flex px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-3xs font-semibold uppercase tracking-wider">
                  {selectedRegion.location_info}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  {selectedRegion.name}
                </h2>
              </div>
              
              <div className="w-12 h-0.5 bg-primary rounded-full" />
              
              <p className="text-sm sm:text-base text-muted leading-relaxed whitespace-pre-line">
                {selectedRegion.description}
              </p>

              {/* Special Contextual info callout */}
              <div className="bg-secondary/5 border-l-2 border-secondary p-4 rounded-r-xl space-y-2">
                <h4 className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Informasi Budaya Terkait
                </h4>
                <p className="text-xs text-muted leading-relaxed">
                  Gunakan halaman <Link href="/seni-budaya" className="text-primary hover:underline font-semibold">Seni & Budaya</Link>, <Link href="/tradisi" className="text-primary hover:underline font-semibold">Tradisi</Link>, atau <Link href="/cerita-rakyat" className="text-primary hover:underline font-semibold">Cerita Rakyat</Link> untuk melihat ragam kebudayaan detail yang bersumber dari daerah <strong>{selectedRegion.name}</strong> ini.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card-bg border border-card-border/60 rounded-2xl p-8 text-center text-muted">
            Pilih daerah untuk melihat detail budaya.
          </div>
        )}
      </div>
    </div>
  );
}
