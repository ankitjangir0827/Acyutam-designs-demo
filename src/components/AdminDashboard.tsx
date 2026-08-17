"use client";

import {
  AlertTriangle,
  Building,
  CheckCircle,
  Copy,
  Download,
  Edit,
  FileCode,
  History,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Search,
  Shield,
  Star,
  Trash2,
  Upload,
  Video as VideoIcon,
  X,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import type {
  MediaItem,
  MediaType,
  Project,
  ProjectCategory,
  ProjectStatus,
} from "../projects/types";
import type { useAuth } from "../projects/useAuth";
import type { useProjects } from "../projects/useProjects";
import { MediaUploader } from "./MediaUploader";
import type { ToastMessage } from "./Toast";

interface AdminDashboardProps {
  projectsHook: ReturnType<typeof useProjects>;
  authHook: ReturnType<typeof useAuth>;
  onClose: () => void;
  onAddToast: (toast: Omit<ToastMessage, "id">) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projectsHook,
  authHook,
  onClose,
  onAddToast,
}) => {
  const {
    projects,
    activityLogs,
    addProject,
    updateProject,
    deleteProject,
    toggleFeatured,
    duplicateProject,
    resetToDefaultData,
    downloadProjectsJson,
    exportBackupJson,
    importProjectsJson,
  } = projectsHook;

  const { session, logout, updateSecurityCredentials } = authHook;

  // Active view tab in admin
  const [adminView, setAdminView] = useState<"projects" | "settings" | "logs">(
    "projects",
  );

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>(
    "all",
  );
  const [categoryFilter, setCategoryFilter] = useState<"all" | string>("all");

  // Modal for Add/Edit Project
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formTab, setFormTab] = useState<
    "basic" | "media" | "engineering" | "links"
  >("basic");

  // Form states
  const [formId, setFormId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formTagline, setFormTagline] = useState("");
  const [formCategory, setFormCategory] = useState<ProjectCategory | string>(
    "Residential",
  );
  const [formStatus, setFormStatus] = useState<ProjectStatus>("completed");
  const [formClient, setFormClient] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formArea, setFormArea] = useState("");
  const [formBudget, setFormBudget] = useState("");
  const [formYear, setFormYear] = useState("2026");
  const [formProgress, setFormProgress] = useState(100);
  const [formDescription, setFormDescription] = useState("");
  const [formTechTags, setFormTechTags] = useState("");
  const [formStandards, setFormStandards] = useState("");
  const [formLiveDemo, setFormLiveDemo] = useState("");
  const [formGithubRepo, setFormGithubRepo] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);

  const [formCoverMedia, setFormCoverMedia] = useState<{
    type: MediaType;
    url: string;
    caption?: string;
  }>({
    type: "image",
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
    caption: "Front Elevation",
  });

  const [formGalleryMedia, setFormGalleryMedia] = useState<MediaItem[]>([]);

  // Security Settings Form states
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPin, setNewPin] = useState("");
  const [securityMessage, setSecurityMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Import JSON Modal State
  const [importJsonText, setImportJsonText] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered project list for Admin Table
  const filteredList = useMemo(() => {
    return projects.filter((p) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchTitle = p.title?.toLowerCase().includes(q);
        const matchClient = p.clientName?.toLowerCase().includes(q);
        const matchLoc = p.location?.toLowerCase().includes(q);
        const matchTag = p.techStackTags?.some((t) =>
          t.toLowerCase().includes(q),
        );
        if (!matchTitle && !matchClient && !matchLoc && !matchTag) return false;
      }
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (categoryFilter !== "all" && p.category !== categoryFilter)
        return false;
      return true;
    });
  }, [projects, searchTerm, statusFilter, categoryFilter]);

  // Metric stats calculations
  const stats = useMemo(() => {
    const total = projects.length;
    const completed = projects.filter((p) => p.status === "completed").length;
    const inProgress = projects.filter(
      (p) => p.status === "in_progress",
    ).length;
    const upcoming = projects.filter((p) => p.status === "upcoming").length;
    const featured = projects.filter((p) => p.featured).length;

    let totalAreaSqFt = 0;
    let totalMediaAssets = 0;

    for (const p of projects) {
      const areaNum = Number.parseInt((p.area || "0").replace(/\D/g, "")) || 0;
      totalAreaSqFt += areaNum;
      totalMediaAssets += 1 + (p.galleryMedia?.length || 0);
    }

    return {
      total,
      completed,
      inProgress,
      upcoming,
      featured,
      totalAreaSqFt,
      totalMediaAssets,
    };
  }, [projects]);

  // Open Form for Adding New Project
  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormId(`proj-${Date.now().toString(36)}`);
    setFormTitle("");
    setFormTagline("");
    setFormCategory("Residential");
    setFormStatus("in_progress");
    setFormClient("");
    setFormLocation("Mathura, U.P.");
    setFormArea("6,500 sq ft");
    setFormBudget("₹1.20 Crore");
    setFormYear("2026");
    setFormProgress(60);
    setFormDescription(
      "Turnkey architectural construction project adhering to IS 456 standards and seismic parameters.",
    );
    setFormTechTags(
      "BIM 360, IS 456:2000, Vastu Alignment, Post-Tensioned Slabs",
    );
    setFormStandards("IS 456:2000, IS 1893:2016, NBC 2016 Part 4");
    setFormLiveDemo("");
    setFormGithubRepo("");
    setFormFeatured(false);
    setFormCoverMedia({
      type: "image",
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
      caption: "Main Architectural Facade",
    });
    setFormGalleryMedia([]);
    setFormTab("basic");
    setIsFormModalOpen(true);
  };

  // Open Form for Editing Existing Project
  const handleOpenEditModal = (proj: Project) => {
    setEditingProject(proj);
    setFormId(proj.id);
    setFormTitle(proj.title);
    setFormTagline(proj.tagline || "");
    setFormCategory(proj.category);
    setFormStatus(proj.status);
    setFormClient(proj.clientName || "");
    setFormLocation(proj.location || "");
    setFormArea(proj.area || "");
    setFormBudget(proj.budget || "");
    setFormYear(proj.year || "2026");
    setFormProgress(
      proj.progressPercent || (proj.status === "completed" ? 100 : 50),
    );
    setFormDescription(proj.detailedDescription || "");
    setFormTechTags(proj.techStackTags ? proj.techStackTags.join(", ") : "");
    setFormStandards(
      proj.structuralStandards ? proj.structuralStandards.join(", ") : "",
    );
    setFormLiveDemo(proj.liveDemoUrl || "");
    setFormGithubRepo(proj.githubRepoUrl || "");
    setFormFeatured(proj.featured || false);
    setFormCoverMedia(
      proj.coverMedia || {
        type: "image",
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
        caption: "Cover Image",
      },
    );
    setFormGalleryMedia(proj.galleryMedia || []);
    setFormTab("basic");
    setIsFormModalOpen(true);
  };

  // Submit Add or Edit Form
  const handleSaveProjectForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      onAddToast({
        type: "error",
        title: "Validation Error",
        message: "Project Title is required.",
      });
      return;
    }

    const techStackArray = formTechTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const standardsArray = formStandards
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const projectPayload: Omit<Project, "createdAt"> = {
      id: formId,
      title: formTitle.trim(),
      tagline: formTagline.trim(),
      category: formCategory,
      status: formStatus,
      clientName: formClient.trim(),
      location: formLocation.trim(),
      area: formArea.trim(),
      budget: formBudget.trim(),
      year: formYear.trim(),
      progressPercent:
        Number(formProgress) || (formStatus === "completed" ? 100 : 50),
      detailedDescription: formDescription.trim(),
      techStackTags: techStackArray,
      structuralStandards: standardsArray,
      liveDemoUrl: formLiveDemo.trim(),
      githubRepoUrl: formGithubRepo.trim(),
      featured: formFeatured,
      coverMedia: formCoverMedia,
      galleryMedia: formGalleryMedia,
    };

    if (editingProject) {
      updateProject(editingProject.id, projectPayload);
      onAddToast({
        type: "success",
        title: "Project Updated",
        message: `Successfully saved changes to "${formTitle}".`,
      });
    } else {
      addProject(projectPayload);
      onAddToast({
        type: "success",
        title: "Project Created",
        message: `Added new landmark "${formTitle}" to project portfolio.`,
      });
    }

    setIsFormModalOpen(false);
  };

  // Security Credentials Update
  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage(null);

    const res = await updateSecurityCredentials(
      newEmail.trim() || undefined,
      newPassword.trim() || undefined,
      newPin.trim() || undefined,
    );

    if (res.success) {
      setSecurityMessage({ type: "success", text: res.message });
      setNewPassword("");
      setNewPin("");
      onAddToast({
        type: "success",
        title: "Security Re-Hashed",
        message: res.message,
      });
    } else {
      setSecurityMessage({ type: "error", text: res.message });
      onAddToast({
        type: "error",
        title: "Security Update Failed",
        message: res.message,
      });
    }
  };

  // Import JSON Submission
  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const res = importProjectsJson(importJsonText);
    if (res.success) {
      onAddToast({
        type: "success",
        title: "Import Successful",
        message: res.message,
      });
      setIsImportModalOpen(false);
      setImportJsonText("");
    } else {
      onAddToast({
        type: "error",
        title: "Import Error",
        message: res.message,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0d0d12] text-on-surface overflow-hidden animate-fadeIn">
      {/* Top Admin Header Bar */}
      <header className="px-6 py-4 border-b border-white/10 bg-[#13131a]/95 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20 border border-primary/40 text-primary shadow-[0_0_15px_rgba(255,119,34,0.3)]">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-base md:text-lg font-bold text-white uppercase tracking-wider">
                Achyutam Admin Control Center
              </h1>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-[10px] font-mono uppercase">
                Auth Level 2: Active
              </span>
            </div>
            <p className="text-xs font-mono text-on-surface-variant/70">
              Logged in as:{" "}
              <span className="text-white font-medium">
                {session.authenticatedEmail || "admin@achyutam.com"}
              </span>
            </p>
          </div>
        </div>

        {/* Top Action Tabs & Close/Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex bg-surface-container rounded-lg p-1 border border-white/10 font-mono text-xs">
            <button
              type="button"
              onClick={() => setAdminView("projects")}
              className={`px-3 py-1.5 rounded-md uppercase tracking-wider transition-all ${
                adminView === "projects"
                  ? "bg-primary text-background font-bold shadow"
                  : "text-on-surface-variant hover:text-white"
              }`}
            >
              Projects ({projects.length})
            </button>
            <button
              type="button"
              onClick={() => setAdminView("settings")}
              className={`px-3 py-1.5 rounded-md uppercase tracking-wider transition-all ${
                adminView === "settings"
                  ? "bg-primary text-background font-bold shadow"
                  : "text-on-surface-variant hover:text-white"
              }`}
            >
              Security Settings
            </button>
            <button
              type="button"
              onClick={() => setAdminView("logs")}
              className={`px-3 py-1.5 rounded-md uppercase tracking-wider transition-all ${
                adminView === "logs"
                  ? "bg-primary text-background font-bold shadow"
                  : "text-on-surface-variant hover:text-white"
              }`}
            >
              Audit Logs ({activityLogs.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              onClose();
              onAddToast({
                type: "info",
                title: "Logged Out",
                message: "Admin session closed securely.",
              });
            }}
            className="p-2.5 rounded-lg bg-red-900/30 hover:bg-red-900/60 text-red-300 transition-colors border border-red-500/30 text-xs font-mono flex items-center gap-1.5"
            title="Log Out & Lock Portal"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Lock &amp; Exit</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {/* VIEW 1: PROJECTS MANAGER */}
        {adminView === "projects" && (
          <>
            {/* STATS OVERVIEW CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 font-mono">
              <div className="p-4 rounded-xl bg-surface-container border border-white/10 flex flex-col justify-between">
                <span className="text-[10px] uppercase text-on-surface-variant/70">
                  Total Projects
                </span>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.total}
                </p>
                <span className="text-[10px] text-primary mt-1">
                  Single Source Store
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-emerald-500/30 flex flex-col justify-between">
                <span className="text-[10px] uppercase text-emerald-400/80">
                  Completed
                </span>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {stats.completed}
                </p>
                <span className="text-[10px] text-on-surface-variant/60 mt-1">
                  Delivered &amp; Handed
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-amber-500/30 flex flex-col justify-between">
                <span className="text-[10px] uppercase text-amber-400/80">
                  In Progress
                </span>
                <p className="text-2xl font-bold text-amber-300 mt-1">
                  {stats.inProgress}
                </p>
                <span className="text-[10px] text-on-surface-variant/60 mt-1">
                  Active Site Works
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-blue-500/30 flex flex-col justify-between">
                <span className="text-[10px] uppercase text-blue-400/80">
                  Upcoming
                </span>
                <p className="text-2xl font-bold text-blue-300 mt-1">
                  {stats.upcoming}
                </p>
                <span className="text-[10px] text-on-surface-variant/60 mt-1">
                  Pipeline Concepts
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-primary/40 flex flex-col justify-between">
                <span className="text-[10px] uppercase text-primary/80">
                  Featured Pinned
                </span>
                <p className="text-2xl font-bold text-primary mt-1">
                  {stats.featured}
                </p>
                <span className="text-[10px] text-on-surface-variant/60 mt-1">
                  Spotlight Landmarks
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-white/10 flex flex-col justify-between">
                <span className="text-[10px] uppercase text-on-surface-variant/70">
                  Media Assets
                </span>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.totalMediaAssets}
                </p>
                <span className="text-[10px] text-on-surface-variant/60 mt-1">
                  Photos &amp; Video Demos
                </span>
              </div>
            </div>

            {/* ACTION TOOLBAR & SYNC CONTROLS */}
            <div className="p-4 bg-surface-container-low border border-white/10 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-md">
              {/* Search & Filters */}
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, location, client, or tech stack..."
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as "all" | ProjectStatus)
                  }
                  className="bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-xs text-white font-mono uppercase focus:border-primary focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="upcoming">Upcoming</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-xs text-white font-mono uppercase focus:border-primary focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Assembly & Heritage">
                    Assembly &amp; Heritage
                  </option>
                  <option value="Infrastructure">Infrastructure</option>
                </select>
              </div>

              {/* Sync Tools & Add Button */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Download Updated projectsData.json tool */}
                <button
                  type="button"
                  onClick={downloadProjectsJson}
                  className="px-3 py-2 bg-primary/20 hover:bg-primary text-primary hover:text-background border border-primary/50 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow"
                  title="Download exact projectsData.json to place in /src/projects/projectsData.json"
                >
                  <Download className="w-4 h-4" /> Download projectsData.json
                </button>

                <button
                  type="button"
                  onClick={exportBackupJson}
                  className="px-3 py-2 bg-surface-container hover:bg-white/10 text-on-surface border border-white/10 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5"
                  title="Export full timestamped JSON backup"
                >
                  <FileCode className="w-4 h-4 text-amber-400" /> Export Backup
                </button>

                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-3 py-2 bg-surface-container hover:bg-white/10 text-on-surface border border-white/10 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5"
                  title="Import projects from JSON string or backup"
                >
                  <Upload className="w-4 h-4 text-blue-400" /> Import JSON
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Reset all projects to factory static seed data in projectsData.json?",
                      )
                    ) {
                      resetToDefaultData();
                      onAddToast({
                        type: "info",
                        title: "Database Reset",
                        message: "Project store restored to factory seed.",
                      });
                    }
                  }}
                  className="p-2 bg-surface-container hover:bg-red-900/30 text-on-surface-variant hover:text-red-400 border border-white/10 rounded-lg text-xs transition-colors"
                  title="Reset to Factory Seed Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-amber-500 hover:opacity-90 text-background rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add New Project
                </button>
              </div>
            </div>

            {/* PROJECTS DATA TABLE */}
            <div className="bg-surface-container border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#181822] text-on-surface-variant uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-3.5 px-4">Media</th>
                      <th className="py-3.5 px-4">
                        Project Title &amp; Client
                      </th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Status &amp; Progress</th>
                      <th className="py-3.5 px-4">Built-Up Area</th>
                      <th className="py-3.5 px-4 text-center">Featured</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredList.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-12 text-center text-on-surface-variant/40"
                        >
                          No matching projects found. Click &quot;Add New
                          Project&quot; to create one.
                        </td>
                      </tr>
                    ) : (
                      filteredList.map((p) => {
                        const isVideo = p.coverMedia?.type === "video";
                        return (
                          <tr
                            key={p.id}
                            className="hover:bg-white/[0.03] transition-colors"
                          >
                            {/* Media thumbnail */}
                            <td className="py-3 px-4">
                              <div className="w-14 h-10 rounded bg-black/60 overflow-hidden relative border border-white/10">
                                {isVideo ? (
                                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-primary">
                                    <VideoIcon className="w-4 h-4" />
                                  </div>
                                ) : (
                                  <img
                                    src={
                                      p.coverMedia?.url ||
                                      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80"
                                    }
                                    alt={p.title}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                                {p.galleryMedia?.length > 0 && (
                                  <span className="absolute bottom-0.5 right-0.5 bg-black/80 px-1 text-[8px] text-white rounded">
                                    +{p.galleryMedia.length}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Title & Client */}
                            <td className="py-3 px-4 max-w-xs">
                              <div
                                className="font-serif font-medium text-sm text-white truncate"
                                title={p.title}
                              >
                                {p.title}
                              </div>
                              <div className="text-[11px] text-on-surface-variant/70 truncate">
                                {p.clientName} • {p.location}
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-1 bg-surface-container-high border border-white/10 rounded text-[10px] uppercase text-on-surface-variant">
                                {p.category}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase ${
                                    p.status === "completed"
                                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                      : p.status === "in_progress"
                                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  }`}
                                >
                                  {p.status === "completed"
                                    ? "Completed"
                                    : p.status === "in_progress"
                                      ? `Ongoing (${p.progressPercent || 70}%)`
                                      : "Upcoming"}
                                </span>
                              </div>
                            </td>

                            {/* Area */}
                            <td className="py-3 px-4 text-on-surface-variant font-mono">
                              <div>{p.area || "N/A"}</div>
                              {p.budget && (
                                <div className="text-[10px] text-primary">
                                  {p.budget}
                                </div>
                              )}
                            </td>

                            {/* Featured toggle */}
                            <td className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => toggleFeatured(p.id)}
                                className={`p-1.5 rounded-lg transition-all ${
                                  p.featured
                                    ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                                    : "text-on-surface-variant/40 hover:text-amber-400 hover:bg-white/5"
                                }`}
                                title={
                                  p.featured
                                    ? "Unpin from Featured"
                                    : "Pin to Featured"
                                }
                              >
                                <Star
                                  className={`w-4 h-4 ${p.featured ? "fill-current" : ""}`}
                                />
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => duplicateProject(p.id)}
                                  className="p-1.5 rounded bg-surface-container-high hover:bg-white/10 text-on-surface-variant hover:text-white transition-colors"
                                  title="Duplicate Project"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(p)}
                                  className="p-1.5 rounded bg-primary/15 hover:bg-primary text-primary hover:text-background transition-colors"
                                  title="Edit Project"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(p.id)}
                                  className="p-1.5 rounded bg-red-900/30 hover:bg-red-900/60 text-red-300 transition-colors"
                                  title="Delete Project"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: SECURITY & PASSKEY SETTINGS */}
        {adminView === "settings" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="p-6 bg-surface-container border border-white/10 rounded-2xl shadow-xl space-y-6">
              <div className="border-b border-white/10 pb-4 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-mono text-base font-bold text-white uppercase">
                    Admin Security &amp; Passkey Manager
                  </h3>
                  <p className="text-xs text-on-surface-variant/70">
                    Update Email, Password, and Master PIN with client-side
                    SHA-256 Web Crypto
                  </p>
                </div>
              </div>

              {securityMessage && (
                <div
                  className={`p-4 rounded-xl text-xs font-mono flex items-center gap-2.5 ${
                    securityMessage.type === "success"
                      ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-200"
                      : "bg-red-950/60 border border-red-500/40 text-red-200"
                  }`}
                >
                  {securityMessage.type === "success" ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  )}
                  <span>{securityMessage.text}</span>
                </div>
              )}

              <form
                onSubmit={handleSaveSecurity}
                className="space-y-4 font-mono text-xs"
              >
                <div className="space-y-1.5">
                  <label
                    htmlFor="admin-setting-email"
                    className="block text-on-surface-variant uppercase"
                  >
                    Current Admin Email
                  </label>
                  <input
                    id="admin-setting-email"
                    type="email"
                    value={newEmail}
                    placeholder={
                      session.authenticatedEmail || "admin@achyutam.com"
                    }
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/40 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:outline-none"
                  />
                  <p className="text-[10px] text-on-surface-variant/60">
                    Leave empty to keep existing email
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="admin-setting-password"
                    className="block text-on-surface-variant uppercase"
                  >
                    New Password (Min 8 characters)
                  </label>
                  <input
                    id="admin-setting-password"
                    type="password"
                    value={newPassword}
                    placeholder="Enter new password to re-hash"
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/40 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="admin-setting-pin"
                    className="block text-on-surface-variant uppercase"
                  >
                    New Master Security PIN (4-8 Digits)
                  </label>
                  <input
                    id="admin-setting-pin"
                    type="password"
                    maxLength={8}
                    value={newPin}
                    placeholder="Enter new numerical passkey"
                    onChange={(e) =>
                      setNewPin(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full bg-surface-container-high border border-outline-variant/40 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-white/5 rounded-lg text-[11px] text-on-surface-variant space-y-1">
                  <p className="text-primary font-bold">
                    🔒 Security Protocols In Effect:
                  </p>
                  <p>
                    • Web Crypto API calculates SHA-256 hash locally in browser
                    memory.
                  </p>
                  <p>
                    • Session auto-locks after 15 minutes of inactivity or upon
                    tab close.
                  </p>
                  <p>
                    • Automatic 30-second rate-limit cooldown after 5 failed
                    attempts.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-primary to-amber-500 hover:opacity-90 text-background font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save &amp; Re-Hash Credentials
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW 3: AUDIT LOGS */}
        {adminView === "logs" && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="p-4 bg-surface-container border border-white/10 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono">
                <History className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-white uppercase text-sm">
                  System Audit &amp; Activity Trail
                </h3>
              </div>
              <span className="text-xs font-mono text-on-surface-variant">
                Total Log Entries: {activityLogs.length}
              </span>
            </div>

            <div className="bg-surface-container border border-white/10 rounded-xl divide-y divide-white/5 overflow-hidden">
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 flex items-start justify-between gap-4 text-xs font-mono"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.action === "CREATE"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : log.action === "UPDATE"
                              ? "bg-amber-500/20 text-amber-300"
                              : log.action === "DELETE"
                                ? "bg-red-500/20 text-red-300"
                                : log.action === "EXPORT"
                                  ? "bg-blue-500/20 text-blue-300"
                                  : "bg-zinc-500/20 text-zinc-300"
                        }`}
                      >
                        {log.action}
                      </span>
                      {log.projectTitle && (
                        <span className="text-white font-medium">
                          {log.projectTitle}
                        </span>
                      )}
                    </div>
                    {log.details && (
                      <p className="text-on-surface-variant/80">
                        {log.details}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-on-surface-variant/50 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()} •{" "}
                    {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FULL ADD / EDIT PROJECT MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-2xl bg-black/85 animate-fadeIn">
          <div
            className="relative w-full max-w-4xl bg-[#13131a] border border-white/15 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-[#191924] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-mono">
                <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
                  {editingProject ? (
                    <Edit className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-white uppercase">
                  {editingProject
                    ? `Edit Landmark: ${editingProject.title}`
                    : "Create New Architectural Project"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-lg bg-surface-container hover:bg-white/10 text-on-surface-variant hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tab Navigator */}
            <div className="grid grid-cols-4 border-b border-white/10 bg-surface-container-lowest font-mono text-xs">
              {[
                { id: "basic", label: "1. Basic Info" },
                {
                  id: "media",
                  label: `2. Media (${formGalleryMedia.length + 1})`,
                },
                { id: "engineering", label: "3. Engineering & Tags" },
                { id: "links", label: "4. Links & Status" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setFormTab(
                      tab.id as "basic" | "media" | "engineering" | "links",
                    )
                  }
                  className={`py-3 text-center uppercase tracking-wider transition-all border-b-2 ${
                    formTab === tab.id
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-transparent text-on-surface-variant hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Form Body */}
            <form
              onSubmit={handleSaveProjectForm}
              className="overflow-y-auto flex-1 p-6 space-y-5"
            >
              {/* TAB 1: BASIC INFO */}
              {formTab === "basic" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="sm:col-span-2 space-y-1">
                    <label
                      htmlFor="form-title"
                      className="block text-on-surface-variant uppercase font-semibold"
                    >
                      Project Title *
                    </label>
                    <input
                      id="form-title"
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Dr. Madhavkirti Prabhuji Spiritual Estate"
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label
                      htmlFor="form-tagline"
                      className="block text-on-surface-variant uppercase font-semibold"
                    >
                      Tagline / Subheading
                    </label>
                    <input
                      id="form-tagline"
                      type="text"
                      value={formTagline}
                      onChange={(e) => setFormTagline(e.target.value)}
                      placeholder="e.g. Grand G+2 Sacred Courtyard Manor with Makrana Marble"
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="form-category"
                      className="block text-on-surface-variant uppercase font-semibold"
                    >
                      Typology Category
                    </label>
                    <select
                      id="form-category"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Assembly & Heritage">
                        Assembly &amp; Heritage
                      </option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Interior & Luxury">
                        Interior &amp; Luxury
                      </option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="form-status"
                      className="block text-on-surface-variant uppercase font-semibold"
                    >
                      Status Stage
                    </label>
                    <select
                      id="form-status"
                      value={formStatus}
                      onChange={(e) =>
                        setFormStatus(e.target.value as ProjectStatus)
                      }
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                    >
                      <option value="completed">
                        Completed (100% Handed Over)
                      </option>
                      <option value="in_progress">
                        In Progress (Active Site Works)
                      </option>
                      <option value="upcoming">
                        Upcoming / Concept Pipeline
                      </option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="form-client"
                      className="block text-on-surface-variant uppercase font-semibold"
                    >
                      Client Name
                    </label>
                    <input
                      id="form-client"
                      type="text"
                      value={formClient}
                      onChange={(e) => setFormClient(e.target.value)}
                      placeholder="e.g. Narottam Ji Jangir"
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="form-location"
                      className="block text-on-surface-variant uppercase font-semibold"
                    >
                      Location
                    </label>
                    <input
                      id="form-location"
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Radha Kund, Mathura, U.P."
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="form-area"
                      className="block text-on-surface-variant uppercase font-semibold"
                    >
                      Built-Up Area
                    </label>
                    <input
                      id="form-area"
                      type="text"
                      value={formArea}
                      onChange={(e) => setFormArea(e.target.value)}
                      placeholder="e.g. 36,000 sq ft"
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="form-budget"
                      className="block text-on-surface-variant uppercase font-semibold"
                    >
                      Budget / CTC
                    </label>
                    <input
                      id="form-budget"
                      type="text"
                      value={formBudget}
                      onChange={(e) => setFormBudget(e.target.value)}
                      placeholder="e.g. ₹3.85 Crore"
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA UPLOADER & MULTI-PHOTO/VIDEO */}
              {formTab === "media" && (
                <MediaUploader
                  coverMedia={formCoverMedia}
                  galleryMedia={formGalleryMedia}
                  onChangeCover={setFormCoverMedia}
                  onChangeGallery={setFormGalleryMedia}
                />
              )}

              {/* TAB 3: ENGINEERING & TECH STACK */}
              {formTab === "engineering" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="space-y-1">
                    <label
                      htmlFor="form-description"
                      className="block text-on-surface-variant uppercase font-semibold"
                    >
                      Detailed Description
                    </label>
                    <textarea
                      id="form-description"
                      rows={4}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Comprehensive architectural narrative, structural foundation choices, material finishes, and execution milestones..."
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none leading-relaxed font-sans text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="form-techtags"
                      className="block text-on-surface-variant uppercase font-semibold"
                    >
                      Tech Stack Tags (Comma separated)
                    </label>
                    <input
                      id="form-techtags"
                      type="text"
                      value={formTechTags}
                      onChange={(e) => setFormTechTags(e.target.value)}
                      placeholder="BIM 360, IS 456:2000, Post-Tensioned Slabs, Vastu Shastra, Green Concrete"
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="form-standards"
                      className="block text-on-surface-variant uppercase font-semibold"
                    >
                      Structural IS Codes &amp; Standards (Comma separated)
                    </label>
                    <input
                      id="form-standards"
                      type="text"
                      value={formStandards}
                      onChange={(e) => setFormStandards(e.target.value)}
                      placeholder="IS 456:2000, IS 1893:2016, IS 875 Part 3, NBC 2016 Part 4"
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                    />
                  </div>

                  {formStatus === "in_progress" && (
                    <div className="space-y-1 p-3 bg-surface-container-high rounded-lg border border-white/5">
                      <div className="flex justify-between">
                        <label
                          htmlFor="form-progress"
                          className="text-on-surface-variant uppercase font-semibold"
                        >
                          Execution Progress: {formProgress}%
                        </label>
                        <span className="text-primary font-bold">
                          {formProgress}% Complete
                        </span>
                      </div>
                      <input
                        id="form-progress"
                        type="range"
                        min={0}
                        max={100}
                        value={formProgress}
                        onChange={(e) =>
                          setFormProgress(Number(e.target.value))
                        }
                        className="w-full accent-primary"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: LINKS & ACTIONS */}
              {formTab === "links" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="space-y-1">
                    <label
                      htmlFor="form-livedemo"
                      className="block text-on-surface-variant uppercase font-semibold"
                    >
                      Virtual 3D Tour / Live Feed URL
                    </label>
                    <input
                      id="form-livedemo"
                      type="url"
                      value={formLiveDemo}
                      onChange={(e) => setFormLiveDemo(e.target.value)}
                      placeholder="https://achyutam.com/virtual-tour/... or Matterport URL"
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="form-githubrepo"
                      className="block text-on-surface-variant uppercase font-semibold"
                    >
                      Blueprints / CAD Vault Repo Link
                    </label>
                    <input
                      id="form-githubrepo"
                      type="url"
                      value={formGithubRepo}
                      onChange={(e) => setFormGithubRepo(e.target.value)}
                      placeholder="https://github.com/achyutam/blueprints-..."
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2.5 p-3 bg-surface-container rounded-lg border border-white/10 cursor-pointer hover:border-primary/40">
                      <input
                        type="checkbox"
                        checked={formFeatured}
                        onChange={(e) => setFormFeatured(e.target.checked)}
                        className="w-4 h-4 accent-primary rounded"
                      />
                      <div>
                        <span className="font-bold text-white block">
                          Pin as Featured Landmark
                        </span>
                        <span className="text-[10px] text-on-surface-variant/70">
                          Highlights this project with golden badge on public
                          showcase &amp; home portfolio
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs font-mono text-on-surface-variant/60">
                  ID: <span className="text-white">{formId}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-surface-container hover:bg-white/10 text-on-surface font-mono text-xs uppercase"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-primary to-amber-500 hover:opacity-90 text-background font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
                  >
                    <Save className="w-4 h-4" /> Save Project
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT JSON MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-2xl bg-black/85 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#13131a] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-mono text-sm font-bold text-white uppercase flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-400" /> Import Projects
                JSON
              </h3>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="text-on-surface-variant hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Paste JSON content (array of projects or backup payload) to
              import:
            </p>

            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="[{ &quot;title&quot;: &quot;...&quot;, &quot;category&quot;: &quot;Residential&quot; }]"
              className="w-full bg-surface-container font-mono text-xs border border-outline-variant/40 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-xs font-mono text-on-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportSubmit}
                disabled={!importJsonText.trim()}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-background text-xs font-mono font-bold uppercase disabled:opacity-40"
              >
                Import Projects
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-2xl bg-black/85 animate-fadeIn">
          <div className="relative w-full max-w-sm bg-[#1a1414] border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <h4 className="font-mono text-sm font-bold text-white uppercase">
              Confirm Project Deletion
            </h4>
            <p className="text-xs text-on-surface-variant/80">
              Are you sure you want to permanently delete this project? This
              will remove all associated media references.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-surface-container rounded-lg text-xs font-mono text-on-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProject(deleteConfirmId);
                  setDeleteConfirmId(null);
                  onAddToast({
                    type: "info",
                    title: "Deleted",
                    message: "Project removed from database.",
                  });
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono font-bold uppercase"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
