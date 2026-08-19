/**
 * ============================================================================
 * ACHYUTAM BUILDER® — STATIC GITHUB PAGES ARCHITECTURE ADMIN CONTROLLER
 * Lightweight, high-performance in-memory & localStorage Project Manager
 * Supports direct Export/Download & Clipboard Copy of `projects.json`
 * ============================================================================
 */

// Storage Keys
const STORAGE_KEY = "achyutam_static_projects";
const DEFAULT_JSON_PATH = "./projects.json";

// In-Memory State
let allProjects = [];
let filteredProjects = [];
let currentFilterStatus = "all";
let currentFilterCategory = "all";
let searchQuery = "";
let editingProjectId = null;
let projectToDeleteId = null;
let pendingLocalFile1 = null;
let pendingLocalFile2 = null;

// Initial Fallback Projects if JSON fetch fails in strict file:// protocol
const FALLBACK_SEED_PROJECTS = [
  {
    id: "proj-madhavkirti",
    title: "Dr. Madhavkirti Prabhuji Estate",
    clientName: "Dr. Madhavkirti Prabhuji",
    location: "Tree Road Radhakund, Mathura U.P.",
    area: "36,000 sq ft",
    description:
      "Grand G+2 luxury spiritual estate and ancestral residence featuring sprawling arched courtyards, traditional Jharokha stone balconies, Makrana marble floors, and sustainable passive cooling design.",
    category: "Residential",
    image1:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    status: "Ongoing",
    featured: true,
    createdAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "proj-narottam",
    title: "Narottam Ji Jangir Residence",
    clientName: "Narottam Ji Jangir",
    location: "Radha Kund Mathura U.P.",
    area: "8,500 sq ft",
    description:
      "Bespoke residential estate structure with double-height central atrium, cantilevered sandstone balconies, handcrafted wooden carvings, and integrated rainwater harvesting reservoir.",
    category: "Residential",
    image1:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    status: "Ongoing",
    featured: true,
    createdAt: "2026-08-02T10:00:00.000Z",
  },
  {
    id: "proj-mahavir",
    title: "Mahavir Ji Kichar Villa",
    clientName: "Mahavir Ji Kichar",
    location: "Sikar, Rajasthan",
    area: "5,200 sq ft",
    description:
      "G+1/G+2 contemporary residential villa utilizing thermal double-wall masonry, insulated tinted glazing, private terrace gardens, and modern architectural louvers.",
    category: "Residential",
    image1:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?auto=format&fit=crop&w=1200&q=80",
    status: "Ongoing",
    featured: false,
    createdAt: "2026-08-03T10:00:00.000Z",
  },
  {
    id: "proj-shree-cement",
    title: "SHREE CEMENT Ltd. Industrial Plant",
    clientName: "SHREE CEMENT Ltd.",
    location: "Gothra Nawalgarh, Rajasthan",
    area: "120,000 sq ft",
    description:
      "Heavy industrial cement manufacturing plant expansion, structural steel clinker storage silos, high-load machinery foundations, and automated logistics bays.",
    category: "Industrial",
    image1:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    status: "Ongoing",
    featured: true,
    createdAt: "2026-08-05T10:00:00.000Z",
  },
  {
    id: "proj-temple-achyutam",
    title: "Achyutam Grand Temple & Cultural Hall",
    clientName: "Shri Krishna Mandir Trust",
    location: "Vrindavan / Khatu Shyamji Corridor",
    area: "45,000 sq ft",
    description:
      "Classical Nagara-style stone temple with hand-carved Makrana marble pillars, sacred circumambulatory mandapam, stepped water kund, and 1,500-seat acoustic assembly hall.",
    category: "Temples & Cultural",
    image1:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    status: "Ongoing",
    featured: true,
    createdAt: "2026-08-07T10:00:00.000Z",
  },
  {
    id: "proj-bhagirath",
    title: "Bhagirath Mal Ji Khyaliya Villa",
    clientName: "Bhagirath Mal Ji Khyaliya (CRPF)",
    location: "Sikar, Rajasthan",
    area: "5,800 sq ft",
    description:
      "Exquisite G+2 completed residential estate showcasing precision cantilevered stone balconies, teak woodwork, and serene central landscaped courtyard.",
    category: "Residential",
    image1:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    status: "Completed",
    featured: true,
    createdAt: "2026-07-01T10:00:00.000Z",
  },
  {
    id: "proj-titanium",
    title: "The Titanium Tower Corporate HQ",
    clientName: "Vardhman Commercial Group",
    location: "Vaishali Nagar, Jaipur",
    area: "42,000 sq ft",
    description:
      "Completed Grade-A boutique commercial tower featuring double-skin acoustic glass curtain walling, central executive atrium, and 3-level underground parking.",
    category: "Commercial",
    image1:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
    status: "Completed",
    featured: true,
    createdAt: "2026-07-07T10:00:00.000Z",
  },
  {
    id: "proj-horizon",
    title: "The Horizon Glass Pavilions",
    clientName: "Singhania Luxury Living",
    location: "Civil Lines, Jaipur",
    area: "14,000 sq ft",
    description:
      "Upcoming ultra-luxury residential penthouses and duplexes featuring 360-degree glass facades, private infinity edge sky-pools, and biometric private elevator foyer.",
    category: "Residential",
    image1:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    status: "Upcoming",
    featured: true,
    createdAt: "2026-08-10T10:00:00.000Z",
  },
  {
    id: "proj-metro-hub",
    title: "Metro Hub Commercial Plaza",
    clientName: "Jaipur Infrastructure Partners",
    location: "Mansarovar, Jaipur",
    area: "55,000 sq ft",
    description:
      "Upcoming 6-storey retail & grade-A office hybrid complex with high-speed glass capsule elevators, solar roof canopy, and open sky dining promenade.",
    category: "Commercial",
    image1:
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    status: "Upcoming",
    featured: false,
    createdAt: "2026-08-11T10:00:00.000Z",
  },
  {
    id: "proj-apex-solar",
    title: "Apex Solar & Automated Logistics Park",
    clientName: "North-West Freight Corridor",
    location: "Bhiwadi Mega Hub, Rajasthan",
    area: "160,000 sq ft",
    description:
      "Next-generation green warehouse facility with 100% net-zero solar generation, FM2 tolerance high-flatness flooring, and 24 automated loading docks.",
    category: "Industrial",
    image1:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    status: "Upcoming",
    featured: true,
    createdAt: "2026-08-12T10:00:00.000Z",
  },
  {
    id: "proj-radha-govind-hall",
    title: "Radha Govind Satsang Dham & Spiritual Retreat",
    clientName: "Shri Radha Rani Seva Sansthan",
    location: "Barsana Road, Mathura U.P.",
    area: "62,000 sq ft",
    description:
      "Upcoming sacred cultural retreat featuring monolithic sandstone colonnades, a 2,500-capacity acoustic prayer hall, central reflection lotus pond, and solar-powered community kitchens.",
    category: "Temples & Cultural",
    image1:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
    status: "Upcoming",
    featured: true,
    createdAt: "2026-08-13T10:00:00.000Z",
  },
  {
    id: "proj-marwar-courtyard",
    title: "The Marwar Courtyard Heritage Villas",
    clientName: "Kalyan Heritage Developers",
    location: "Piprali Road, Sikar, Rajasthan",
    area: "28,000 sq ft",
    description:
      "An upcoming enclave of 8 bespoke boutique villas blending Jodhpur pink sandstone carvings, passive geothermal airflow cooling, plunge pools, and double-height living salons.",
    category: "Residential",
    image1:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    status: "Upcoming",
    featured: false,
    createdAt: "2026-08-14T10:00:00.000Z",
  },
  {
    id: "proj-crest-business-park",
    title: "The Crest Tech & IT Park",
    clientName: "AeroCity Corporate Spaces",
    location: "Sitapura Industrial Area, Jaipur",
    area: "85,000 sq ft",
    description:
      "State-of-the-art upcoming IT tower with IGBC Platinum Green Building design, double-glazed low-E facades, EV charging plazas, and an open terrace amphitheater.",
    category: "Commercial",
    image1:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
    status: "Upcoming",
    featured: false,
    createdAt: "2026-08-15T10:00:00.000Z",
  },
];

