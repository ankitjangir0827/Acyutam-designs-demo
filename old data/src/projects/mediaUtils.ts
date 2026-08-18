/**
 * Media Management & Formatting Utilities
 * Handles local paths, base64 uploads, and video embed transforms (YouTube, Vimeo, MP4)
 */

import type { MediaItem, MediaType } from "./types";

/**
 * Extracts embeddable URL for YouTube or Vimeo video links.
 * If direct MP4/WebM or other video format, returns as is.
 */
export function formatVideoEmbedUrl(url: string): {
  embedUrl: string;
  isEmbed: boolean;
  provider: "youtube" | "vimeo" | "direct" | "unknown";
} {
  if (!url) return { embedUrl: "", isEmbed: false, provider: "unknown" };

  const trimmed = url.trim();

  // YouTube matchers (watch?v=, youtu.be/, shorts/, embed/)
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i,
  );
  if (ytMatch?.[1]) {
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1`,
      isEmbed: true,
      provider: "youtube",
    };
  }

  // Vimeo matchers
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/i);
  if (vimeoMatch?.[1]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`,
      isEmbed: true,
      provider: "vimeo",
    };
  }

  // Check if direct video file
  if (
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed) ||
    trimmed.startsWith("data:video/")
  ) {
    return {
      embedUrl: trimmed,
      isEmbed: false,
      provider: "direct",
    };
  }

  return {
    embedUrl: trimmed,
    isEmbed: false,
    provider: "unknown",
  };
}

/**
 * Converts a File object into a Base64 string (Data URL) for 100% client-side persistence
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Creates a unique MediaItem object
 */
export function createMediaItem(
  type: MediaType,
  url: string,
  caption?: string,
  isLocal = false,
): MediaItem {
  return {
    id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    type,
    url: url.trim(),
    caption: caption || "",
    isLocal,
  };
}

/**
 * Curated list of local and high-performance architectural project media presets
 */
export const ARCHITECTURAL_PRESET_MEDIA: Array<{
  label: string;
  url: string;
  type: MediaType;
  category: string;
}> = [
  {
    label: "Brand Hero Animation (MP4)",
    url: "photos and videos/Logo_animation_blooming_lotus_1080p_202608112142_gwr_video_mvp.mp4",
    type: "video",
    category: "Motion Branding",
  },
  {
    label: "Preloader Architecture Video (MP4)",
    url: "photos and videos/upscaled-video preloader.mp4",
    type: "video",
    category: "Motion Branding",
  },
  {
    label: "Modern Cantilevered Residence Facade",
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
    type: "image",
    category: "Residential",
  },
  {
    label: "Courtyard & Waterbody Pavilion",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    type: "image",
    category: "Residential",
  },
  {
    label: "Double-Height Atrium & Marble Finishes",
    url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85",
    type: "image",
    category: "Residential",
  },
  {
    label: "Monolithic Thermal Stone Cladding",
    url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85",
    type: "image",
    category: "Residential",
  },
  {
    label: "Corporate IT Tower Glass Curtain Wall",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
    type: "image",
    category: "Commercial",
  },
  {
    label: "Commercial Multi-Tier Glass Plaza",
    url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=85",
    type: "image",
    category: "Commercial",
  },
  {
    label: "Heavy Industrial Plant & Pre-Engineered Steel",
    url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=85",
    type: "image",
    category: "Industrial",
  },
  {
    label: "Sacred Stone Temple & Nagara Shikhara Carvings",
    url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85",
    type: "image",
    category: "Assembly & Heritage",
  },
  {
    label: "Architectural Flythrough 3D Tour (YouTube Sample)",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    type: "video",
    category: "3D Simulation",
  },
];
