/**
 * ACHYUTAM BUILDER — Cloudinary Projects API Route
 * Dynamically queries Cloudinary Search API for all assets under folder `achyutam_projects/*`
 * and constructs project objects organized by Status, Category, and Project Name.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "yylmfuqv";
const API_KEY = process.env.CLOUDINARY_API_KEY || "462957832865732";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "9_ILtN3Z1nDSoLaKR3nC2WhAJgM";

export default async function handler(req, res) {
  try {
    if (res && typeof res.setHeader === 'function') {
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    }
    const projects = await getCloudinaryProjects();
    if (res && typeof res.status === 'function') {
      return res.status(200).json(projects);
    }
    return projects;
  } catch (err) {
    console.error("Cloudinary API Error:", err);
    if (res && typeof res.status === 'function') {
      return res.status(500).json({ error: err.message });
    }
    throw err;
  }
}

/**
 * Helper function to ensure f_auto,q_auto is automatically applied to all Cloudinary URLs.
 */
function applyCloudinaryTransformations(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return urlStr;
  if (urlStr.includes("res.cloudinary.com") && !urlStr.includes("f_auto") && !urlStr.includes("q_auto")) {
    return urlStr.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
  }
  return urlStr;
}

export async function getCloudinaryProjects() {
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

  // Group resources by project folder: acyutam_premo/projects/{status}/{category}/{projectName}
  const projectMap = new Map();

  resources.forEach((resItem) => {
    const folder = resItem.public_id && resItem.public_id.includes('/')
      ? resItem.public_id.substring(0, resItem.public_id.lastIndexOf('/'))
      : (resItem.folder || "");
    const parts = folder.split('/');
    
    let status = "Ongoing";
    let category = "Residential";
    let projName = "Acyutam Project";

    if (parts.length >= 4 && (parts[0] === 'acyutam_premo' || parts[0] === 'achyutam_projects')) {
      const offset = parts[0] === 'acyutam_premo' ? 1 : 0;
      status = parts[1 + offset] || "Ongoing";
      category = parts[2 + offset] || "Residential";
      projName = (parts[3 + offset] || "Acyutam Project").replace(/_/g, ' ');
    } else if (parts.length >= 2) {
      projName = parts[parts.length - 1].replace(/_/g, ' ');
    }

    const folderKey = folder || projName;
    const transformedUrl = applyCloudinaryTransformations(resItem.secure_url);

    if (!projectMap.has(folderKey)) {
      const context = resItem.context?.custom || resItem.context || {};
      const title = context.project_title || context.title || projName;
      const clientName = context.client_name || context.clientName || "Private Client";
      const location = context.location || "Rajasthan, India";
      const year = context.completion_year || context.year || new Date(resItem.created_at || Date.now()).getFullYear().toString();
      const description = context.description || context.caption || `Architectural project executed under ${status} status in ${category} division.`;

      projectMap.set(folderKey, {
        id: `proj-cld-${resItem.public_id.replace(/[^\w-]/g, '_')}`,
        title: title,
        clientName: clientName,
        location: location,
        area: context.area || "Bespoke Scale",
        budget: context.budget || "",
        year: year,
        category: category,
        status: status,
        description: description,
        cloudinaryFolder: folder,
        tags: resItem.tags || [status, category, folderKey],
        images: [],
        createdAt: resItem.created_at || new Date().toISOString()
      });
    }

    const projObj = projectMap.get(folderKey);
    projObj.images.push(transformedUrl);
  });

  // Format array into final project JSON format with auto f_auto,q_auto transformations
  const projectList = Array.from(projectMap.values()).map((p) => {
    const img1 = applyCloudinaryTransformations(p.images[0] || "photos_and_videos/logo.png");
    const img2 = applyCloudinaryTransformations(p.images[1] || img1);
    return {
      id: p.id,
      title: p.title,
      tagline: `${p.status} ${p.category} Project by ACHYUTAM BUILDER`,
      category: p.category,
      status: p.status,
      clientName: p.clientName,
      location: p.location,
      area: p.area,
      budget: p.budget,
      year: p.year,
      image1: img1,
      image2: img2,
      coverMedia: {
        type: "image",
        url: img1,
        caption: p.title
      },
      galleryMedia: p.images.map((imgUrl, idx) => ({
        id: `m-${idx}`,
        type: "image",
        url: applyCloudinaryTransformations(imgUrl),
        caption: `${p.title} - View ${idx + 1}`
      })),
      detailedDescription: p.description,
      description: p.description,
      cloudinaryFolder: p.cloudinaryFolder,
      featured: p.status === 'Ongoing',
      createdAt: p.createdAt
    };
  });

  return projectList;
}