function checkAdminAuthGuard() {
  const userStr = localStorage.getItem("achyutam_user");
  const guard = document.getElementById("admin-access-guard");

  const currentAuthUser = window.AchyutamFirebase?.auth?.currentUser;
  if (currentAuthUser) {
    const cleanEmail = (currentAuthUser.email || "").toLowerCase().trim();
    if (cleanEmail !== "ankitjangir529@gmail.com") {
      if (guard) {
        guard.classList.remove("hidden");
        guard.classList.add("flex");
      }
      if (window.AchyutamFirebase?.signOutUser) {
        window.AchyutamFirebase.signOutUser();
      }
      return false;
    }
  }

  if (!userStr) {
    if (guard) {
      guard.classList.remove("hidden");
      guard.classList.add("flex");
    }
    return false;
  }
  try {
    const user = JSON.parse(userStr);
    const userEmail = (user.email || "").toLowerCase().trim();
    if (userEmail !== "ankitjangir529@gmail.com") {
      if (guard) {
        guard.classList.remove("hidden");
        guard.classList.add("flex");
      }
      if (window.AchyutamFirebase?.signOutUser) {
        window.AchyutamFirebase.signOutUser();
      }
      return false;
    }
    if (guard) guard.classList.add("hidden");
    return true;
  } catch (err) {
    console.error("Auth check error:", err);
    if (guard) {
      guard.classList.remove("hidden");
      guard.classList.add("flex");
    }
    return false;
  }
}

/**
 * ============================================================================
 * 1. INITIALIZATION & DATA LOADING
 * ============================================================================
 */
