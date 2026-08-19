import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "yylmfuqv";
const API_KEY = process.env.CLOUDINARY_API_KEY || "462957832865732";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "9_ILtN3Z1nDSoLaKR3nC2WhAJgM";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "achyutam_preset";

const slugify = (text) =>
  String(text || 'unnamed_project')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s-]+/g, '_');

const normalizeStatus = (status) => {
  const s = String(status || '').toLowerCase().trim();
  if (s.includes('upcom') || s.includes('plan')) return 'upcoming';
  if (s.includes('complete') || s.includes('deliver')) return 'completed';
  return 'ongoing';
};

const normalizeCategory = (category) => {
  const c = String(category || '').toLowerCase().trim();
  if (c.includes('commerc')) return 'commercial';
  if (c.includes('industr')) return 'industrial';
  if (c.includes('cultur') || c.includes('temple') || c.includes('assembl')) return 'cultural';
  return 'residential';
};

async function migrateProjects() {
  const jsonPath = fs.existsSync('projects.json') ? 'projects.json' : 'projects.json.bak';
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ projects.json file not found!');
    return;
  }

  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const projects = JSON.parse(rawData);
  const updatedProjects = [];

  console.log(`🚀 Migration Started: Found ${projects.length} projects in ${jsonPath}.\n`);
  const authHeader = 'Basic ' + Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const status = normalizeStatus(p.status);
    const category = normalizeCategory(p.category);
    const title = p.title || p.name || `Project ${i + 1}`;
    const projectNameSlug = slugify(title);

    const targetFolder = `acyutam_premo/projects/${status}/${category}/${projectNameSlug}`;

    console.log(`[${i + 1}/${projects.length}] Processing: "${title}"`);
    console.log(`📁 Target Folder: ${targetFolder}`);

    const contextString = [
      `project_title=${encodeURIComponent(title)}`,
      `status=${encodeURIComponent(status)}`,
      `category=${encodeURIComponent(category)}`,
      `description=${encodeURIComponent(p.detailedDescription || p.description || '')}`,
      `location=${encodeURIComponent(p.location || 'Rajasthan, India')}`,
      `client_name=${encodeURIComponent(p.clientName || 'Private Client')}`,
      `completion_year=${encodeURIComponent(p.year || '2026')}`
    ].join('|');

    const tagsString = [status, category, projectNameSlug].join(',');

    const uploadedImageUrls = [];
    const imagesToProcess = [];

    if (p.coverMedia?.url) imagesToProcess.push(p.coverMedia.url);
    if (p.image1) imagesToProcess.push(p.image1);
    if (p.image2) imagesToProcess.push(p.image2);
    if (Array.isArray(p.galleryMedia)) {
      p.galleryMedia.forEach((m) => {
        if (m.url && !imagesToProcess.includes(m.url)) imagesToProcess.push(m.url);
      });
    }

    for (let imgIdx = 0; imgIdx < imagesToProcess.length; imgIdx++) {
      const imgSource = imagesToProcess[imgIdx];

      try {
        const formData = new URLSearchParams();
        formData.append('file', imgSource);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', targetFolder);
        formData.append('context', contextString);
        formData.append('tags', tagsString);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData.toString()
        });

        if (res.ok) {
          const cldRes = await res.json();
          let secureUrl = cldRes.secure_url;
          if (secureUrl.includes('res.cloudinary.com') && !secureUrl.includes('f_auto')) {
            secureUrl = secureUrl.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
          }
          console.log(`   ✅ Asset [${imgIdx + 1}] -> ${secureUrl}`);
          uploadedImageUrls.push(secureUrl);
        } else {
          console.warn(`   ⚠️ Asset [${imgIdx + 1}] Upload Http ${res.status}`);
          uploadedImageUrls.push(imgSource);
        }
      } catch (err) {
        console.error(`   ❌ Failed uploading asset [${imgIdx + 1}]:`, err.message);
        uploadedImageUrls.push(imgSource);
      }
    }

    const img1 = uploadedImageUrls[0] || 'photos_and_videos/logo.png';
    const img2 = uploadedImageUrls[1] || img1;

    updatedProjects.push({
      ...p,
      title: title,
      status: status,
      category: category,
      image1: img1,
      image2: img2,
      cloudinaryFolder: targetFolder,
      images: uploadedImageUrls,
      updatedAt: new Date().toISOString()
    });

    console.log('--------------------------------------------------');
  }

  const outputPath = 'migrated_projects.json';
  fs.writeFileSync(outputPath, JSON.stringify(updatedProjects, null, 2), 'utf-8');

  console.log(`\n🎉 Migration Complete!`);
  console.log(`📁 ${updatedProjects.length} Projects uploaded to Cloudinary folder hierarchy: acyutam_premo/projects/{status}/{category}/{projectName}`);
  console.log(`📁 Saved migrated registry in: ${outputPath}`);
}

migrateProjects().catch((err) => console.error('Migration error:', err));
