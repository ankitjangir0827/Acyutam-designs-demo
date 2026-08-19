/**
 * ACHYUTAM DESIGNS — Admin Hierarchical Projects List Controller
 * Route: GET /api/admin/projects
 * 
 * Fetches all assets from Cloudinary and groups them hierarchically:
 * Status -> Category -> Project Name
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "yylmfuqv";
const API_KEY = process.env.CLOUDINARY_API_KEY || "462957832865732";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "9_ILtN3Z1nDSoLaKR3nC2WhAJgM";

export default async function handler(req, res) {
  try {
    const groupedProjects = await getAdminGroupedProjects();
    if (res && typeof res.setHeader === "function") {
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    }
    if (res && typeof res.status === "function") {
      return res.status(200).json(groupedProjects);
    }
    return groupedProjects;
  } catch (err) {
    console.error("Admin Grouped Projects API Error:", err);
    if (res && typeof res.status === "function") {
      return res.status(500).json({ error: err.message });
    }
    throw err;
  }
}

export async function getAdminGroupedProjects() {
  const authHeader = "Basic " + Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");
  
  const searchPayload = {
    expression: "folder:acyutam_premo* OR folder:achyutam_projects*",
    max_results: 500,
    with_field: ["context", "tags"]
  };

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": authHeader
    },
    body: JSON.stringify(searchPayload),
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Cloudinary Search HTTP ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const resources = data.resources || [];

  // Grouping structure: { upcoming: { residential: [], commercial: [], industrial: [], cultural: [] }, ... }
  const groupedTree = {
    upcoming: { residential: [], commercial: [], industrial: [], cultural: [] },
    ongoing: { residential: [], commercial: [], industrial: [], cultural: [] },
    completed: { residential: [], commercial: [], industrial: [], cultural: [] }
  };

  const projectMap = new Map();

  resources.forEach((resItem) => {
    const folder = resItem.public_id && resItem.public_id.includes('/')
      ? resItem.public_id.substring(0, resItem.public_id.lastIndexOf('/'))
      : (resItem.folder || "");
    const parts = folder.split("/");
    
    let status = "ongoing";
    let category = "residential";
    let projSlug = "unnamed_project";

    if (parts.length >= 4 && (parts[0] === "acyutam_premo" || parts[0] === "achyutam_projects")) {
      const offset = parts[0] === "acyutam_premo" ? 1 : 0;
      status = parts[1 + offset]?.toLowerCase() || "ongoing";
      category = parts[2 + offset]?.toLowerCase() || "residential";
      projSlug = parts[3 + offset] || "unnamed_project";
    } else if (parts.length >= 2) {
      projSlug = parts[parts.length - 1];
    }

    if (!groupedTree[status]) {
      groupedTree[status] = { residential: [], commercial: [], industrial: [], cultural: [] };
    }
    if (!groupedTree[status][category]) {
      groupedTree[status][category] = [];
    }

    const folderKey = `${status}:${category}:${projSlug}`;

    let secureUrl = resItem.secure_url || "";
    if (secureUrl.includes("res.cloudinary.com") && !secureUrl.includes("f_auto")) {
      secureUrl = secureUrl.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
    }

    if (!projectMap.has(folderKey)) {
      const context = resItem.context?.custom || resItem.context || {};
      const projTitle = context.project_title || context.title || projSlug.replace(/_/g, " ");

      const projObj = {
        slug: projSlug,
        title: projTitle,
        status: status,
        category: category,
        clientName: context.client_name || context.clientName || "Private Client",
        location: context.location || "Rajasthan, India",
        description: context.description || `Architectural project under ${status} in ${category}.`,
        completionYear: context.completion_year || context.year || new Date(resItem.created_at || Date.now()).getFullYear().toString(),
        cloudinaryFolder: folder,
        images: [secureUrl],
        tags: resItem.tags || [status, category, projSlug]
      };

      projectMap.set(folderKey, projObj);
      groupedTree[status][category].push(projObj);
    } else {
      const projObj = projectMap.get(folderKey);
      if (!projObj.images.includes(secureUrl)) {
        projObj.images.push(secureUrl);
      }
    }
  });

  return {
    success: true,
    totalProjects: projectMap.size,
    tree: groupedTree
  };
}