async function initAdminPortal() {
  console.log("🚀 Initializing Achyutam Static Architecture Admin Portal...");

  // checkAdminAuthGuard();

  if (window.AchyutamFirebase?.auth) {
    window.AchyutamFirebase.onAuthStateChanged(
      window.AchyutamFirebase.auth,
      (user) => {
        if (
          !user ||
          (user.email || "").toLowerCase().trim() !== "ankitjangir529@gmail.com"
        ) {
          const guard = document.getElementById("admin-access-guard");
          if (guard) {
            guard.classList.remove("hidden");
            guard.classList.add("flex");
          }
        } else {
          const guard = document.getElementById("admin-access-guard");
          if (guard) guard.classList.add("hidden");
        }
      },
    );
  }

  // Load user data from localStorage if existing
  const localSaved = localStorage.getItem(STORAGE_KEY);
  if (localSaved) {
    try {
      allProjects = JSON.parse(localSaved);
      console.log(
        `📦 Loaded ${allProjects.length} projects from browser storage`,
      );
    } catch (err) {
      console.warn(
        "Could not parse localStorage projects, fetching projects.json...",
        err,
      );
    }
  }

  // If no projects in localStorage, fetch from projects.json
  if (!allProjects || allProjects.length === 0) {
    try {
      const response = await fetch(DEFAULT_JSON_PATH);
      if (response.ok) {
        allProjects = await response.json();
        console.log(
          `📁 Loaded ${allProjects.length} projects from ${DEFAULT_JSON_PATH}`,
        );
        saveProjectsToLocalStorage();
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      console.warn(
        "Fetch from projects.json failed (possibly local file protocol), using fallback seed:",
        err,
      );
      allProjects = [...FALLBACK_SEED_PROJECTS];
      saveProjectsToLocalStorage();
    }
  }

  // Update UI and Statistics
  renderProjectsTable();
  updateStatistics();
  setupEventListeners();
  updateImagePreviews();
}

/**
 * Persist current state to localStorage
 */
function saveProjectsToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProjects));
    // Also save to global cache key for other frontend pages
    localStorage.setItem(
      "achyutam_projects_cache",
      JSON.stringify(allProjects),
    );
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
}

/**
 * ============================================================================
 * 2. STATISTICS & COUNTERS
 * ============================================================================
 */
function updateStatistics() {
  const total = allProjects.length;
  const upcoming = allProjects.filter(
    (p) => (p.status || "").toLowerCase() === "upcoming",
  ).length;
  const ongoing = allProjects.filter(
    (p) => (p.status || "").toLowerCase() === "ongoing",
  ).length;
  const completed = allProjects.filter(
    (p) => (p.status || "").toLowerCase() === "completed",
  ).length;

  const totalEl = document.getElementById("stat-total-projects");
  const upcomingEl = document.getElementById("stat-upcoming-count");
  const ongoingEl = document.getElementById("stat-ongoing-count");
  const completedEl = document.getElementById("stat-completed-count");
  const filteredCountEl = document.getElementById("filtered-projects-count");

  if (totalEl) totalEl.textContent = total;
  if (upcomingEl) upcomingEl.textContent = upcoming;
  if (ongoingEl) ongoingEl.textContent = ongoing;
  if (completedEl) completedEl.textContent = completed;
  if (filteredCountEl)
    filteredCountEl.textContent = `${filteredProjects.length} Projects`;
}

/**
 * ============================================================================
 * 3. FILTERING & SEARCH ENGINE
 * ============================================================================
 */
function applyFilters() {
  filteredProjects = allProjects.filter((project) => {
    // 1. Status Filter
    const matchesStatus =
      currentFilterStatus === "all" ||
      (project.status || "").toLowerCase() ===
        currentFilterStatus.toLowerCase();

    // 2. Category Filter
    const matchesCategory =
      currentFilterCategory === "all" ||
      (project.category || "").toLowerCase() ===
        currentFilterCategory.toLowerCase();

    // 3. Search Query
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (project.title || "").toLowerCase().includes(q) ||
      (project.clientName || "").toLowerCase().includes(q) ||
      (project.location || "").toLowerCase().includes(q) ||
      (project.area || "").toLowerCase().includes(q) ||
      (project.category || "").toLowerCase().includes(q) ||
      (project.description || "").toLowerCase().includes(q);

    return matchesStatus && matchesCategory && matchesSearch;
  });

  renderProjectsTable();
  updateStatistics();
}

export function setStatusFilter(status) {
  currentFilterStatus = status;

  // Update button visual styles
  for (const btn of document.querySelectorAll(".filter-status-chip")) {
    const btnStatus = btn.dataset.status;
    if (btnStatus === status) {
      btn.className =
        "filter-status-chip px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider bg-primary text-black transition-all cursor-pointer shadow-md";
    } else {
      btn.className =
        "filter-status-chip px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium tracking-wider bg-surface-container-low text-on-surface-variant hover:text-primary border border-outline-variant/30 transition-all cursor-pointer";
    }
  }

  applyFilters();
}

export function setCategoryFilter(category) {
  currentFilterCategory = category;
  applyFilters();
}

