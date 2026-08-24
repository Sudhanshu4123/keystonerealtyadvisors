'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/types';
import GoogleMapPlaceholder from '@/components/GoogleMapPlaceholder';
import InquiryModal from '@/components/InquiryModal';
import {
  MapPin,
  Building2,
  Layers,
  Calendar,
  Building,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  MessageSquare,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Star,
  ShieldCheck,
  Sparkles,
  FileText,
  Download,
  Check,
} from 'lucide-react';

interface ProjectDetailsClientProps {
  project: Project;
}

export default function ProjectDetailsClient({ project }: ProjectDetailsClientProps) {
  const images =
    project.images && project.images.length > 0
      ? project.images
      : [
          {
            id: 'fallback',
            projectId: project.id,
            imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
            isPrimary: true,
          },
        ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const activeImage = images[activeImageIndex]?.imageUrl || images[0].imageUrl;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const whatsappUrl = `https://wa.me/919217668175?text=${encodeURIComponent(
    `Hello Keystone Real Estate Developments, I am inquiring about the project: "${project.name}" (ID: ${project.id}).`
  )}`;

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 bg-white">
      
      {/* Top Breadcrumb & Share */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-slate-900">Projects</Link>
          <span>/</span>
          <span className="text-blue-900 font-bold truncate max-w-xs">{project.name}</span>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5 text-amber-600" />
          <span>{copiedLink ? 'Link Copied!' : 'Share Project'}</span>
        </button>
      </div>

      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                project.status === 'Completed'
                  ? 'bg-emerald-600 text-white'
                  : project.status === 'Ongoing'
                  ? 'bg-blue-900 text-white'
                  : 'bg-amber-500 text-slate-950'
              }`}
            >
              {project.status} Project
            </span>
            <span className="bg-slate-100 text-slate-900 border border-slate-200 px-3 py-1 rounded-full text-xs font-extrabold">
              {project.type}
            </span>
            {project.featured && (
              <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Featured Project</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
            {project.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 flex items-center gap-1.5 font-bold">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{project.address}, {project.city}, {project.state} {project.pincode}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setInquiryModalOpen(true)}
            className="gold-btn px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg cursor-pointer"
          >
            Enquire Now
          </button>
        </div>
      </div>

      {/* IMAGE GALLERY */}
      <div className="space-y-4">
        <div className="relative h-[420px] sm:h-[540px] w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xl group">
          <img
            src={activeImage}
            alt={project.name}
            className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-102"
            onClick={() => setLightboxOpen(true)}
          />

          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md hover:bg-white text-slate-900 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Maximize2 className="w-4 h-4 text-amber-600" />
            <span>Fullscreen Photo Gallery ({images.length})</span>
          </button>
        </div>

        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-28 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-amber-500 scale-105 shadow-md'
                    : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-amber-400 p-2 rounded-full bg-slate-900 border border-slate-700 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
            className="absolute left-6 text-white hover:text-amber-400 p-3 rounded-full bg-slate-900 border border-slate-700 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <img
            src={images[activeImageIndex].imageUrl}
            alt=""
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />

          <button
            onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
            className="absolute right-6 text-white hover:text-amber-400 p-3 rounded-full bg-slate-900 border border-slate-700 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Col: Specs, About, Highlights, Amenities, Floor Plans, Brochure, Map */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* PROJECT OVERVIEW GRID */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              <span>Project Overview</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-800">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-1 shadow-xs">
                <span className="text-[10px] text-slate-500 font-extrabold uppercase block">Developer</span>
                <span className="text-xs font-bold text-slate-900 block truncate">{project.developer}</span>
              </div>

              {project.totalArea && (
                <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-1 shadow-xs">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase block">Total Area</span>
                  <span className="text-sm font-bold text-slate-900 block">{project.totalArea}</span>
                </div>
              )}

              {project.buildings && (
                <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-1 shadow-xs">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase block">Buildings</span>
                  <span className="text-sm font-bold text-slate-900 block">{project.buildings} Towers</span>
                </div>
              )}

              {project.floors && (
                <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-1 shadow-xs">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase block">Floors</span>
                  <span className="text-sm font-bold text-slate-900 block">{project.floors} Floors</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-medium pt-2">
              {project.units && (
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-500">Total Units:</span>
                  <span className="font-bold text-slate-900">{project.units} Units</span>
                </div>
              )}
              {project.completionDate && (
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-500">Completion:</span>
                  <span className="font-bold text-slate-900">{project.completionDate}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-amber-600">{project.status}</span>
              </div>
            </div>
          </div>

          {/* ABOUT THE PROJECT */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
              About The Project
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-normal">
              {project.description}
            </p>
          </div>

          {/* PROJECT HIGHLIGHTS */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-xl font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Project Highlights</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Prime Location Corridor</span>
                  <span className="text-slate-400">High-yield appreciation district with major transit arterial access.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Modern Architecture</span>
                  <span className="text-slate-400">Seismic-resistant structural frame with floor-to-ceiling glass facades.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">24/7 Gated Security</span>
                  <span className="text-slate-400">Smart CCTV surveillance, RFID vehicular access, and concierge.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Resort-Style Amenities</span>
                  <span className="text-slate-400">Infinity edge swimming pool, state-of-the-art gym, and grand clubhouse.</span>
                </div>
              </div>
            </div>
          </div>

          {/* AMENITIES */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-600" />
              <span>Project Amenities</span>
            </h2>

            {project.amenities && project.amenities.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {project.amenities.map((amenity: any, idx: number) => {
                  const name = typeof amenity === 'string' ? amenity : amenity.name;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800"
                    >
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{name}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Standard project amenities included.</p>
            )}
          </div>

          {/* FLOOR PLANS */}
          {project.floorPlans && project.floorPlans.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                <span>Project Floor Plans ({project.floorPlans.length})</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.floorPlans.map((fp) => (
                  <div key={fp.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="h-48 rounded-xl overflow-hidden bg-white border border-slate-200">
                      <img src={fp.fileUrl} alt={fp.title} className="w-full h-full object-contain p-2" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{fp.title}</h4>
                      {fp.description && <p className="text-xs text-slate-600 mt-1">{fp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECT BROCHURE DOWNLOAD */}
          {project.brochures && project.brochures.length > 0 && (
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1">
                <h3 className="text-lg font-black flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span>Download Project Brochure</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Get the official PDF brochure with complete floor plans, site master plan, and specifications.
                </p>
              </div>
              <a
                href={project.brochures[0].fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gold-btn px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Brochure</span>
              </a>
            </div>
          )}

          {/* GOOGLE MAPS LOCATION */}
          <GoogleMapPlaceholder
            location={project.area}
            address={project.address}
            city={project.city}
          />

        </div>

        {/* Right Col: Inquiry Widget */}
        <aside className="space-y-6 lg:sticky lg:top-28">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="space-y-1 text-center border-b border-slate-200 pb-4">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-600">No Sign-up Required</span>
              <h3 className="text-xl font-black text-slate-900">Project Enquiries</h3>
              <p className="text-xs text-slate-600">Connect directly with Keystone project development team.</p>
            </div>

            <div className="space-y-3">
              <a
                href="tel:+919217668175"
                className="w-full py-3.5 px-4 rounded-xl bg-white border border-slate-200 hover:border-blue-900 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group"
              >
                <PhoneCall className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                <span>Call Developer: +91 9217668175</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>WhatsApp Project Inquiry</span>
              </a>

              <button
                onClick={() => setInquiryModalOpen(true)}
                className="w-full gold-btn py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enquire Now Form</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-500 text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Official Keystone Project Office</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Direct developer inquiries. No agent fees.
              </p>
            </div>
          </div>
        </aside>

      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        projectId={project.id}
        projectName={project.name}
      />
    </div>
  );
}
