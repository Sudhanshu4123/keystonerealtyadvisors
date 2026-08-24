'use client';

import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface GoogleMapProps {
  location: string;
  address?: string;
  city?: string;
}

export default function GoogleMapPlaceholder({ location, address, city }: GoogleMapProps) {
  const query = encodeURIComponent(`${address || ''} ${location} ${city || ''}`);
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${query}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  const externalMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm space-y-3">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-600" />
          <h4 className="text-sm font-bold text-slate-900">Project Location Map</h4>
        </div>
        <a
          href={externalMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-900 hover:text-blue-700 font-bold flex items-center gap-1 transition-colors"
        >
          <span>Open Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="relative w-full h-80 bg-slate-100">
        <iframe
          title="Project Google Map Location"
          src={mapsEmbedUrl}
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
        />
      </div>

      <div className="px-4 pb-4 pt-1 flex items-center justify-between text-xs text-slate-600 font-medium">
        <div className="flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-amber-600" />
          <span>{address || `${location}, ${city}`}</span>
        </div>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
          Google Maps Architecture Ready
        </span>
      </div>
    </div>
  );
}