export function handleSearchInput(query) {
  searchQuery = query;
  applyFilters();
}

/**
 * ============================================================================
 * 4. TABLE RENDERING & UI GENERATION
 * ============================================================================
 */
function renderProjectsTable() {
  const tbody = document.getElementById("projects-table-body");
  if (!tbody) return;

  if (filteredProjects.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-16 text-center text-on-surface-variant">
          <div class="flex flex-col items-center justify-center gap-3 font-mono">
            <span class="material-symbols-outlined text-4xl text-primary/60">folder_off</span>
            <span class="text-sm font-semibold">No architectural projects found matching criteria</span>
            <p class="text-xs opacity-70">Try adjusting your search query, status filters, or add a new project above.</p>
            <button onclick="window.AchyutamAdmin.resetFilters()" class="mt-2 px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 rounded-lg text-primary text-xs uppercase tracking-wider">
              Reset Filters
            </button>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredProjects
    .map((p, index) => {
      const status = p.status || "Ongoing";
      let statusClass = "bg-amber-500/10 text-amber-400 border-amber-500/30";
      let statusDotColor = "bg-amber-400";
      if (status === "Completed") {
        statusClass =
          "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
        statusDotColor = "bg-emerald-400";
      } else if (status === "Upcoming") {
        statusClass = "bg-blue-500/10 text-blue-400 border-blue-500/30";
        statusDotColor = "bg-blue-400";
      }

      const categoryBadge = getCategoryBadge(p.category);
      const img1 =
        p.image1 ||
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80";
      const img2 = p.image2 || img1;

      return `
      <tr class="hover:bg-surface-container-low/60 transition-colors border-b border-outline-variant/20 group">
        
        <!-- 1. Thumbnails & Project / Client Info -->
        <td class="py-2.5 px-3">
          <div class="flex items-center gap-2.5">
            
            <!-- Dual Thumbnail Previews (Image 1 & Image 2) -->
            <div class="flex items-center -space-x-3 cursor-pointer shrink-0" onclick="window.AchyutamAdmin.previewProjectImages('${escapeHtml(p.id)}')" title="Click to view full-size images">
              <div class="w-9 h-9 rounded-lg overflow-hidden border border-outline-variant/40 bg-surface-container shadow-sm group-hover:scale-105 transition-transform">
                <img src="${escapeHtml(img1)}" alt="Image 1" class="w-full h-full object-cover" onerror="this.src='photos and videos/logo.png'"/>
              </div>
              <div class="w-9 h-9 rounded-lg overflow-hidden border-2 border-surface bg-surface-container shadow-md group-hover:scale-105 transition-transform">
                <img src="${escapeHtml(img2)}" alt="Image 2" class="w-full h-full object-cover" onerror="this.src='photos and videos/logo.png'"/>
              </div>
            </div>

            <!-- Title & Client Details -->
            <div class="min-w-0 max-w-[180px] sm:max-w-xs md:max-w-sm">
              <div class="flex items-center gap-1.5">
                <h4 class="font-bold text-xs sm:text-sm text-on-surface group-hover:text-primary transition-colors truncate font-sans">
                  ${escapeHtml(p.title || "Untitled Project")}
                </h4>
                ${p.featured ? '<span class="px-1 py-0.5 rounded bg-primary/20 text-primary text-[8px] font-mono font-bold tracking-widest uppercase">STAR</span>' : ""}
              </div>
              <p class="text-[10px] text-on-surface-variant flex items-center gap-1 mt-0.5 truncate">
                <span class="material-symbols-outlined text-[12px] text-primary shrink-0">person</span>
                <span class="truncate">${escapeHtml(p.clientName || "Private Client")}</span>
                <span class="opacity-40">•</span>
                <span class="material-symbols-outlined text-[12px] text-primary shrink-0">location_on</span>
                <span class="truncate">${escapeHtml(p.location || "Sikar, Rajasthan")}</span>
              </p>
            </div>

          </div>
        </td>

        <!-- 2. Typology Category -->
        <td class="py-2.5 px-2 whitespace-nowrap">
          ${categoryBadge}
        </td>

        <!-- 3. Scale / Built-Up Area -->
        <td class="py-2.5 px-2 whitespace-nowrap font-mono text-[11px] text-on-surface-variant">
          <div class="flex items-center gap-1">
            <span class="material-symbols-outlined text-xs text-outline">straighten</span>
            <span>${escapeHtml(p.area || "N/A")}</span>
          </div>
        </td>

        <!-- 4. Status Badge & Quick Dropdown Switch -->
        <td class="py-2.5 px-2 whitespace-nowrap">
          <div class="flex items-center gap-1.5">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${statusClass}">
              <span class="w-1.5 h-1.5 rounded-full ${statusDotColor}"></span>
              <span>${status}</span>
            </span>

            <!-- Quick Status Select Toggle -->
            <select onchange="window.AchyutamAdmin.quickUpdateStatus('${escapeHtml(p.id)}', this.value)" title="Quickly switch status" class="bg-surface-container border border-outline-variant/40 rounded py-0.5 px-1 text-[9px] font-mono text-on-surface focus:border-primary focus:outline-none cursor-pointer">
              <option value="Upcoming" ${status === "Upcoming" ? "selected" : ""}>Upcoming</option>
              <option value="Ongoing" ${status === "Ongoing" ? "selected" : ""}>Ongoing</option>
              <option value="Completed" ${status === "Completed" ? "selected" : ""}>Completed</option>
            </select>
          </div>
        </td>

        <!-- 5. Date / Order -->
        <td class="py-2.5 px-2 whitespace-nowrap font-mono text-[10px] text-on-surface-variant/70 hidden lg:table-cell">
          ${formatDate(p.createdAt)}
        </td>

        <!-- 6. Action Buttons (Edit, Delete, Preview) -->
        <td class="py-2.5 px-3 text-right whitespace-nowrap">
          <div class="flex items-center justify-end gap-1">
            
            <!-- Preview Images Button -->
            <button onclick="window.AchyutamAdmin.previewProjectImages('${escapeHtml(p.id)}')" title="Preview Images" class="p-1 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-sm">visibility</span>
            </button>

            <!-- Edit Button -->
            <button onclick="window.AchyutamAdmin.editProject('${escapeHtml(p.id)}')" title="Edit Project Details" class="p-1 text-on-surface-variant hover:text-amber-400 hover:bg-surface-container rounded transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-sm">edit</span>
            </button>

            <!-- Delete Button -->
            <button onclick="window.AchyutamAdmin.promptDeleteProject('${escapeHtml(p.id)}')" title="Delete Project" class="p-1 text-on-surface-variant hover:text-red-400 hover:bg-surface-container rounded transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-sm">delete</span>
            </button>

          </div>
        </td>

      </tr>
    `;
    })
    .join("");
}

function getCategoryBadge(category = "Residential") {
  let badgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/30";
  let icon = "home";

  if (category === "Industrial") {
    badgeClass = "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    icon = "factory";
  } else if (category === "Commercial") {
    badgeClass = "bg-blue-500/10 text-blue-400 border-blue-500/30";
    icon = "business";
  } else if (category === "Temples & Cultural") {
    badgeClass = "bg-orange-500/10 text-orange-400 border-orange-500/30";
    icon = "temple_hindu";
  }

  return `
    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border ${badgeClass}">
      <span class="material-symbols-outlined text-[13px]">${icon}</span>
      <span>${escapeHtml(category)}</span>
    </span>
  `;
}

/**
 * ============================================================================
 * 5. PROJECT CRUD OPERATIONS (IN-MEMORY & LOCALSTORAGE)
 * ============================================================================
 */

export function handleLocalImageSelect(event, num) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (num === 1) {
    pendingLocalFile1 = file;
    const label = document.getElementById("file-label-image1");
    if (label) label.textContent = `SELECTED: ${file.name.substring(0, 18)}`;
  } else if (num === 2) {
    pendingLocalFile2 = file;
    const label = document.getElementById("file-label-image2");
    if (label) label.textContent = `SELECTED: ${file.name.substring(0, 18)}`;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const previewImg = document.getElementById(`preview-image-${num}`);
    const placeholder = document.getElementById(`placeholder-image-${num}`);
    if (previewImg) {
      previewImg.src = e.target.result;
      previewImg.classList.remove("hidden");
    }
    if (placeholder) placeholder.classList.add("hidden");
  };
  reader.readAsDataURL(file);
}

