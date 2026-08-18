export type ProjectStatus = "completed" | "in_progress" | "upcoming";

export type ProjectCategory =
  | "Residential"
  | "Commercial"
  | "Industrial"
  | "Assembly & Heritage"
  | "Infrastructure"
  | "Interior & Luxury";

export type MediaType = "image" | "video";

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  caption?: string;
  isLocal?: boolean;
  thumbnailUrl?: string;
  aspectRatio?: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: ProjectCategory | string;
  status: ProjectStatus;
  clientName: string;
  location: string;
  area: string;
  budget?: string;
  year?: string;
  progressPercent?: number; // 0-100 for in_progress
  coverMedia: {
    type: MediaType;
    url: string;
    caption?: string;
    thumbnailUrl?: string;
  };
  galleryMedia: MediaItem[];
  detailedDescription: string;
  techStackTags: string[];
  structuralStandards?: string[];
  liveDemoUrl?: string; // Virtual Tour / Live site feed / 3D model
  githubRepoUrl?: string; // Blueprint / CAD / Docs Repo
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminCredentials {
  email: string;
  passwordHash: string; // SHA-256
  masterPinHash: string; // SHA-256
  lastUpdated?: string;
}

export interface AdminSession {
  isAuthenticated: boolean;
  isStep1Passed: boolean;
  isStep2Passed: boolean;
  authenticatedEmail: string | null;
  loginTimestamp: number | null;
  expiresAt: number | null;
}

export interface AuthAttemptState {
  failedAttempts: number;
  lockoutUntil: number | null;
}

export interface ActivityLog {
  id: string;
  action:
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "EXPORT"
    | "IMPORT"
    | "RESET"
    | "LOGIN"
    | "SECURITY_UPDATE";
  projectTitle?: string;
  projectId?: string;
  timestamp: string;
  details?: string;
}

export interface ProjectFilterOptions {
  searchQuery?: string;
  status?: "all" | ProjectStatus;
  category?: "all" | string;
  tag?: string;
  featuredOnly?: boolean;
  sortBy?: "newest" | "oldest" | "title" | "area";
}
