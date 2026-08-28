'use client';

import { useState } from 'react';
import Image from 'next/image';

interface DynamicImageProps {
  src?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function DynamicImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false
}: DynamicImageProps) {
  const [error, setError] = useState(false);

  // Helper to determine if we should render an SVG illustration
  const isPlaceholder = !src || error;

  if (isPlaceholder) {
    // Generate specialized inline SVG illustrations based on the alt/src keywords
    const lowerAlt = alt.toLowerCase();
    const lowerSrc = src ? src.toLowerCase() : '';

    let svgContent = null;

    if (lowerSrc.includes('logo-kalteng') || lowerAlt.includes('logo-kalteng') || lowerAlt.includes('kalteng')) {
      // Logo Pemprov Kalimantan Tengah
      svgContent = (
        <svg className="w-full h-full text-secondary" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" fill="var(--secondary)" />
          <polygon points="50,15 80,75 20,75" fill="var(--primary)" opacity="0.8" />
          <circle cx="50" cy="50" r="15" fill="var(--accent)" />
          <path d="M45,50 L55,50 M50,45 L50,55" stroke="#FFF" strokeWidth="3" />
        </svg>
      );
    } else if (lowerSrc.includes('logo-itah') || lowerAlt.includes('logo-itah') || lowerAlt.includes('itah')) {
      // Logo Tentang Itah
      svgContent = (
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="20" fill="var(--card-bg)" stroke="var(--primary)" strokeWidth="4" />
          {/* Talawang shield shape */}
          <path d="M50,15 C60,35 65,50 65,65 C65,80 50,90 50,90 C50,90 35,80 35,65 C35,50 40,35 50,15 Z" fill="var(--accent)" />
          <path d="M50,15 C45,35 40,50 40,65 C40,80 50,90 50,90 Z" fill="var(--primary)" opacity="0.6" />
          <text x="50" y="58" textAnchor="middle" fill="#FFF" className="font-serif font-bold text-xl">I</text>
        </svg>
      );
    } else if (lowerSrc.includes('logo-tutwuri') || lowerAlt.includes('logo-tutwuri') || lowerAlt.includes('tutwuri') || lowerAlt.includes('pendidikan')) {
      // Logo Tut Wuri Handayani
      svgContent = (
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" fill="#1A365D" />
          <polygon points="50,18 78,42 68,78 32,78 22,42" fill="var(--primary)" />
          <circle cx="50" cy="45" r="10" fill="#FFF" />
          <path d="M38,65 Q50,55 62,65" stroke="#FFF" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    } else if (lowerSrc.includes('hero') || lowerAlt.includes('hero') || lowerAlt.includes('banner') || lowerAlt.includes('beranda')) {
      // Hero Banner: Forest + Sunset + Rivers
      svgContent = (
        <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
          <defs>
            <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1B3E2D" />
              <stop offset="50%" stopColor="#2E6443" />
              <stop offset="100%" stopColor="#B38642" />
            </linearGradient>
          </defs>
          <rect width="1200" height="600" fill="url(#heroGrad)" />
          {/* River lines */}
          <path d="M0,450 Q300,300 600,480 T1200,350 L1200,600 L0,600 Z" fill="#204030" opacity="0.8" />
          <path d="M0,500 Q400,400 700,530 T1200,450 L1200,600 L0,600 Z" fill="#173022" />
          {/* Batang Garing (Tree of life) outline */}
          <path d="M600,100 L600,500 M600,200 L500,180 M600,250 L700,230 M600,300 L450,270 M600,350 L750,320 M600,400 L400,370" stroke="var(--primary)" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
          <circle cx="600" cy="90" r="15" fill="var(--primary)" opacity="0.4" />
        </svg>
      );
    } else if (lowerAlt.includes('tari') || lowerAlt.includes('mandau') || lowerAlt.includes('bungai')) {
      // Dancer Silhouette
      svgContent = (
        <svg className="w-full h-full" viewBox="0 0 400 300">
          <rect width="400" height="300" fill="#261E1A" />
          {/* Background circle representing sun */}
          <circle cx="200" cy="130" r="80" fill="var(--primary)" opacity="0.25" />
          {/* Talawang shield on left */}
          <path d="M120,80 C128,100 130,120 130,140 C130,160 128,180 120,200 C120,200 110,185 110,140 C110,95 120,80 120,80 Z" fill="var(--accent)" opacity="0.8" />
          {/* Dancer figure */}
          <circle cx="200" cy="70" r="15" fill="var(--primary)" />
          <path d="M200,85 L200,170 M200,100 L140,110 M200,105 L260,85 M200,170 L170,240 M200,170 L230,240" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" />
          {/* Head feathers */}
          <path d="M200,55 L200,30 M195,57 L185,35 M205,57 L215,35" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    } else if (lowerAlt.includes('tiwah') || lowerAlt.includes('upacara') || lowerAlt.includes('tradisi')) {
      // Tiwah Sandung illustration
      svgContent = (
        <svg className="w-full h-full" viewBox="0 0 400 300">
          <rect width="400" height="300" fill="#1C2321" />
          <circle cx="200" cy="150" r="100" fill="var(--primary)" opacity="0.1" />
          {/* Sandung legs */}
          <rect x="185" y="150" width="10" height="110" fill="#6B4E3D" />
          <rect x="205" y="150" width="10" height="110" fill="#6B4E3D" />
          {/* Sandung body */}
          <rect x="160" y="80" width="80" height="70" rx="4" fill="var(--primary)" opacity="0.8" />
          <polygon points="150,85 200,40 250,85" fill="var(--accent)" />
          {/* Motif on Sandung body */}
          <path d="M190,115 C200,105 200,125 210,115" stroke="#FFF" strokeWidth="3" fill="none" />
        </svg>
      );
    } else if (lowerAlt.includes('tangkiling') || lowerAlt.includes('legenda') || lowerAlt.includes('danau') || lowerAlt.includes('cerita')) {
      // Folklore scene: hill / lake under moon
      svgContent = (
        <svg className="w-full h-full" viewBox="0 0 400 300">
          <rect width="400" height="300" fill="#0E121F" />
          <circle cx="300" cy="80" r="30" fill="#FFF" opacity="0.8" />
          {/* Hills */}
          <path d="M0,300 L0,210 Q100,130 200,190 T400,160 L400,300 Z" fill="#1B243B" />
          <path d="M0,300 L0,240 Q150,180 280,250 T400,210 L400,300 Z" fill="#111827" />
          {/* Water reflection */}
          <ellipse cx="200" cy="280" rx="100" ry="10" fill="#FFF" opacity="0.1" />
        </svg>
      );
    } else if (lowerAlt.includes('tentang') || lowerAlt.includes('about') || lowerAlt.includes('ilustrasi')) {
      // Huma Betang under starry night
      svgContent = (
        <svg className="w-full h-full" viewBox="0 0 600 400">
          <rect width="600" height="400" fill="#1C1816" />
          {/* Stars */}
          <circle cx="50" cy="60" r="1.5" fill="#FFF" opacity="0.8" />
          <circle cx="150" cy="80" r="1" fill="#FFF" opacity="0.5" />
          <circle cx="280" cy="40" r="2" fill="#FFF" opacity="0.9" />
          <circle cx="420" cy="110" r="1" fill="#FFF" opacity="0.4" />
          <circle cx="520" cy="70" r="1.5" fill="#FFF" opacity="0.7" />
          
          <circle cx="450" cy="120" r="80" fill="var(--primary)" opacity="0.1" />
          
          {/* Huma Betang longhouse silhouette */}
          <rect x="50" y="250" width="500" height="20" fill="#5C4033" />
          {/* Pillars */}
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={70 + i * 42} y="270" width="8" height="80" fill="#4A3329" />
          ))}
          {/* House body */}
          <rect x="60" y="160" width="480" height="90" fill="var(--primary)" opacity="0.7" />
          {/* Roof */}
          <polygon points="40,165 300,90 560,165" fill="var(--accent)" opacity="0.9" />
          {/* Ground */}
          <rect x="0" y="340" width="600" height="60" fill="#141110" />
        </svg>
      );
    } else {
      // Default geometric placeholder
      svgContent = (
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
          <defs>
            <linearGradient id="defGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--secondary)" opacity="0.2" />
              <stop offset="100%" stopColor="var(--primary)" opacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#defGrad)" />
          {/* Subtle Dayak motif cross */}
          <path d="M100,20 L100,180 M20,100 L180,100 M60,60 L140,140 M60,140 L140,60" stroke="var(--primary)" strokeWidth="2" strokeDasharray="4,4" opacity="0.4" />
          <circle cx="100" cy="100" r="20" stroke="var(--primary)" strokeWidth="2" fill="none" opacity="0.4" />
          <text x="100" y="105" textAnchor="middle" fill="var(--primary)" className="font-serif text-xs opacity-50">{alt}</text>
        </svg>
      );
    }

    return (
      <div className={`relative flex items-center justify-center overflow-hidden bg-card-border/20 rounded-lg ${className}`}>
        {svgContent}
      </div>
    );
  }

  // If real image, use Next.js Image component
  // Use a standard img tag or standard Image, but wrap in an error boundary/handler to set error state
  const imageWidth = width || 600;
  const imageHeight = height || 400;
  
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}