export function updateImagePreviews() {
  const img1Input = document.getElementById("project-image1")?.value.trim();
  const img2Input = document.getElementById("project-image2")?.value.trim();

  if (img1Input && !pendingLocalFile1) {
    const p1 = document.getElementById("preview-image-1");
    const ph1 = document.getElementById("placeholder-image-1");
    if (p1) {
      p1.src = img1Input;
      p1.classList.remove("hidden");
    }
    if (ph1) ph1.classList.add("hidden");
  } else if (!pendingLocalFile1) {
    const p1 = document.getElementById("preview-image-1");
    const ph1 = document.getElementById("placeholder-image-1");
    if (p1) p1.classList.add("hidden");
    if (ph1) ph1.classList.remove("hidden");
  }

  if (img2Input && !pendingLocalFile2) {
    const p2 = document.getElementById("preview-image-2");
    const ph2 = document.getElementById("placeholder-image-2");
    if (p2) {
      p2.src = img2Input;
      p2.classList.remove("hidden");
    }
    if (ph2) ph2.classList.add("hidden");
  } else if (!pendingLocalFile2) {
    const p2 = document.getElementById("preview-image-2");
    const ph2 = document.getElementById("placeholder-image-2");
    if (p2) p2.classList.add("hidden");
    if (ph2) ph2.classList.remove("hidden");
  }
}

