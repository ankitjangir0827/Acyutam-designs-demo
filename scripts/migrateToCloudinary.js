/**
 * ACHYUTAM BUILDER — Cloudinary Migration Script
 * Batch uploads all project assets from projects.json directly to Cloudinary
 * using the strict hierarchical folder structure:
 * achyutam_projects / [Status] / [Category] / [Project_Name] /
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "yylmfuqv";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "achyutam_preset";
const API_KEY = process.env.CLOUDINARY_API_KEY || "462957832865732";

function sanitizeFolderName(str) {
  if (!str) return "Unnamed_Project";
  return str
    .toString()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s-]+/g, '_');
}

function normalizeStatus(statusStr) {
  const str = (statusStr || '').toLowerCase();
  if (str.includes('completed') || str.includes('finish')) return 'Completed';
  if (str.includes('upcoming') || str.includes('planning')) return 'Upcoming';
  return 'Ongoing';
}

function normalizeCategory(catStr) {
  const str = (catStr || '').toLowerCase();
  if (str.includes('commercial')) return 'Commercial';
  if (str.includes('industrial')) return 'Industrial';
  if (str.includes('temple') || str.includes('cultural') || str.includes('architectural')) return 'Architectural';
  return 'Residential';
}

async function uploadToCloudinary(fileOrUrl, folderPath, tags = []) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  
  const formData = new URLSearchParams();
  formData.append('file', fileOrUrl);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folderPath);
  if (tags.length > 0) {
    formData.append('tags', tags.join(','));
  }

  const res = await fetch(url, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudinary HTTP ${res.status}: ${errText}`);
  }

  return await res.json();
}

async function runMigration() {
  console.log("🚀 Starting Cloudinary Migration Script...");
  console.log(`Cloud Name: ${CLOUD_NAME}`);
  console.log(`Preset: ${UPLOAD_PRESET}`);

  const projectsJsonPath = path.join(process.cwd(), 'projects.json');
  if (!fs.existsSync(projectsJsonPath)) {
    console.error("❌ projects.json not found!");
    process.exit(1);
  }

  const projectsData = JSON.parse(fs.readFileSync(projectsJsonPath, 'utf8'));
  console.log(`📦 Found ${projectsData.length} projects to process.`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < projectsData.length; i++) {
    const proj = projectsData[i];
    const status = normalizeStatus(proj.status);
    const category = normalizeCategory(proj.category);
    const projName = proj.title || proj.name || `Project_${i+1}`;
    
    // Strict Hierarchical Folder Path
    const folderPath = `achyutam_projects/${status}/${category}/${sanitizeFolderName(projName)}`;
    console.log(`\n[${i+1}/${projectsData.length}] Processing: "${projName}"`);
    console.log(`   📂 Cloudinary Folder: ${folderPath}`);

    // Target Media URLs (coverMedia, galleryMedia, image1, image2)
    const mediaUrls = [];
    if (proj.coverMedia?.url) mediaUrls.push({ key: 'coverMedia', url: proj.coverMedia.url });
    if (proj.image1) mediaUrls.push({ key: 'image1', url: proj.image1 });
    if (proj.image2) mediaUrls.push({ key: 'image2', url: proj.image2 });
    if (Array.isArray(proj.galleryMedia)) {
      proj.galleryMedia.forEach((g, idx) => {
        if (g.url) mediaUrls.push({ key: `gallery_${idx}`, url: g.url });
      });
    }

    for (const media of mediaUrls) {
      if (!media.url || media.url.includes('res.cloudinary.com')) {
        console.log(`   ⏩ Skipping already hosted Cloudinary URL: ${media.url}`);
        continue;
      }

      try {
        console.log(`   ☁️ Uploading ${media.key}...`);
        const result = await uploadToCloudinary(media.url, folderPath, [status, category, 'achyutam_migration']);
        
        // Update URL in project object
        if (media.key === 'coverMedia' && proj.coverMedia) proj.coverMedia.url = result.secure_url;
        if (media.key === 'image1') proj.image1 = result.secure_url;
        if (media.key === 'image2') proj.image2 = result.secure_url;
        if (media.key.startsWith('gallery_')) {
          const idx = parseInt(media.key.replace('gallery_', ''), 10);
          if (proj.galleryMedia && proj.galleryMedia[idx]) proj.galleryMedia[idx].url = result.secure_url;
        }
        
        proj.cloudinaryFolder = folderPath;
        console.log(`   ✅ Success: ${result.secure_url}`);
        successCount++;
      } catch (err) {
        console.warn(`   ⚠️ Migration upload warning for ${media.key}: ${err.message}`);
        errorCount++;
      }
    }
  }

  // Write updated projects.json back to disk
  fs.writeFileSync(projectsJsonPath, JSON.stringify(projectsData, null, 2), 'utf8');
  console.log(`\n🎉 Migration Complete!`);
  console.log(`   - Uploaded/Verified: ${successCount} assets`);
  console.log(`   - Warnings/Skipped: ${errorCount}`);
  console.log(`   - Updated ${projectsJsonPath}`);
}

runMigration().catch(err => {
  console.error("❌ Fatal Migration Error:", err);
  process.exit(1);
});
