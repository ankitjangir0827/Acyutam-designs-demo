/**
 * ACHYUTAM BUILDER® — CUSTOM PROJECTS DYNAMIC LOADER
 * Automatically loads user-created projects from localStorage & Firebase into page grids.
 */

(function () {
  'use strict';

  // Helper to open project modal with gallery preview thumbnails
  window.openProjectModal = function (name, tag, ctc, loc, specs, img1, img2, img3, img4) {
    let modal = document.getElementById('project-detail-modal');
    if (modal) modal.remove();

    const mainImage = img1 || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
    const imageList = [
      mainImage,
      img2 || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      img3 || 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      img4 || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ];

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
              <div class="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-mono text-primary border border-primary/30 uppercase tracking-widest">
                ARCHITECTURAL PREVIEW VIEW
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

            <!-- Preview Image Gallery Thumbnails (Screenshot 1 Style) -->
            <div>
              <label class="block font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 font-bold">
                Project Image Previews (Click to Switch View):
              </label>
              <div class="grid grid-cols-4 gap-2" id="pm-thumbnails">
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
    const img1 = p.image1 || p.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
    const img2 = p.image2 || img1;

    return `
      <div onclick="openProjectModal('${title.replace(/'/g, "\\'")}', '${tag.replace(/'/g, "\\'")}', '${cost.replace(/'/g, "\\'")}', '${location.replace(/'/g, "\\'")}', '${specs.replace(/'/g, "\\'")}', '${img1}', '${img2}')" class="project-card-item custom-dynamic-card flex flex-col group cursor-pointer border border-primary/50 p-4 bg-surface-container-low hover:border-primary transition-all rounded-sm shadow-xl relative">
        <div class="absolute top-2 left-2 bg-primary text-background font-label-caps text-[9px] font-bold px-2 py-0.5 rounded z-30 uppercase tracking-widest shadow">
          PROJECT showcase
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
    const isHome = path.endsWith("/") || path.includes("index.html");
    if (isHome) return; // Keep Home Page in its exact original state

    const isResidential = path.includes("residential");
    const isIndustrial = path.includes("industrial");
    const isCommercial = path.includes("commercial");
    const isAssembly = path.includes("assembly");
    const isOngoing = path.includes("ongoing");
    const isCompleted = path.includes("completed");
    const isUpcoming = path.includes("upcoming");

    // Strictly find ONLY the specific grid element for the active page
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
        const existing = grid.querySelector(`[data-project-id="${cardId}"]`);
        if (!existing) {
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
  }

  document.addEventListener("DOMContentLoaded", injectProjectsIntoPage);
  window.addEventListener("load", injectProjectsIntoPage);
})();
