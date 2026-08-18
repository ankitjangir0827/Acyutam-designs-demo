"use client";

import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  MapPin,
  Share2,
  ShieldCheck,
  Sparkles,
  Video as VideoIcon,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { formatVideoEmbedUrl } from "../projects/mediaUtils";
import type { MediaItem, Project } from "../projects/types";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenEnquiry?: (projectName: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onOpenEnquiry,
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "engineering" | "tech" | "docs"
  >("overview");

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset active media index and tab when modal project changes
  useEffect(() => {
    setActiveMediaIndex(0);
    setActiveTab("overview");
  }, [project?.id]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  // Build complete media playlist (Cover + Gallery items)
  const allMedia: MediaItem[] = [
    {
      id: "cover",
      type: project.coverMedia?.type || "image",
      url:
        project.coverMedia?.url ||
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
      caption: project.coverMedia?.caption || `${project.title} Primary View`,
    },
    ...(project.galleryMedia || []),
  ];

  const currentMedia = allMedia[activeMediaIndex] || allMedia[0];
  const isVideo = currentMedia.type === "video";
  const embedInfo = isVideo ? formatVideoEmbedUrl(currentMedia.url) : null;

  const handleNextMedia = () => {
    setActiveMediaIndex((prev) => (prev + 1) % allMedia.length);
  };

  const handlePrevMedia = () => {
    setActiveMediaIndex(
      (prev) => (prev - 1 + allMedia.length) % allMedia.length,
    );
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?project=${project.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto backdrop-blur-2xl bg-black/85 animate-fadeIn">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-5xl bg-[#121217] border border-white/15 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#16161e]/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-primary/15 border border-primary/40 text-primary rounded-full text-xs font-mono font-bold uppercase tracking-wider">
              {project.category}
            </span>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider ${
                project.status === "completed"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : project.status === "in_progress"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              }`}
            >
              {project.status === "completed"
                ? "Completed"
                : project.status === "in_progress"
                  ? `In Progress (${project.progressPercent || 70}%)`
                  : "Upcoming Pipeline"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 rounded-lg bg-surface-container-high hover:bg-primary/20 text-on-surface-variant hover:text-primary transition-colors text-xs font-mono flex items-center gap-1.5"
              title="Copy shareable link"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {copied ? "Link Copied" : "Share"}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-surface-container-high hover:bg-red-500/20 text-on-surface-variant hover:text-red-400 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-5 md:p-8 space-y-6">
          {/* Main Media Showcase (Interactive Hero Video / Image Player) */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/95 border border-white/10 shadow-2xl group">
            {isVideo ? (
              embedInfo?.isEmbed ? (
                <iframe
                  src={embedInfo.embedUrl}
                  className="w-full h-full"
                  title={currentMedia.caption || project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={currentMedia.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                >
                  <track kind="captions" src="" label="English" />
                </video>
              )
            ) : (
              <img
                src={currentMedia.url}
                alt={currentMedia.caption || project.title}
                className="w-full h-full object-cover transition-all duration-500"
              />
            )}

            {/* Media Navigation Arrows */}
            {allMedia.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevMedia}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-primary text-white hover:text-background transition-all backdrop-blur-md opacity-80 group-hover:opacity-100 shadow-lg"
                  aria-label="Previous image/video"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMedia}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-primary text-white hover:text-background transition-all backdrop-blur-md opacity-80 group-hover:opacity-100 shadow-lg"
                  aria-label="Next image/video"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Media Caption & Index Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex items-center justify-between text-xs font-mono text-white/90">
              <span className="truncate max-w-[80%] font-medium">
                {currentMedia.caption ||
                  `${project.title} Asset ${activeMediaIndex + 1}`}
              </span>
              <span className="shrink-0 px-2 py-0.5 bg-black/60 rounded border border-white/10 text-primary">
                {activeMediaIndex + 1} / {allMedia.length}
              </span>
            </div>
          </div>

          {/* Media Thumbnails Reel */}
          {allMedia.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {allMedia.map((m, idx) => (
                <button
                  type="button"
                  key={m.id || m.url}
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    activeMediaIndex === idx
                      ? "border-primary scale-105 shadow-[0_0_15px_rgba(255,119,34,0.4)]"
                      : "border-white/10 opacity-60 hover:opacity-100"
                  }`}
                >
                  {m.type === "video" ? (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-primary">
                      <VideoIcon className="w-6 h-6" />
                    </div>
                  ) : (
                    <img
                      src={m.url}
                      alt={`Thumb ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <span className="absolute bottom-0.5 right-0.5 px-1 bg-black/80 rounded text-[9px] font-mono text-white">
                    {m.type === "video" ? "VID" : "IMG"}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Project Title & Tagline */}
          <div className="border-b border-white/10 pb-5">
            <h2 className="font-serif text-2xl md:text-3xl text-white font-normal mb-2 leading-tight">
              {project.title}
            </h2>
            <p className="text-sm md:text-base text-on-surface-variant/90 leading-relaxed">
              {project.tagline || project.detailedDescription}
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-surface-container/60 rounded-xl border border-white/5 font-mono text-xs">
            <div>
              <span className="text-on-surface-variant/60 block text-[10px] uppercase mb-0.5">
                Location
              </span>
              <span className="text-white font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">
                  {project.location || "Rajasthan"}
                </span>
              </span>
            </div>
            <div>
              <span className="text-on-surface-variant/60 block text-[10px] uppercase mb-0.5">
                Built-Up Area
              </span>
              <span className="text-white font-medium flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{project.area || "36,000 sq ft"}</span>
              </span>
            </div>
            <div>
              <span className="text-on-surface-variant/60 block text-[10px] uppercase mb-0.5">
                Client Verified
              </span>
              <span className="text-white font-medium truncate block">
                {project.clientName || "Private Client"}
              </span>
            </div>
            <div>
              <span className="text-on-surface-variant/60 block text-[10px] uppercase mb-0.5">
                Budget / Timeline
              </span>
              <span className="text-primary font-bold">
                {project.budget || "₹3.85 Cr"} ({project.year || "2026"})
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            {[
              { id: "overview", label: "Detailed Description", icon: FileText },
              {
                id: "engineering",
                label: "Structural Codes & Specs",
                icon: ShieldCheck,
              },
              { id: "tech", label: "Tech Stack & Innovations", icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "overview" | "engineering" | "tech")
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition-all ${
                    activeTab === tab.id
                      ? "bg-primary/20 text-primary border border-primary/40 font-bold"
                      : "text-on-surface-variant hover:text-white hover:bg-surface-container-high"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="min-h-[120px]">
            {activeTab === "overview" && (
              <div className="space-y-4">
                <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">
                  {project.detailedDescription}
                </p>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
                  <h4 className="text-xs font-mono text-primary uppercase font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Architectural Highlights &
                    Vernacular Value
                  </h4>
                  <ul className="text-xs text-on-surface-variant space-y-1 list-disc list-inside">
                    <li>
                      Engineered with seismic-damped reinforced concrete frames
                      complying with Bureau of Indian Standards.
                    </li>
                    <li>
                      Integrated solar orientation and thermal envelope drop
                      cooling energy requirements by ~35%.
                    </li>
                    <li>
                      Bespoke handcrafted finishes, premium Makrana marble, and
                      durable stone carvings.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "engineering" && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono text-primary uppercase font-bold">
                  Compliant Indian Standard Structural Codes & Audits
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    project.structuralStandards || [
                      "IS 456:2000 (Plain & Reinforced Concrete Code of Practice)",
                      "IS 1893:2016 (Criteria for Earthquake Resistant Design)",
                      "IS 875 Part 3:2015 (Design Wind Velocity & Pressure Loads)",
                      "NBC 2016 Part 4 (Fire and Life Safety Regulations)",
                    ]
                  ).map((code) => (
                    <div
                      key={code}
                      className="p-3 bg-surface-container border border-white/5 rounded-lg flex items-center gap-2.5 text-xs text-on-surface"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{code}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "tech" && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono text-primary uppercase font-bold">
                  BIM, Software & Engineering Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStackTags && project.techStackTags.length > 0 ? (
                    project.techStackTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-surface-container border border-primary/30 text-primary rounded-lg text-xs font-mono font-medium shadow"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-on-surface-variant">
                      No tech tags listed.
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Actions Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#16161e] flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" /> Live 3D Architectural View
              </a>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (onOpenEnquiry) {
                  onOpenEnquiry(project.title);
                } else {
                  window.location.href = `enquire.html?project=${encodeURIComponent(project.title)}`;
                }
              }}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-amber-500 hover:opacity-90 text-background font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-xl cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Book Turnkey Consultation →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
