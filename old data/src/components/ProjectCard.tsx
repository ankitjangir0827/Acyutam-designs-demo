"use client";

import { ArrowUpRight, Building2, Layers, MapPin, Star } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { formatVideoEmbedUrl } from "../projects/mediaUtils";
import type { Project } from "../projects/types";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const isVideo = project.coverMedia?.type === "video";
  const coverUrl =
    project.coverMedia?.url ||
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80";
  const embedInfo = isVideo ? formatVideoEmbedUrl(coverUrl) : null;

  // Status configuration
  const getStatusBadge = () => {
    switch (project.status) {
      case "completed":
        return {
          label: "Completed",
          className: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
          dotColor: "bg-emerald-400",
        };
      case "in_progress":
        return {
          label: `Ongoing (${project.progressPercent || 65}%)`,
          className: "bg-amber-500/15 border-amber-500/40 text-amber-300",
          dotColor: "bg-amber-400 animate-pulse",
        };
      case "upcoming":
        return {
          label: "Upcoming Concept",
          className: "bg-blue-500/15 border-blue-500/40 text-blue-300",
          dotColor: "bg-blue-400",
        };
      default:
        return {
          label: project.status,
          className: "bg-zinc-500/15 border-zinc-500/40 text-zinc-300",
          dotColor: "bg-zinc-400",
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div
      onClick={() => onSelect(project)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect(project);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-[#141419]/95 border border-white/15 hover:border-primary/80 rounded-xl overflow-hidden shadow-xl hover:shadow-[0_20px_40px_rgba(255,119,34,0.22)] transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5 ring-1 ring-white/5 hover:ring-primary/50"
    >
      {/* Top Media Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/80">
        {isVideo ? (
          embedInfo?.isEmbed ? (
            <div className="w-full h-full relative">
              <iframe
                src={embedInfo.embedUrl}
                className="w-full h-full pointer-events-none"
                title={project.title}
              />
              <div className="absolute inset-0 bg-transparent" />
            </div>
          ) : (
            <video
              src={coverUrl}
              muted
              loop
              playsInline
              autoPlay={isHovered}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            >
              <track kind="captions" src="" label="English" />
            </video>
          )
        ) : (
          <img
            src={coverUrl}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 group-hover:filter group-hover:contrast-105"
          />
        )}

        {/* Dark gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141419] via-transparent to-black/50 opacity-90 group-hover:opacity-75 transition-opacity" />

        {/* Featured Ribbon */}
        {project.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-500/90 to-primary/90 text-background font-mono text-[10px] font-extrabold uppercase rounded-full shadow-lg backdrop-blur-md z-10">
            <Star className="w-3 h-3 fill-current" />
            <span>Featured Landmark</span>
          </div>
        )}

        {/* Status Badge & Category pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-mono uppercase tracking-wider backdrop-blur-md ${statusBadge.className}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`}
            />
            {statusBadge.label}
          </span>

          <span className="px-2.5 py-0.5 rounded bg-black/60 border border-white/10 text-on-surface-variant font-mono text-[10px] tracking-widest uppercase backdrop-blur-md">
            {project.category}
          </span>
        </div>
      </div>

      {/* Progress Bar for Ongoing Projects */}
      {project.status === "in_progress" && (
        <div className="w-full bg-zinc-800 h-1 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-amber-400 transition-all duration-500"
            style={{ width: `${project.progressPercent || 60}%` }}
          />
        </div>
      )}

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Location & Year meta */}
          <div className="flex items-center justify-between text-xs text-on-surface-variant/70 font-mono mb-1.5">
            <span
              className="flex items-center gap-1 truncate max-w-[65%]"
              title={project.location}
            >
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">
                {project.location || "Rajasthan / Mathura"}
              </span>
            </span>
            <span>{project.year || "2026"}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg md:text-xl font-medium text-white group-hover:text-primary transition-colors line-clamp-1">
            {project.title}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-on-surface-variant/85 mt-1 line-clamp-2 leading-relaxed">
            {project.tagline || project.detailedDescription}
          </p>
        </div>

        {/* Specs Pill Matrix */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs font-mono text-on-surface-variant">
          <div className="flex items-center gap-1.5 truncate">
            <Building2 className="w-3.5 h-3.5 text-primary/70 shrink-0" />
            <span className="truncate">{project.area || "N/A sq ft"}</span>
          </div>
          {project.budget && (
            <div className="flex items-center gap-1.5 truncate justify-end text-primary font-bold">
              <span>{project.budget}</span>
            </div>
          )}
        </div>

        {/* Tech Stack Tags */}
        {project.techStackTags && project.techStackTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.techStackTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-white/5 border border-white/5 hover:border-primary/40 rounded text-[10px] font-mono text-on-surface-variant/90 transition-colors"
              >
                {tag}
              </span>
            ))}
            {project.techStackTags.length > 3 && (
              <span className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] font-mono text-primary/80">
                +{project.techStackTags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Hover Action Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono text-primary group-hover:text-primary transition-colors">
          <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold">
            <Layers className="w-3.5 h-3.5" />
            {project.galleryMedia?.length
              ? `${project.galleryMedia.length + 1} Media Files`
              : "1 Media File"}
          </span>
          <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold group-hover:translate-x-1 transition-transform">
            View Details <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};
