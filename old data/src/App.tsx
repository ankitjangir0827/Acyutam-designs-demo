"use client";

import {
  ArrowUpDown,
  Building2,
  CheckCircle2,
  Clock,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { AboutAchyutam } from "./components/AboutAchyutam";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminGateModal } from "./components/AdminGateModal";
import { Navbar } from "./components/Navbar";
import { Preloader } from "./components/Preloader";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectModal } from "./components/ProjectModal";
import { ToastContainer, type ToastMessage } from "./components/Toast";
import type { Project, ProjectStatus } from "./projects/types";
import { useAuth } from "./projects/useAuth";
import { useProjects } from "./projects/useProjects";

export default function App() {
  const projectsHook = useProjects();
  const authHook = useAuth();

  // Desktop Video Preloader state
  const [showPreloader, setShowPreloader] = useState<boolean>(true);

  // Active filters
  const [selectedStatus, setSelectedStatus] = useState<"all" | ProjectStatus>(
    "all",
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "area" | "title">(
    "newest",
  );
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);

  // Selected project for modal detail view
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Modals state
  const [isAdminGateOpen, setIsAdminGateOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] =
    useState<boolean>(false);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
    setSelectedCategory("all");
    setFeaturedOnly(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Check URL params on initial mount (e.g. ?project=proj-madhavkirti)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("project");
    if (projectId) {
      const match = projectsHook.projects.find((p) => p.id === projectId);
      if (match) {
        setSelectedProject(match);
      }
    }
  }, [projectsHook.projects]);

  // Filtered & sorted projects list
  const filteredProjects = useMemo(() => {
    return projectsHook.getFilteredProjects({
      searchQuery,
      status: selectedStatus,
      category: selectedCategory,
      sortBy,
      featuredOnly,
    });
  }, [
    projectsHook,
    searchQuery,
    selectedStatus,
    selectedCategory,
    sortBy,
    featuredOnly,
  ]);

  // Aggregate metrics
  const portfolioStats = useMemo(() => {
    const total = projectsHook.projects.length;
    const completed = projectsHook.projects.filter(
      (p) => p.status === "completed",
    ).length;
    const ongoing = projectsHook.projects.filter(
      (p) => p.status === "in_progress",
    ).length;
    const upcoming = projectsHook.projects.filter(
      (p) => p.status === "upcoming",
    ).length;
    return { total, completed, ongoing, upcoming };
  }, [projectsHook.projects]);

  // Categories list
  const categories = [
    { id: "all", label: "All Typologies" },
    { id: "Residential", label: "Residential Manors" },
    { id: "Commercial", label: "Commercial & Towers" },
    { id: "Industrial", label: "Industrial Plants" },
    { id: "Assembly & Heritage", label: "Sacred & Heritage" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0b10] text-[#e6e6f0] flex flex-col selection:bg-primary selection:text-black">
      {/* Desktop Video Preloader */}
      {showPreloader && (
        <Preloader
          onComplete={() => setShowPreloader(false)}
          brandName="ACHYUTAM BUILDER"
        />
      )}

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Top Navbar */}
      <Navbar
        auth={authHook}
        onOpenAdminGate={() => setIsAdminGateOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* HERO SPOTLIGHT HEADER */}
      <section className="relative pt-10 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="text-center space-y-5 max-w-4xl mx-auto">
          {/* Prominent Achyutam Builder Brand Crest */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-2">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                resetAllFilters();
              }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-primary/20 via-surface-container to-amber-500/20 border border-primary/40 text-white hover:border-primary transition-all shadow-[0_0_25px_rgba(255,119,34,0.2)] group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-primary/25 border-2 border-primary/60 ring-2 ring-primary/20 flex items-center justify-center p-1 overflow-hidden group-hover:scale-105 transition-transform">
                <img
                  src="/photos and videos/logo.png"
                  alt="Achyutam Logo"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/logo.png";
                  }}
                />
                <span className="font-serif font-bold text-lg text-primary">
                  अ
                </span>
              </div>
              <div className="text-left">
                <span className="font-serif font-bold text-sm sm:text-base tracking-wider text-white block group-hover:text-primary transition-colors">
                  ACHYUTAM BUILDER &amp; ARCHITECTS
                </span>
                <span className="font-mono text-[10px] text-amber-400/90 tracking-widest uppercase block">
                  Radha Kund • Mathura • Sikar • Beawar • Jaipur
                </span>
              </div>
            </a>
          </div>

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-mono text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Turnkey Engineering &amp; Architectural Mastery</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.15]">
            Architectural Rigor. <br />
            <span className="bg-gradient-to-r from-primary via-amber-400 to-amber-200 bg-clip-text text-transparent italic font-serif">
              Structural Permanence.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-on-surface-variant/90 max-w-2xl mx-auto font-sans leading-relaxed">
            Explore Achyutam Builder&apos;s signature residential estates, heavy
            industrial terminals, and sacred Vedic landmarks — fully compliant
            with Indian Standard structural codes.
          </p>

          {/* Portfolio Metric Ticker */}
          <div
            className={`pt-4 grid gap-3 sm:gap-4 max-w-3xl mx-auto font-mono text-left ${portfolioStats.upcoming > 0 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-3"}`}
          >
            <div className="p-3.5 rounded-xl bg-surface-container/80 border border-white/5 backdrop-blur-md">
              <span className="text-[10px] text-on-surface-variant/70 uppercase block">
                Total Portfolio
              </span>
              <span className="text-xl font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-4 h-4 text-primary" />{" "}
                {portfolioStats.total} Projects
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container/80 border border-emerald-500/20 backdrop-blur-md">
              <span className="text-[10px] text-emerald-400/80 uppercase block">
                Completed
              </span>
              <span className="text-xl font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-4 h-4" /> {portfolioStats.completed}{" "}
                Handed Over
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container/80 border border-amber-500/20 backdrop-blur-md">
              <span className="text-[10px] text-amber-400/80 uppercase block">
                Active Sites
              </span>
              <span className="text-xl font-bold text-amber-300 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4" /> {portfolioStats.ongoing} Ongoing
              </span>
            </div>

            {portfolioStats.upcoming > 0 && (
              <div className="p-3.5 rounded-xl bg-surface-container/80 border border-blue-500/20 backdrop-blur-md">
                <span className="text-[10px] text-blue-400/80 uppercase block">
                  Pipeline Concepts
                </span>
                <span className="text-xl font-bold text-blue-300 flex items-center gap-1.5 mt-0.5">
                  <Rocket className="w-4 h-4" /> {portfolioStats.upcoming}{" "}
                  Upcoming
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FILTER & SHOWCASE SECTION */}
      <section
        id="showcase"
        className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 space-y-8"
      >
        {/* Status Filter Tabs (Completed, In Progress, Upcoming) */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-[#12121a] border border-white/10 rounded-2xl shadow-xl backdrop-blur-md">
          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <button
              type="button"
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-2 rounded-xl transition-all font-semibold uppercase tracking-wider ${
                selectedStatus === "all"
                  ? "bg-primary text-background shadow-[0_0_15px_rgba(255,119,34,0.3)]"
                  : "text-on-surface-variant hover:text-white hover:bg-white/5"
              }`}
            >
              All Projects ({portfolioStats.total})
            </button>

            <button
              type="button"
              onClick={() => setSelectedStatus("completed")}
              className={`px-4 py-2 rounded-xl transition-all font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                selectedStatus === "completed"
                  ? "bg-emerald-500 text-background shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "text-on-surface-variant hover:text-emerald-400 hover:bg-white/5"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed (
              {portfolioStats.completed})
            </button>

            <button
              type="button"
              onClick={() => setSelectedStatus("in_progress")}
              className={`px-4 py-2 rounded-xl transition-all font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                selectedStatus === "in_progress"
                  ? "bg-amber-400 text-background shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  : "text-on-surface-variant hover:text-amber-300 hover:bg-white/5"
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> Ongoing Sites (
              {portfolioStats.ongoing})
            </button>

            {portfolioStats.upcoming > 0 && (
              <button
                type="button"
                onClick={() => setSelectedStatus("upcoming")}
                className={`px-4 py-2 rounded-xl transition-all font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                  selectedStatus === "upcoming"
                    ? "bg-blue-400 text-background shadow-[0_0_15px_rgba(96,165,250,0.3)]"
                    : "text-on-surface-variant hover:text-blue-300 hover:bg-white/5"
                }`}
              >
                <Rocket className="w-3.5 h-3.5" /> Upcoming Pipeline (
                {portfolioStats.upcoming})
              </button>
            )}
          </div>

          {/* Quick Featured & Sort controls */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`px-3 py-2 rounded-xl border transition-all flex items-center gap-1.5 uppercase ${
                featuredOnly
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                  : "bg-surface-container border-white/5 text-on-surface-variant hover:text-white"
              }`}
              title="Filter by featured landmarks"
            >
              <Star
                className={`w-3.5 h-3.5 ${featuredOnly ? "fill-current" : ""}`}
              />
              <span>Featured</span>
            </button>

            <div className="flex items-center gap-1 bg-surface-container border border-white/5 rounded-xl px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-on-surface-variant/60" />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "newest" | "oldest" | "title" | "area",
                  )
                }
                className="bg-transparent text-xs text-on-surface font-mono uppercase focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-[#16161f]">
                  Newest First
                </option>
                <option value="oldest" className="bg-[#16161f]">
                  Oldest First
                </option>
                <option value="area" className="bg-[#16161f]">
                  Built-Up Area
                </option>
                <option value="title" className="bg-[#16161f]">
                  Alphabetical
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Typology Category Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all shrink-0 border ${
                selectedCategory === cat.id
                  ? "bg-white/10 text-white border-primary/60 font-semibold shadow-inner"
                  : "bg-surface-container/60 border-white/5 text-on-surface-variant hover:text-white hover:border-white/20"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search / Filter Feedback Bar */}
        {(searchQuery ||
          selectedStatus !== "all" ||
          selectedCategory !== "all" ||
          featuredOnly) && (
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant px-2">
            <span>
              Showing{" "}
              <strong className="text-white">{filteredProjects.length}</strong>{" "}
              matching projects
              {searchQuery && ` for "${searchQuery}"`}
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedStatus("all");
                setSelectedCategory("all");
                setFeaturedOnly(false);
              }}
              className="text-primary hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* PROJECT CARD GRID */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-surface-container/30 border border-white/5 rounded-2xl p-8">
            <Building2 className="w-12 h-12 text-on-surface-variant/30 mx-auto" />
            <h3 className="font-serif text-xl text-white">
              No Matching Landmarks Found
            </h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto font-mono">
              Try adjusting your typology category or search keyword to discover
              more projects.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedStatus("all");
                setSelectedCategory("all");
                setFeaturedOnly(false);
              }}
              className="px-4 py-2 bg-primary text-background rounded-lg font-mono text-xs font-bold uppercase"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={(proj) => setSelectedProject(proj)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ABOUT ACHYUTAM BUILDER SECTION */}
      <AboutAchyutam
        onOpenEnquiry={() => {
          window.location.href = "enquire.html";
        }}
      />

      {/* FOOTER */}
      <footer className="mt-auto border-t border-white/10 bg-[#0a0a0e] text-on-surface-variant font-mono text-xs py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <a
            href="/"
            onClick={(e) => {
              if (
                window.location.pathname === "/" ||
                window.location.pathname === "/index.html"
              ) {
                e.preventDefault();
                resetAllFilters();
              }
            }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-serif font-bold text-base transition-transform group-hover:scale-105">
              अ
            </div>
            <div>
              <p className="text-white font-bold tracking-wider group-hover:text-primary transition-colors">
                ACHYUTAM BUILDER &amp; ARCHITECTS
              </p>
              <p className="text-[10px] text-on-surface-variant/60">
                Radha Kund • Mathura • Sikar • Beawar • Jaipur
              </p>
            </div>
          </a>

          <div className="flex flex-wrap items-center justify-center gap-6 uppercase tracking-wider text-[11px]">
            <a
              href="/"
              onClick={(e) => {
                if (
                  window.location.pathname === "/" ||
                  window.location.pathname === "/index.html"
                ) {
                  e.preventDefault();
                  resetAllFilters();
                }
              }}
              className="text-white font-semibold hover:text-primary transition-colors"
            >
              Showcase
            </a>
            <a
              href="enquire.html"
              className="hover:text-primary transition-colors"
            >
              Consultation &amp; Contact
            </a>
            <button
              type="button"
              onClick={() => {
                if (authHook.session.isAuthenticated) {
                  setIsAdminDashboardOpen(true);
                } else {
                  setIsAdminGateOpen(true);
                }
              }}
              className="text-primary hover:underline transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
            </button>
          </div>

          <div className="text-[10px] text-on-surface-variant/50 text-center md:text-right">
            © {new Date().getFullYear()} Achyutam Builder. All structural
            engineering rights reserved.
          </div>
        </div>
      </footer>

      {/* PROJECT DETAIL MODAL */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenEnquiry={(name) => {
          setSelectedProject(null);
          window.location.href = `enquire.html?project=${encodeURIComponent(name)}`;
        }}
      />

      {/* DUAL-LAYER ADMIN SECURITY GATE MODAL */}
      <AdminGateModal
        isOpen={isAdminGateOpen}
        auth={authHook}
        onClose={() => setIsAdminGateOpen(false)}
        onSuccess={() => {
          setIsAdminGateOpen(false);
          setIsAdminDashboardOpen(true);
          addToast({
            type: "success",
            title: "Admin Verification Passed",
            message: "Dual-layer Web Crypto authentication succeeded.",
          });
        }}
      />

      {/* ADMIN CONTROL CENTER / DASHBOARD */}
      {isAdminDashboardOpen && (
        <AdminDashboard
          projectsHook={projectsHook}
          authHook={authHook}
          onClose={() => setIsAdminDashboardOpen(false)}
          onAddToast={addToast}
        />
      )}
    </div>
  );
}
