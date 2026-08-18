import { useCallback, useEffect, useState } from "react";
import { ACTIVITY_LOGS_KEY } from "./cryptoUtils";
import initialProjectsData from "./projectsData.json";
import type { ActivityLog, Project, ProjectFilterOptions } from "./types";

const STORAGE_KEY = "achyutam_projects_store_v5";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn(
          "Failed to load projects from localStorage, fallback to seed data:",
          e,
        );
      }
    }
    return initialProjectsData as Project[];
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(ACTIVITY_LOGS_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.warn("Failed to load activity logs:", e);
      }
    }
    return [
      {
        id: "log-init",
        action: "LOGIN",
        timestamp: new Date().toISOString(),
        details:
          "System initialized with single source of truth projectsData.json",
      },
    ];
  });

  // Sync projects to localStorage on any state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error("Error persisting projects to localStorage:", e);
    }
  }, [projects]);

  // Sync activity logs
  useEffect(() => {
    try {
      localStorage.setItem(
        ACTIVITY_LOGS_KEY,
        JSON.stringify(activityLogs.slice(0, 100)),
      ); // keep latest 100
    } catch (e) {
      console.error("Error persisting activity logs:", e);
    }
  }, [activityLogs]);

  const addLog = useCallback(
    (
      action: ActivityLog["action"],
      details?: string,
      projectTitle?: string,
      projectId?: string,
    ) => {
      const newLog: ActivityLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        action,
        timestamp: new Date().toISOString(),
        details,
        projectTitle,
        projectId,
      };
      setActivityLogs((prev) => [newLog, ...prev]);
    },
    [],
  );

  // CRUD Actions
  const addProject = useCallback(
    (newProj: Omit<Project, "id" | "createdAt"> & { id?: string }) => {
      const id =
        newProj.id?.trim() ||
        `proj-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const created: Project = {
        ...newProj,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProjects((prev) => [created, ...prev]);
      addLog(
        "CREATE",
        `Added new project "${created.title}" [${created.category}]`,
        created.title,
        created.id,
      );
      return created;
    },
    [addLog],
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<Project>) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            const updated = {
              ...p,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
            addLog(
              "UPDATE",
              `Updated project "${updated.title}"`,
              updated.title,
              updated.id,
            );
            return updated;
          }
          return p;
        }),
      );
    },
    [addLog],
  );

  const deleteProject = useCallback(
    (id: string) => {
      setProjects((prev) => {
        const target = prev.find((p) => p.id === id);
        if (target) {
          addLog(
            "DELETE",
            `Deleted project "${target.title}"`,
            target.title,
            target.id,
          );
        }
        return prev.filter((p) => p.id !== id);
      });
    },
    [addLog],
  );

  const toggleFeatured = useCallback(
    (id: string) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            const updated = {
              ...p,
              featured: !p.featured,
              updatedAt: new Date().toISOString(),
            };
            addLog(
              "UPDATE",
              `${updated.featured ? "Pinned to Featured" : "Unpinned from Featured"}: "${updated.title}"`,
              updated.title,
              updated.id,
            );
            return updated;
          }
          return p;
        }),
      );
    },
    [addLog],
  );

  const duplicateProject = useCallback(
    (id: string) => {
      setProjects((prev) => {
        const original = prev.find((p) => p.id === id);
        if (!original) return prev;
        const copy: Project = {
          ...original,
          id: `proj-copy-${Date.now()}`,
          title: `${original.title} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addLog(
          "CREATE",
          `Duplicated project from "${original.title}"`,
          copy.title,
          copy.id,
        );
        return [copy, ...prev];
      });
    },
    [addLog],
  );

  const resetToDefaultData = useCallback(() => {
    const seed = initialProjectsData as Project[];
    setProjects(seed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    addLog(
      "RESET",
      "Reset project database to default factory static seed (projectsData.json)",
    );
  }, [addLog]);

  /**
   * Tooling: Download the exact formatted projectsData.json file
   * Can be directly dragged into /src/projects/projectsData.json
   */
  const downloadProjectsJson = useCallback(() => {
    const jsonString = JSON.stringify(projects, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "projectsData.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    addLog(
      "EXPORT",
      "Downloaded updated projectsData.json for repository sync",
    );
  }, [projects, addLog]);

  /**
   * Tooling: Export Full Backup JSON with timestamp
   */
  const exportBackupJson = useCallback(() => {
    const backupPayload = {
      exportedAt: new Date().toISOString(),
      version: "2.0.0",
      totalCount: projects.length,
      projects,
      activityLogs,
    };
    const jsonString = JSON.stringify(backupPayload, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `achyutam_projects_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    addLog("EXPORT", "Exported full JSON archive backup with activity logs");
  }, [projects, activityLogs, addLog]);

  /**
   * Tooling: Import Projects JSON
   */
  const importProjectsJson = useCallback(
    (
      rawJson: string,
    ): { success: boolean; message: string; count?: number } => {
      try {
        const parsed = JSON.parse(rawJson);
        let list: Project[] = [];
        if (Array.isArray(parsed)) {
          list = parsed;
        } else if (parsed && Array.isArray(parsed.projects)) {
          list = parsed.projects;
        } else {
          return {
            success: false,
            message:
              "Invalid JSON format. Expected an array of projects or a backup object.",
          };
        }

        // Basic validation
        const valid = list.filter(
          (p) =>
            p && typeof p.title === "string" && typeof p.category === "string",
        );
        if (valid.length === 0) {
          return {
            success: false,
            message: "No valid project records found in the provided JSON.",
          };
        }

        // Ensure every item has an ID and status
        const sanitized: Project[] = valid.map((p, idx) => ({
          ...p,
          id: p.id || `proj-imported-${Date.now()}-${idx}`,
          status: p.status || "completed",
          coverMedia: p.coverMedia || {
            type: "image",
            url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
          },
          galleryMedia: Array.isArray(p.galleryMedia) ? p.galleryMedia : [],
          techStackTags: Array.isArray(p.techStackTags) ? p.techStackTags : [],
          createdAt: p.createdAt || new Date().toISOString(),
        }));

        setProjects(sanitized);
        addLog(
          "IMPORT",
          `Successfully imported ${sanitized.length} projects into database`,
        );
        return {
          success: true,
          message: `Successfully imported ${sanitized.length} projects!`,
          count: sanitized.length,
        };
      } catch (e: unknown) {
        return {
          success: false,
          message: `JSON Parse error: ${(e as Error)?.message || "Invalid syntax"}`,
        };
      }
    },
    [addLog],
  );

  /**
   * Filter and Sort Projects
   */
  const getFilteredProjects = useCallback(
    (filters: ProjectFilterOptions): Project[] => {
      return projects
        .filter((p) => {
          // Search query (title, client, location, tagline, tags)
          if (filters.searchQuery) {
            const q = filters.searchQuery.toLowerCase().trim();
            const inTitle = p.title?.toLowerCase().includes(q);
            const inClient = p.clientName?.toLowerCase().includes(q);
            const inLocation = p.location?.toLowerCase().includes(q);
            const inTagline = p.tagline?.toLowerCase().includes(q);
            const inDesc = p.detailedDescription?.toLowerCase().includes(q);
            const inTags = p.techStackTags?.some((t) =>
              t.toLowerCase().includes(q),
            );
            if (
              !inTitle &&
              !inClient &&
              !inLocation &&
              !inTagline &&
              !inDesc &&
              !inTags
            ) {
              return false;
            }
          }

          // Status
          if (filters.status !== "all" && p.status !== filters.status) {
            return false;
          }

          // Category
          if (filters.category !== "all" && p.category !== filters.category) {
            return false;
          }

          // Tag filter
          if (filters.tag && !p.techStackTags?.includes(filters.tag)) {
            return false;
          }

          // Featured filter
          if (filters.featuredOnly && !p.featured) {
            return false;
          }

          return true;
        })
        .sort((a: Project, b: Project) => {
          if (filters.sortBy === "newest") {
            return (
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
            );
          }
          if (filters.sortBy === "oldest") {
            return (
              new Date(a.createdAt || 0).getTime() -
              new Date(b.createdAt || 0).getTime()
            );
          }
          if (filters.sortBy === "title") {
            return a.title.localeCompare(b.title);
          }
          if (filters.sortBy === "area") {
            const areaA =
              Number.parseInt((a.area || "0").replace(/\D/g, "")) || 0;
            const areaB =
              Number.parseInt((b.area || "0").replace(/\D/g, "")) || 0;
            return areaB - areaA;
          }
          return 0;
        });
    },
    [projects],
  );

  return {
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
    getFilteredProjects,
  };
}
