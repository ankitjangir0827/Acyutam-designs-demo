/**
 * ACHYUTAM BUILDER® — CUSTOM PROJECTS DYNAMIC LOADER
 * Automatically loads user-created projects from localStorage & Firebase into page grids.
 */

(function () {
  'use strict';

  // Helper to open project modal with details
  window.openProjectModal = window.openProjectModal || function (name, tag, ctc, loc, specs, img1, img2) {
    let modal = document.getElementById('project-detail-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'project-detail-modal';
      modal.className = 'fixed inset-0 z-50 bg-black/85 backdrop-blur-md hidden flex items-center justify-center p-4 overflow-y-auto';
      modal.innerHTML = `
        <div class="bg-surface-container-lowest border border-outline-variant/40 rounded-lg max-w-3xl w-full p-6 shadow-2xl relative text-on-surface">
          <button onclick="closeProjectModal()" class="absolute top-4 right-4 text-on-surface-variant hover:text-primary text-2xl font-bold">&times;</button>
          <div class="mb-4 border-b border-outline-variant/30 pb-3">
            <span id="pm-tag" class="font-label-caps text-xs text-primary font-bold tracking-widest uppercase">TAG</span>
            <h2 id="pm-title" class="font-display-lg text-2xl text-on-surface font-bold mt-1">Project Name</h2>
            <p id="pm-loc" class="text-xs text-on-surface-variant opacity-80 mt-1">Location</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <img id="pm-img1" src="" alt="View 1" class="w-full h-56 object-cover rounded border border-outline-variant/30"/>
            <img id="pm-img2" src="" alt="View 2" class="w-full h-56 object-cover rounded border border-outline-variant/30"/>
          </div>
          <div class="bg-surface-container p-4 rounded border border-outline-variant/30 text-xs flex flex-col gap-2">
            <p><strong>Specifications / Detail:</strong> <span id="pm-specs"></span></p>
            <p><strong>Cost / Estimate:</strong> <span id="pm-ctc"></span></p>
          </div>
          <div class="mt-4 text-right">
            <a href="contact.html" class="inline-block px-5 py-2 bg-primary text-background font-bold text-xs uppercase tracking-wider rounded hover:bg-primary-container transition-all">Enquire About Project</a>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    document.getElementById('pm-tag').textContent = tag || 'FEATURED PROJECT';
    document.getElementById('pm-title').textContent = name || 'Project Details';
    document.getElementById('pm-loc').textContent = loc || 'Rajasthan / U.P.';
    document.getElementById('pm-specs').textContent = specs || 'High-end engineering & architectural execution.';
    document.getElementById('pm-ctc').textContent = ctc || 'Custom Quote Available';
    document.getElementById('pm-img1').src = img1 || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
    document.getElementById('pm-img2').src = img2 || img1 || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
    modal.classList.remove('hidden');
  };

  window.closeProjectModal = function () {
    const modal = document.getElementById('project-detail-modal');
    if (modal) modal.classList.add('hidden');
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
        const res = await fetch("./projects.json");
        if (res.ok) {
          projects = await res.json();
          try {
            localStorage.setItem("achyutam_projects_cache", JSON.stringify(projects));
          } catch(e) {}
        }
      } catch (err) {
        console.warn("Fetch ./projects.json error:", err);
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
