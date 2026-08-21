/**
 * ACHYUTAM BUILDER® — CUSTOM PROJECTS DYNAMIC LOADER
 * Automatically loads user-created and updated projects from Cloud Firestore, localStorage & JSON into page grids.
 * Real-Time Cross-Browser Synchronization Active.
 */

(function () {
  'use strict';

  // Helper to open project modal with gallery preview thumbnails (Supports 1 to 20+ images dynamically)
  window.openProjectModal = function (name, tag, ctc, loc, specs, ...imgParams) {
    let modal = document.getElementById('project-detail-modal');
    if (modal) modal.remove();

    let rawImages = [];
    imgParams.forEach(param => {
      if (Array.isArray(param)) {
        rawImages.push(...param);
      } else if (typeof param === 'string' && param.trim() !== '') {
        try {
          if (param.startsWith('[') && param.endsWith(']')) {
            const parsed = JSON.parse(param);
            if (Array.isArray(parsed)) rawImages.push(...parsed);
          } else {
            rawImages.push(param.trim());
          }
        } catch(e) {
          rawImages.push(param.trim());
        }
      } else if (typeof param === 'object' && param !== null) {
        if (Array.isArray(param.images)) rawImages.push(...param.images);
        if (param.image1) rawImages.push(param.image1);
        if (param.image2) rawImages.push(param.image2);
        if (param.image3) rawImages.push(param.image3);
        if (param.image4) rawImages.push(param.image4);
        if (param.image5) rawImages.push(param.image5);
      }
    });

    let imageList = Array.from(new Set(rawImages.filter(img => typeof img === 'string' && img.length > 5)));

    if (imageList.length === 0) {
      imageList = [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
      ];
    }

    const mainImage = imageList[0];

    modal = document.createElement('div');
    modal.id = 'project-detail-modal';
    modal.className = 'fixed inset-0 z-[200] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto animate-fadeIn';
    modal.innerHTML = `
      <div class="relative bg-surface-container-low border border-outline-variant/50 rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)] text-on-surface my-8 font-sans">
        
        <!-- Close Modal Button -->
        <button onclick="closeProjectModal()" class="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container cursor-pointer z-20" title="Close Details">
          <span class="material-symbols-outlined text-2xl">close</span>
        </button>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          <!-- Left Column: Large Active Image Preview -->
          <div class="md:col-span-7 flex flex-col gap-3">
            <div class="relative w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden border border-outline-variant/40 bg-black/40 shadow-inner group">
              <img id="pm-main-img" src="${mainImage}" alt="${name || 'Project View'}" class="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"/>
              <div class="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-mono text-primary border border-primary/30 uppercase tracking-widest flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>ARCHITECTURAL PREVIEW VIEW</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Project Meta, Specs & Thumbnail Preview Gallery -->
          <div class="md:col-span-5 flex flex-col gap-4">
            
            <div class="flex flex-wrap items-center gap-2">
              <span id="pm-tag" class="px-2.5 py-1 rounded-md bg-primary/10 border border-primary/40 text-primary font-mono text-[10px] uppercase font-bold tracking-widest">
                ${tag || 'FEATURED PROJECT'}
              </span>
              <span id="pm-ctc" class="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/40 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-widest">
                ${ctc || 'CUSTOM ESTIMATE'}
              </span>
            </div>

            <div>
              <h2 id="pm-title" class="font-display text-2xl sm:text-3xl font-bold text-on-surface leading-tight">${name || 'Project Name'}</h2>
              <p id="pm-loc" class="text-xs text-primary font-mono mt-1 flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">location_on</span>
                <span>${loc || 'Sikar, Rajasthan / U.P.'}</span>
              </p>
            </div>

            <div class="bg-surface-container/60 p-4 rounded-xl border border-outline-variant/30 text-xs text-on-surface-variant leading-relaxed">
              <strong class="text-on-surface font-mono uppercase tracking-wider block mb-1">Scope &amp; Specifications:</strong>
              <p id="pm-specs" class="font-sans text-xs opacity-90">${specs || 'Turnkey architectural design, structural engineering, and high-end construction execution by ACHYUTAM BUILDER®.'}</p>
            </div>

            <!-- Preview Image Gallery Thumbnails (Dynamic Grid for Unlimited Admin Uploads) -->
            <div>
              <label class="block font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 font-bold flex items-center justify-between">
                <span>PROJECT GALLERY PREVIEWS (${imageList.length} VIEWS):</span>
                <span class="text-primary font-normal">CLICK THUMBNAIL TO SWITCH</span>
              </label>
              <div class="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-44 overflow-y-auto custom-scrollbar p-1" id="pm-thumbnails">
                ${imageList.map((img, idx) => `
                  <div onclick="switchProjectPreviewImage('${img}', this)" class="thumbnail-item relative aspect-square rounded-lg overflow-hidden border-2 ${idx === 0 ? 'border-primary shadow-md' : 'border-outline-variant/40 opacity-70'} hover:opacity-100 hover:border-primary transition-all cursor-pointer bg-black/40">
                    <img src="${img}" alt="Preview ${idx + 1}" class="w-full h-full object-cover"/>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-2 pt-2 font-mono text-xs">
              <div class="grid grid-cols-2 gap-2">
                <a href="tel:9116400862" class="py-2.5 px-3 bg-primary text-black font-bold uppercase tracking-wider rounded-md text-center hover:bg-primary-hover transition-all flex items-center justify-center gap-1">
                  <span class="material-symbols-outlined text-sm">call</span> CALL HOTLINE
                </a>
                <a href="https://wa.me/919116400862" target="_blank" class="py-2.5 px-3 border border-emerald-500/60 text-emerald-400 font-bold uppercase tracking-wider rounded-md text-center hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center gap-1">
                  <span class="material-symbols-outlined text-sm">chat</span> WHATSAPP
                </a>
              </div>
              <a href="contact.html?project=${encodeURIComponent(name || '')}" class="py-3 border border-outline-variant/50 text-on-surface hover:border-primary hover:text-primary font-bold uppercase tracking-widest rounded-md text-center bg-surface-container-low transition-all">
                ENQUIRE PROPOSAL FOR THIS PROJECT →
              </a>
            </div>

          </div>
        </div>

      </div>
    `;
    document.body.appendChild(modal);
  };

  window.switchProjectPreviewImage = function (newSrc, thumbEl) {
    const mainImg = document.getElementById('pm-main-img');
    if (mainImg) {
      mainImg.style.opacity = '0.4';
      setTimeout(() => {
        mainImg.src = newSrc;
        mainImg.style.opacity = '1';
      }, 150);
    }
    const thumbs = document.querySelectorAll('#pm-thumbnails .thumbnail-item');
    thumbs.forEach(t => {
      t.className = 'thumbnail-item relative aspect-square rounded-lg overflow-hidden border-2 border-outline-variant/40 opacity-70 hover:opacity-100 hover:border-primary transition-all cursor-pointer bg-black/40';
    });
    if (thumbEl) {
      thumbEl.className = 'thumbnail-item relative aspect-square rounded-lg overflow-hidden border-2 border-primary shadow-md opacity-100 transition-all cursor-pointer bg-black/40';
    }
  };

  window.closeProjectModal = function () {
    const modal = document.getElementById('project-detail-modal');
    if (modal) modal.remove();
  };

  async function getStoredProjects() {
    let projects = [];

    // Try fetching from Cloud Firestore first if available
    try {
      if (window.AchyutamFirebase && window.AchyutamFirebase.getProjectsFromFirebase) {
        const cloudRes = await window.AchyutamFirebase.getProjectsFromFirebase();
        if (cloudRes.success && Array.isArray(cloudRes.projects) && cloudRes.projects.length > 0) {
          projects = cloudRes.projects;
          try {
            localStorage.setItem("achyutam_static_projects", JSON.stringify(projects));
            localStorage.setItem("achyutam_projects_cache", JSON.stringify(projects));
          } catch(e) {}
          return projects;
        }
      }
    } catch(err) {
      console.warn("Firestore getProjects error:", err);
    }

    try {
      const p1 = localStorage.getItem("achyutam_static_projects");
      const p2 = localStorage.getItem("achyutam_projects_cache");
      const raw = p1 || p2;
      if (raw) {
        projects = JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Could not read projects from localStorage:", e);
    }

    if (!projects || projects.length === 0) {
      try {
        let res = await fetch("./projects.json").catch(() => null);
        if (!res || !res.ok) {
          res = await fetch("/projects.json").catch(() => null);
        }
        if (res && res.ok) {
          projects = await res.json();
          try {
            localStorage.setItem("achyutam_projects_cache", JSON.stringify(projects));
          } catch(e) {}
        }
      } catch (err) {
        console.warn("Fetch projects.json error:", err);
      }
    }
    return projects || [];
  }

  function createProjectCardHTML(p) {
    const title = p.title || p.clientName || "Custom Project";
    const status = (p.status || "Ongoing").toUpperCase();
    const category = (p.category || "Residential").toUpperCase();
    const tag = `${status} / ${category}`;
    const location = p.location || "Sikar, Rajasthan";
    const specs = p.description || p.area || "Custom architectural project";
    const cost = p.cost || p.ctc || "₹80+ Lakh CTC";
    
    // Collect all available image URLs into an array
    const imgArray = [];
    if (Array.isArray(p.images)) imgArray.push(...p.images);
    if (p.image1) imgArray.push(p.image1);
    if (p.image2) imgArray.push(p.image2);
    if (p.image3) imgArray.push(p.image3);
    if (p.image4) imgArray.push(p.image4);
    if (p.image5) imgArray.push(p.image5);
    if (p.image) imgArray.push(p.image);
    
    const uniqueImgs = Array.from(new Set(imgArray.filter(i => typeof i === 'string' && i.length > 5)));
    const img1 = uniqueImgs[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
    const imgsArg = JSON.stringify(uniqueImgs).replace(/"/g, '&quot;');

    return `
      <div onclick="openProjectModal('${title.replace(/'/g, "\\'")}', '${tag.replace(/'/g, "\\'")}', '${cost.replace(/'/g, "\\'")}', '${location.replace(/'/g, "\\'")}', '${specs.replace(/'/g, "\\'")}', ${imgsArg})" class="project-card-item custom-dynamic-card flex flex-col group cursor-pointer border border-primary/50 p-4 bg-surface-container-low hover:border-primary transition-all rounded-sm shadow-xl relative">
        <div class="absolute top-2 left-2 bg-primary text-background font-label-caps text-[9px] font-bold px-2 py-0.5 rounded z-30 uppercase tracking-widest shadow">
          PROJECT SHOWCASE
        </div>
        <div class="aspect-[4/3] w-full overflow-hidden border border-outline-variant/30 relative mb-4">
          <div class="image-blur-vignette pointer-events-none"></div>
          <img alt="${title}" class="w-full h-full object-cover img-grayscale-hover" src="${img1}" onerror="this.src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'"/>
          <div class="absolute bottom-0 left-0 card-tag-badge border-t border-r border-outline-variant/30 px-3 py-1.5 z-20">
            <span class="font-label-caps text-[10px] text-primary font-bold">${tag}</span>
          </div>
          <div class="absolute top-3 right-3 bg-primary text-background font-label-caps text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-20">
            ${cost}
          </div>
        </div>
        <div class="flex justify-between items-start border-t border-outline-variant/30 pt-3">
          <div>
            <h3 class="font-label-ui text-sm text-on-surface uppercase tracking-wider mb-1 group-hover:text-primary transition-colors font-bold">${title}</h3>
            <p class="font-label-caps text-[11px] text-on-surface-variant opacity-80">${location}</p>
            <p class="font-label-caps text-[10px] text-primary/80 mt-1 line-clamp-1">${specs}</p>
          </div>
          <span class="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">open_in_new</span>
        </div>
      </div>
    `;
  }

  async function injectProjectsIntoPage() {
    const projects = await getStoredProjects();
    if (!projects || projects.length === 0) return;

    // Detect page context
    const path = window.location.pathname.toLowerCase();
    const isHome = path.endsWith("/") || path.includes("index.html") || path === "";

    if (isHome) {
      // Inject updated projects into Home Page category slide grids
      const categories = ['upcoming', 'ongoing', 'completed', 'residential', 'industrial', 'commercial', 'assembly'];
      categories.forEach((catKey) => {
        const wrapper = document.getElementById(`carousel-wrapper-${catKey}`);
        if (!wrapper) return;

        const firstSlideGrid = wrapper.querySelector('.category-carousel-slide[data-slide-index="0"] .grid');
        if (!firstSlideGrid) return;

        // Filter projects matching catKey
        const matchingProjects = projects.filter((p) => {
          const pCat = (p.category || "").toLowerCase();
          const pStatus = (p.status || "").toLowerCase();
          if (catKey === 'upcoming') return pStatus.includes('upcom') || pStatus.includes('draft');
          if (catKey === 'ongoing') return pStatus.includes('ongoi') || pStatus.includes('active');
          if (catKey === 'completed') return pStatus.includes('complet') || pStatus.includes('done');
          if (catKey === 'residential') return pCat.includes('residen') || pCat.includes('home') || pCat.includes('villa');
          if (catKey === 'industrial') return pCat.includes('indust');
          if (catKey === 'commercial') return pCat.includes('commer') || pCat.includes('retail');
          if (catKey === 'assembly') return pCat.includes('assembl') || pCat.includes('temple') || pCat.includes('cultur');
          return false;
        });

        matchingProjects.forEach((p) => {
          const cardId = p.id || ("custom-prj-" + (p.title || "").replace(/\s+/g, '-'));
          let existingContainer = firstSlideGrid.querySelector(`[data-project-id="${cardId}"]`);
          
          if (existingContainer) {
            existingContainer.innerHTML = createProjectCardHTML(p);
          } else {
            const tempDiv = document.createElement("div");
            tempDiv.setAttribute("data-project-id", cardId);
            tempDiv.className = "contents";
            tempDiv.innerHTML = createProjectCardHTML(p);
            if (firstSlideGrid.firstChild) {
              firstSlideGrid.insertBefore(tempDiv, firstSlideGrid.firstChild);
            } else {
              firstSlideGrid.appendChild(tempDiv);
            }
          }
        });
      });
      return;
    }

    const isResidential = path.includes("residential");
    const isIndustrial = path.includes("industrial");
    const isCommercial = path.includes("commercial");
    const isAssembly = path.includes("assembly");
    const isOngoing = path.includes("ongoing");
    const isCompleted = path.includes("completed");
    const isUpcoming = path.includes("upcoming");

    // Find the specific grid element for dedicated category pages
    let targetGridId = null;
    if (isCompleted) targetGridId = "completed-grid";
    else if (isOngoing) targetGridId = "ongoing-grid";
    else if (isUpcoming) targetGridId = "upcoming-grid";
    else if (isResidential) targetGridId = "residential-grid";
    else if (isIndustrial) targetGridId = "industrial-grid";
    else if (isCommercial) targetGridId = "commercial-grid";
    else if (isAssembly) targetGridId = "assembly-grid";

    if (!targetGridId) return;
    const grid = document.getElementById(targetGridId);
    if (!grid) return;

    // Collect valid project IDs for this page context
    const activeProjectIds = new Set();

    projects.forEach((p) => {
      const pCat = (p.category || "").toLowerCase();
      const pStatus = (p.status || "").toLowerCase();

      let shouldShow = false;

      // Strict filtering logic per page context
      if (isCompleted) {
        shouldShow = pStatus.includes("complet") || pStatus.includes("done");
      } else if (isOngoing) {
        shouldShow = pStatus.includes("ongoi") || pStatus.includes("active");
      } else if (isUpcoming) {
        shouldShow = pStatus.includes("upcom") || pStatus.includes("draft");
      } else if (isResidential) {
        shouldShow = pCat.includes("residen") || pCat.includes("home") || pCat.includes("villa");
      } else if (isIndustrial) {
        shouldShow = pCat.includes("indust");
      } else if (isCommercial) {
        shouldShow = pCat.includes("commer") || pCat.includes("retail");
      } else if (isAssembly) {
        shouldShow = pCat.includes("assembl") || pCat.includes("temple") || pCat.includes("cultur");
      }

      if (shouldShow) {
        const cardId = p.id || ("custom-prj-" + (p.title || "").replace(/\s+/g, '-'));
        activeProjectIds.add(cardId);

        let existingContainer = grid.querySelector(`[data-project-id="${cardId}"]`);
        if (existingContainer) {
          // Re-render updated project content
          existingContainer.innerHTML = createProjectCardHTML(p);
        } else {
          const tempDiv = document.createElement("div");
          tempDiv.setAttribute("data-project-id", cardId);
          tempDiv.innerHTML = createProjectCardHTML(p);
          if (grid.firstChild) {
            grid.insertBefore(tempDiv.firstElementChild, grid.firstChild);
          } else {
            grid.appendChild(tempDiv.firstElementChild);
          }
        }
      }
    });

    // Remove deleted or non-matching dynamic project cards from grid
    const dynamicCards = grid.querySelectorAll("[data-project-id]");
    dynamicCards.forEach((c) => {
      const cid = c.getAttribute("data-project-id");
      if (cid && cid.startsWith("proj-") && !activeProjectIds.has(cid)) {
        c.remove();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", injectProjectsIntoPage);
  window.addEventListener("load", injectProjectsIntoPage);
  window.addEventListener("achyutam-projects-updated", injectProjectsIntoPage);
  window.addEventListener("storage", (e) => {
    if (e.key === "achyutam_static_projects" || e.key === "achyutam_projects_cache" || e.key === "achyutam_all_projects") {
      injectProjectsIntoPage();
    }
  });

  // Auto-refresh project grids every 5 seconds for live cloud sync
  setInterval(injectProjectsIntoPage, 5000);
})();