export async function handleProjectFormSubmit(event) {
  event.preventDefault();

  const title = document.getElementById("project-title")?.value.trim();
  const clientName =
    document.getElementById("project-client")?.value.trim() || "Private Client";
  const location =
    document.getElementById("project-location")?.value.trim() ||
    "Rajasthan, India";
  const area =
    document.getElementById("project-area")?.value.trim() || "Bespoke Scale";
  const category =
    document.getElementById("project-category")?.value || "Residential";
  const status = document.getElementById("project-status")?.value || "Ongoing";
  const description =
    document.getElementById("project-description")?.value.trim() || "";

  if (!title) {
    showToast("⚠️ Please enter a project title", true);
    return;
  }

  let image1 = document.getElementById("project-image1")?.value.trim() || "";
  let image2 = document.getElementById("project-image2")?.value.trim() || "";

  // Cloudinary target folder path
  const folderPath = window.AchyutamCloudinary
    ? window.AchyutamCloudinary.buildCloudinaryFolderPath(status, category, title)
    : `achyutam_projects/${status}/${category}/${title.replace(/[^\w-]/g, '_')}`;

  if (pendingLocalFile1 || pendingLocalFile2) {
    showToast("☁️ Uploading local photo(s) to Cloudinary...");
  }

  if (pendingLocalFile1) {
    try {
      if (window.AchyutamCloudinary?.uploadImageToCloudinary) {
        const res = await window.AchyutamCloudinary.uploadImageToCloudinary(pendingLocalFile1, folderPath, {
          title, clientName, category, status
        });
        if (res && res.secure_url) {
          image1 = res.secure_url;
        }
      }
    } catch (err) {
      console.warn("Upload local photo 1 error:", err);
    }
  }

  if (pendingLocalFile2) {
    try {
      if (window.AchyutamCloudinary?.uploadImageToCloudinary) {
        const res = await window.AchyutamCloudinary.uploadImageToCloudinary(pendingLocalFile2, folderPath, {
          title, clientName, category, status
        });
        if (res && res.secure_url) {
          image2 = res.secure_url;
        }
      }
    } catch (err) {
      console.warn("Upload local photo 2 error:", err);
    }
  }

  if (!image1) {
    image1 = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
  }
  if (!image2) {
    image2 = image1;
  }

  // Ensure f_auto,q_auto transformations
  if (image1.includes("res.cloudinary.com") && !image1.includes("f_auto")) {
    image1 = image1.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
  }
  if (image2.includes("res.cloudinary.com") && !image2.includes("f_auto")) {
    image2 = image2.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
  }

  // Trigger POST /api/admin/projects/upload to register context metadata & searchable tags on Cloudinary
  try {
    if (window.AchyutamCloudinary?.uploadProjectToApi) {
      await window.AchyutamCloudinary.uploadProjectToApi({
        project_title: title,
        status: status,
        category: category,
        projectName: title,
        description: description,
        location: location,
        client_name: clientName,
        completion_year: "2026",
        image1: image1,
        image2: image2
      });
    }
  } catch (apiErr) {
    console.warn("Cloudinary upload controller notice:", apiErr);
  }

  if (editingProjectId) {
    // Update existing project
    const idx = allProjects.findIndex((p) => p.id === editingProjectId);
    if (idx !== -1) {
      allProjects[idx] = {
        ...allProjects[idx],
        title,
        clientName,
        location,
        area,
        category,
        image1,
        image2,
        status,
        description,
        updatedAt: new Date().toISOString(),
      };
      showToast(`✅ Project "${title}" updated successfully!`);
    }
    resetProjectForm();
  } else {
    // Create new project
    const newProject = {
      id: `proj-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      clientName,
      location,
      area,
      category,
      image1,
      image2,
      status,
      description,
      featured: false,
      createdAt: new Date().toISOString(),
    };

    allProjects.unshift(newProject);
    showToast(`✅ New project "${title}" added successfully!`);
    resetProjectForm();
  }

  saveProjectsToLocalStorage();
  applyFilters();
}

export function editProject(id) {
  const project = allProjects.find((p) => p.id === id);
  if (!project) return;

  editingProjectId = id;

  // Populate form fields
  document.getElementById("project-title").value = project.title || "";
  document.getElementById("project-client").value = project.clientName || "";
  document.getElementById("project-location").value = project.location || "";
  document.getElementById("project-area").value = project.area || "";
  document.getElementById("project-category").value =
    project.category || "Residential";
  document.getElementById("project-image1").value = project.image1 || "";
  document.getElementById("project-image2").value = project.image2 || "";
  document.getElementById("project-status").value = project.status || "Ongoing";
  document.getElementById("project-description").value =
    project.description || "";

  pendingLocalFile1 = null;
  pendingLocalFile2 = null;

  // Update form header and submit button
  const heading = document.getElementById("form-heading");
  const subHeading = document.getElementById("form-subheading");
  const submitBtn = document.getElementById("btn-submit-project");
  const cancelBtn = document.getElementById("btn-cancel-edit");

  if (heading) {
    heading.innerHTML = `
      <span class="material-symbols-outlined text-amber-400 text-2xl">edit_note</span>
      <span>EDIT ARCHITECTURAL PROJECT</span>
    `;
  }
  if (subHeading)
    subHeading.textContent = `Modifying project: "${project.title}" (ID: ${project.id})`;
  if (submitBtn) {
    submitBtn.innerHTML = `
      <span class="material-symbols-outlined text-base">save</span>
      <span>UPDATE PROJECT DATA</span>
    `;
  }
  if (cancelBtn) cancelBtn.classList.remove("hidden");

  updateImagePreviews();

  // Scroll smoothly to form container
  document
    .getElementById("project-form-container")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function resetProjectForm() {
  editingProjectId = null;
  pendingLocalFile1 = null;
  pendingLocalFile2 = null;

  const form = document.getElementById("project-form");
  if (form) form.reset();

  const l1 = document.getElementById("file-label-image1");
  const l2 = document.getElementById("file-label-image2");
  if (l1) l1.textContent = "CHOOSE LOCAL PHOTO 1";
  if (l2) l2.textContent = "CHOOSE LOCAL PHOTO 2";

  const heading = document.getElementById("form-heading");
  const subHeading = document.getElementById("form-subheading");
  const submitBtn = document.getElementById("btn-submit-project");
  const cancelBtn = document.getElementById("btn-cancel-edit");

  if (heading) {
    heading.innerHTML = `
      <span class="material-symbols-outlined text-primary text-2xl">add_circle</span>
      <span>ADD NEW ARCHITECTURAL PROJECT</span>
    `;
  }
  if (subHeading)
    subHeading.textContent =
      "Manage Cloudinary architectural projects directly from your dashboard.";
  if (submitBtn) {
    submitBtn.innerHTML = `
      <span class="material-symbols-outlined text-base">add_circle</span>
      <span>ADD TO PORTFOLIO</span>
    `;
  }
  if (cancelBtn) cancelBtn.classList.add("hidden");

  updateImagePreviews();
}

export function promptDeleteProject(id) {
  const project = allProjects.find((p) => p.id === id);
  if (!project) return;

  projectToDeleteId = id;
  const titleDisplay = document.getElementById("delete-project-title-display");
  if (titleDisplay) titleDisplay.textContent = `"${project.title}"`;

  const modal = document.getElementById("delete-confirm-modal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

export function closeDeleteModal() {
  projectToDeleteId = null;
  const modal = document.getElementById("delete-confirm-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

export function executeDeleteProject() {
  if (!projectToDeleteId) return;

  const project = allProjects.find((p) => p.id === projectToDeleteId);
  const title = project ? project.title : "Project";

  allProjects = allProjects.filter((p) => p.id !== projectToDeleteId);
  saveProjectsToLocalStorage();
  applyFilters();
  closeDeleteModal();

  showToast(`🗑️ Project "${title}" removed from active list`);
}

export function quickUpdateStatus(id, newStatus) {
  const idx = allProjects.findIndex((p) => p.id === id);
  if (idx !== -1) {
    allProjects[idx].status = newStatus;
    allProjects[idx].updatedAt = new Date().toISOString();
    saveProjectsToLocalStorage();
    applyFilters();
    showToast(
      `⚡ Status updated to "${newStatus}" for "${allProjects[idx].title}"`,
    );
  }
}

/**
 * ============================================================================
 * 6. EXPORT, DOWNLOAD & CLIPBOARD (STATIC GITHUB PAGES ENGINE)
 * ============================================================================
 */

/**
 * Export & download clean projects.json file
 */
export function downloadProjectsJSON() {
  try {
    const jsonString = JSON.stringify(allProjects, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "projects.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    showToast(
      "📁 projects.json downloaded! Replace projects.json in your local repo and push to GitHub.",
    );
  } catch (err) {
    console.error("Download error:", err);
    showToast(`Download failed: ${err.message}`, true);
  }
}

/**
 * Copy JSON data directly to clipboard for fast pasting
 */
export async function copyProjectsJSONToClipboard() {
  try {
    const jsonString = JSON.stringify(allProjects, null, 2);
    await navigator.clipboard.writeText(jsonString);
    showToast(
      "📋 projects.json content copied to clipboard! Paste directly into your file.",
    );
  } catch (err) {
    // Fallback for older browsers or if permission fails
    const textarea = document.createElement("textarea");
    textarea.value = JSON.stringify(allProjects, null, 2);
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    showToast("📋 JSON copied to clipboard!");
  }
}

/**
 * Import and replace active projects from a selected projects.json file
 */
export function importProjectsJSON(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (Array.isArray(parsed) && parsed.length > 0) {
        allProjects = parsed;
        saveProjectsToLocalStorage();
        applyFilters();
        showToast(
          `✅ Successfully imported ${parsed.length} projects from ${file.name}`,
        );
      } else {
        showToast(
          "⚠️ Invalid projects.json file (must be a non-empty array)",
          true,
        );
      }
    } catch (err) {
      showToast(`⚠️ Error parsing JSON file: ${err.message}`, true);
    }
  };
  reader.readAsText(file);
}

/**
 * Reset project data back to factory defaults
 */
export async function resetToDefaultProjects() {
  if (
    !confirm(
      "Are you sure you want to reset all project data back to the default portfolio? Any local modifications will be replaced.",
    )
  ) {
    return;
  }

  try {
    const res = await fetch(DEFAULT_JSON_PATH);
    if (res.ok) {
      allProjects = await res.json();
    } else {
      allProjects = [...FALLBACK_SEED_PROJECTS];
    }
    saveProjectsToLocalStorage();
    applyFilters();
    showToast("🔄 Portfolio reset to default projects.json");
  } catch (err) {
    console.warn("Fetch reset failed, defaulting to seed data:", err);
    allProjects = [...FALLBACK_SEED_PROJECTS];
    saveProjectsToLocalStorage();
    applyFilters();
    showToast("🔄 Portfolio reset to default seed projects");
  }
}

export function resetFilters() {
  currentFilterStatus = "all";
  currentFilterCategory = "all";
  searchQuery = "";

  const searchInput = document.getElementById("search-projects");
  const catSelect = document.getElementById("filter-category-select");
  if (searchInput) searchInput.value = "";
  if (catSelect) catSelect.value = "all";

  setStatusFilter("all");
}

/**
 * ============================================================================
 * 7. IMAGE PREVIEW HELPERS & MODAL
 * ============================================================================
 */
export function updateImagePreviews() {
  const url1 = document.getElementById("project-image1")?.value.trim();
  const url2 = document.getElementById("project-image2")?.value.trim();

  const preview1 = document.getElementById("preview-image-1");
  const preview2 = document.getElementById("preview-image-2");

  if (preview1) {
    if (url1) {
      preview1.src = url1;
      preview1.classList.remove("hidden");
      preview1.nextElementSibling?.classList.add("hidden");
    } else {
      preview1.src = "";
      preview1.classList.add("hidden");
      preview1.nextElementSibling?.classList.remove("hidden");
    }
  }

  if (preview2) {
    if (url2) {
      preview2.src = url2;
      preview2.classList.remove("hidden");
      preview2.nextElementSibling?.classList.add("hidden");
    } else {
      preview2.src = "";
      preview2.classList.add("hidden");
      preview2.nextElementSibling?.classList.remove("hidden");
    }
  }
}

export function previewProjectImages(id) {
  const project = allProjects.find((p) => p.id === id);
  if (!project) return;

  const modal = document.getElementById("image-preview-modal");
  const titleEl = document.getElementById("modal-preview-title");
  const img1 = document.getElementById("modal-preview-img-1");
  const img2 = document.getElementById("modal-preview-img-2");

  if (titleEl) titleEl.textContent = project.title || "Project Showcase";
  if (img1) img1.src = project.image1 || "photos and videos/logo.png";
  if (img2)
    img2.src = project.image2 || project.image1 || "photos and videos/logo.png";

  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

export function closeImagePreviewModal() {
  const modal = document.getElementById("image-preview-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

/**
 * ============================================================================
 * 8. TOAST NOTIFICATIONS & UTILITIES
 * ============================================================================
 */
export function showToast(message, isError = false) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `p-4 rounded-xl shadow-2xl flex items-center gap-3 text-xs border backdrop-blur-xl transition-all duration-300 transform translate-y-2 opacity-0 ${
    isError
      ? "bg-red-950/90 text-red-200 border-red-500/50 shadow-[0_10px_30px_rgba(239,68,68,0.3)]"
      : "bg-surface-container/95 text-on-surface border-primary/40 shadow-[0_10px_30px_rgba(255,119,34,0.25)]"
  }`;

  const icon = isError ? "error" : "check_circle";
  const iconColor = isError ? "text-red-400" : "text-primary";

  toast.innerHTML = `
    <span class="material-symbols-outlined text-lg ${iconColor}">${icon}</span>
    <span class="font-medium leading-relaxed font-sans">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  });

  // Auto remove after 3.5s
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(isoStr) {
  if (!isoStr) return "Active";
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (err) {
    console.warn("Date format error:", err);
    return "Active";
  }
}

function setupEventListeners() {
  window.closeImagePreviewModal = closeImagePreviewModal;
}

// Global Window Bindings for Inline HTML Callbacks
window.AchyutamAdmin = {
  handleProjectFormSubmit,
  handleLocalImageSelect,
  editProject,
  resetProjectForm,
  promptDeleteProject,
  closeDeleteModal,
  executeDeleteProject,
  quickUpdateStatus,
  downloadProjectsJSON,
  copyProjectsJSONToClipboard,
  importProjectsJSON,
  resetToDefaultProjects,
  resetFilters,
  setStatusFilter,
  setCategoryFilter,
  handleSearchInput,
  updateImagePreviews,
  previewProjectImages,
  showToast,
  getAllProjects: () => allProjects,
};

// Initialize on DOM Ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAdminPortal);
} else {
  initAdminPortal();
}
