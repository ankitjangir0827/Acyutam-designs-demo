/**
 * ACHYUTAM DESIGNS — Cloudinary Upload API Controller
 * Route: POST /api/admin/projects/upload
 * 
 * Computes dynamic folder hierarchy: achyutam_projects/{status}/{category}/{projectName}
 * Attaches contextual metadata and searchable tags to each Cloudinary upload.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "yylmfuqv";
const API_KEY = process.env.CLOUDINARY_API_KEY || "462957832865732";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "9_ILtN3Z1nDSoLaKR3nC2WhAJgM";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "achyutam_preset";

/**
 * Sanitizes string into a clean URL-friendly slug (e.g. "Villa Moderna" -> "villa_moderna")
 */
export function sanitizeSlug(str) {
  if (!str) return "unnamed_project";
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s-]+/g, "_");
}

/**
 * Formats status enum to lowercase: upcoming | ongoing | completed
 */
export function normalizeStatus(status) {
  const s = String(status || "").toLowerCase().trim();
  if (s.includes("upcom") || s.includes("plan")) return "upcoming";
  if (s.includes("complete") || s.includes("deliver")) return "completed";
  return "ongoing";
}

/**
 * Formats category enum to lowercase: residential | commercial | industrial | cultural
 */
export function normalizeCategory(category) {
  const c = String(category || "").toLowerCase().trim();
  if (c.includes("commerc")) return "commercial";
  if (c.includes("industr")) return "industrial";
  if (c.includes("cultur") || c.includes("temple") || c.includes("assembl")) return "cultural";
  return "residential";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    if (res && typeof res.status === "function") {
      return res.status(405).json({ error: "Method not allowed. Use POST." });
    }
    throw new Error("Method not allowed. Use POST.");
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      body = JSON.parse(body);
    }
    body = body || {};

    const projectTitle = body.project_title || body.title || "Untitled Project";
    const status = normalizeStatus(body.status);
    const category = normalizeCategory(body.category);
    const projectName = sanitizeSlug(body.projectName || projectTitle);
    const description = body.description || "";
    const location = body.location || "Rajasthan, India";
    const clientName = body.client_name || body.clientName || "Private Client";
    const completionYear = String(body.completion_year || body.year || new Date().getFullYear());

    // 1. Dynamic Cloudinary Folder Hierarchy: acyutam_premo/projects/{status}/{category}/{projectName}
    const folderPath = `acyutam_premo/projects/${status}/${category}/${projectName}`;

    // 2. Cloudinary Context Metadata String (Key=Value|Key=Value)
    const contextString = [
      `project_title=${encodeURIComponent(projectTitle)}`,
      `status=${encodeURIComponent(status)}`,
      `category=${encodeURIComponent(category)}`,
      `description=${encodeURIComponent(description)}`,
      `location=${encodeURIComponent(location)}`,
      `client_name=${encodeURIComponent(clientName)}`,
      `completion_year=${encodeURIComponent(completionYear)}`
    ].join("|");

    // 3. Searchable Tags Array
    const tagsString = [status, category, projectName].join(",");

    // Extract files/URLs to upload (image1, image2, images array or single file)
    const filesToUpload = [];
    if (body.image1) filesToUpload.push(body.image1);
    if (body.image2) filesToUpload.push(body.image2);
    if (Array.isArray(body.images)) {
      body.images.forEach((img) => {
        if (img && !filesToUpload.includes(img)) filesToUpload.push(img);
      });
    }
    if (body.file) filesToUpload.push(body.file);

    if (filesToUpload.length === 0) {
      if (res && typeof res.status === "function") {
        return res.status(400).json({ error: "No image file or URL provided for upload." });
      }
      throw new Error("No image file or URL provided for upload.");
    }

    // Process uploads directly to Cloudinary REST Upload API
    const uploadResults = [];
    const authHeader = "Basic " + Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");

    for (const fileOrUrl of filesToUpload) {
      const formData = new URLSearchParams();
      formData.append("file", fileOrUrl);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", folderPath);
      formData.append("context", contextString);
      formData.append("tags", tagsString);

      const cldResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      });

      if (!cldResponse.ok) {
        const errText = await cldResponse.text();
        console.error(`Cloudinary Upload Error for ${fileOrUrl.substring(0, 30)}:`, errText);
        continue;
      }

      const cldResult = await cldResponse.json();
      
      // Auto-apply f_auto,q_auto transformations
      let secureUrl = cldResult.secure_url || "";
      if (secureUrl.includes("res.cloudinary.com") && !secureUrl.includes("f_auto")) {
        secureUrl = secureUrl.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
      }

      uploadResults.push({
        public_id: cldResult.public_id,
        secure_url: secureUrl,
        format: cldResult.format,
        width: cldResult.width,
        height: cldResult.height,
        bytes: cldResult.bytes,
        folder: folderPath
      });
    }

    const responsePayload = {
      success: true,
      message: `Uploaded ${uploadResults.length} assets to ${folderPath}`,
      folder: folderPath,
      project: {
        title: projectTitle,
        status: status,
        category: category,
        projectName: projectName,
        description: description,
        location: location,
        client_name: clientName,
        completion_year: completionYear
      },
      assets: uploadResults
    };

    if (res && typeof res.status === "function") {
      return res.status(200).json(responsePayload);
    }
    return responsePayload;
  } catch (err) {
    console.error("Project Upload Controller Error:", err);
    if (res && typeof res.status === "function") {
      return res.status(500).json({ error: err.message });
    }
    throw err;
  }
}
