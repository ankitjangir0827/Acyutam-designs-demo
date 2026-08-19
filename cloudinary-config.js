/**
 * ACHYUTAM BUILDER — Cloudinary Helper Module
 * Provides dynamic Cloudinary image/video URL generation, folder hierarchy builder, and Cloudinary Upload Widget support.
 */

// Default Cloudinary Configuration
export const CLOUDINARY_CLOUD_NAME = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  ? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  : "yylmfuqv";

export const CLOUDINARY_UPLOAD_PRESET = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  ? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  : "achyutam_preset";

/**
 * Sanitizes a string into a clean Cloudinary folder or public ID name.
 */
export function sanitizeFolderName(str) {
  if (!str) return "Unnamed_Project";
  return str
    .toString()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s-]+/g, '_');
}

/**
 * Builds the strict hierarchical Cloudinary folder path:
 * acyutam_premo / projects / {status} / {category} / {projectName}
 * @param {string} status - upcoming | ongoing | completed
 * @param {string} category - residential | commercial | industrial | cultural
 * @param {string} projectName - Dynamic Project Title
 * @returns {string} Formatted folder path string
 */
export function buildCloudinaryFolderPath(status, category, projectName) {
  const normStatus = (status || "ongoing").trim().toLowerCase();
  const normCategory = (category || "residential").trim().toLowerCase();
  const normName = sanitizeFolderName(projectName);
  return `acyutam_premo/projects/${normStatus}/${normCategory}/${normName}`;
}

/**
 * Formats a Cloudinary image URL with auto-optimization (f_auto, q_auto) and optional dimensions.
 * @param {string} publicIdOrUrl - Cloudinary public ID or full image URL
 * @param {Object} [options] - Transformation options (width, height, crop, quality, format)
 * @returns {string} Optimized Cloudinary URL
 */
export function getCloudinaryUrl(publicIdOrUrl, options = {}) {
  if (!publicIdOrUrl) return "photos_and_videos/logo.png";
  
  // If already a full non-Cloudinary URL or local relative path, return as is
  if (!publicIdOrUrl.includes("res.cloudinary.com") && publicIdOrUrl.includes("/")) {
    return publicIdOrUrl;
  }

  const cloudName = options.cloudName || CLOUDINARY_CLOUD_NAME;
  const publicId = publicIdOrUrl.replace(/^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(v\d+\/)?/, '');

  const transformations = ["f_auto", "q_auto"];
  
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);

  const transformString = transformations.join(",");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
}

/**
 * Direct Unsigned Upload to Cloudinary via REST API.
 * Supports File object or Base64 / Remote URL string.
 * @param {File|Blob|string} fileOrUrl - Local File or Remote Image URL string
 * @param {string} folderPath - Target folder path on Cloudinary
 * @param {Object} [metadata] - Context metadata key-value pairs
 * @returns {Promise<Object>} Upload response object containing secure_url & public_id
 */
export async function uploadImageToCloudinary(fileOrUrl, folderPath, metadata = {}) {
  const cloudName = CLOUDINARY_CLOUD_NAME;
  const uploadPreset = CLOUDINARY_UPLOAD_PRESET;

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", fileOrUrl);
  formData.append("upload_preset", uploadPreset);

  if (folderPath) {
    formData.append("folder", folderPath);
  }

  if (metadata && Object.keys(metadata).length > 0) {
    const contextStr = Object.entries(metadata)
      .map(([k, v]) => `${k}=${encodeURIComponent(v || '')}`)
      .join("|");
    formData.append("context", contextStr);
  }

  const response = await fetch(url, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson.error?.message || `Cloudinary upload failed with status ${response.status}`);
  }

  return await response.json();
}

/**
 * Initializes and opens Cloudinary's Upload Widget with preset folder structure.
 * @param {Object} config - Cloudinary widget config options
 * @param {Function} onSuccess - Callback function called when upload completes
 */
export function openCloudinaryUploadWidget(config = {}, onSuccess) {
  if (typeof window === 'undefined' || !window.cloudinary) {
    console.error("Cloudinary Upload Widget SDK is not loaded. Please include <script src='https://upload-widget.cloudinary.com/global/all.js'></script>");
    alert("Cloudinary Upload Widget is loading... Please try again in a moment.");
    return;
  }

  const folderPath = config.folder || buildCloudinaryFolderPath(config.status, config.category, config.projectName);

  const widgetConfig = {
    cloudName: config.cloudName || CLOUDINARY_CLOUD_NAME,
    uploadPreset: config.uploadPreset || CLOUDINARY_UPLOAD_PRESET,
    folder: folderPath,
    sources: ['local', 'url', 'camera'],
    multiple: config.multiple || false,
    maxFiles: config.maxFiles || 5,
    clientAllowedFormats: ['png', 'jpeg', 'jpg', 'webp', 'mp4', 'webm'],
    styles: {
      palette: {
        window: "#131313",
        windowBorder: "#9E8F78",
        tabIcon: "#FF7722",
        menuBg: "#1C1B1B",
        textDark: "#000000",
        textLight: "#E5E2E1",
        link: "#FF7722",
        action: "#FF7722",
        inactiveTabIcon: "#514532",
        error: "#F44336",
        inProgress: "#FFBA20",
        complete: "#4CAF50",
        sourceBg: "#201F1F"
      }
    },
    ...config
  };

  const myWidget = window.cloudinary.createUploadWidget(widgetConfig, (error, result) => {
    if (!error && result && result.event === "success") {
      console.log("Cloudinary Upload Success:", result.info);
      if (typeof onSuccess === 'function') {
        onSuccess(result.info);
      }
    }
  });

  myWidget.open();
}

/**
 * Dynamically fetches all Cloudinary projects from /api/projects route.
 * @returns {Promise<Array>} Array of project objects
 */
export async function fetchCloudinaryProjects() {
  try {
    const res = await fetch("/api/projects", {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Dynamic /api/projects fetch notice:", err);
  }
/**
 * Fetches projects grouped by Status -> Category -> Project Name from /api/admin/projects.
 */
export async function fetchAdminGroupedProjects() {
  try {
    const res = await fetch("/api/admin/projects");
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Grouped projects fetch notice:", err);
  }
  return { success: false, tree: {} };
}

/**
 * Posts project form data to /api/admin/projects/upload
 */
export async function uploadProjectToApi(payload) {
  const res = await fetch("/api/admin/projects/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Upload HTTP ${res.status}: ${errText}`);
  }
  return await res.json();
}

if (typeof window !== 'undefined') {
  window.AchyutamCloudinary = {
    getCloudinaryUrl,
    buildCloudinaryFolderPath,
    uploadImageToCloudinary,
    openCloudinaryUploadWidget,
    fetchCloudinaryProjects,
    fetchAdminGroupedProjects,
    uploadProjectToApi,
    sanitizeFolderName,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_UPLOAD_PRESET
  };
}
