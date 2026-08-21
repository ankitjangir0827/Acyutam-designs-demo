/**
 * Global Security & Input Sanitization Helper
 */
window.sanitizeInput = function(str) {
  if (typeof str !== 'string') return str || '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

/**
 * Remove Invisible Unicode Characters & Formatting Helper
 */
window.removeAIFingerprint = function(codeText) {
  if (typeof codeText !== 'string') return codeText || '';
  return codeText.replace(/[\u200B\u200C\u200D\u2060\uFEFF]/g, '');
};

(() => {
  const themeStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
    @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap');

    /* Embedded Material Symbols Outlined Font Face Fallback */
    @font-face {
      font-family: 'Material Symbols Outlined';
      font-style: normal;
      font-weight: 100 700;
      font-display: block;
      src: url('https://fonts.gstatic.com/s/materialsymbolsoutlined/v367/kJF1BvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA6RzaxHMPdY43zj-jCxv3fzvRNU22ZXGJpEpjC_1v-p_4MrImHCIJIZrDCvHOem.ttf') format('truetype');
    }

    /* Material Symbols Outlined Font Family Rules */
    .material-symbols-outlined,
    span.material-symbols-outlined,
    i.material-symbols-outlined {
      font-family: 'Material Symbols Outlined' !important;
      font-style: normal !important;
      font-weight: normal !important;
      line-height: 1 !important;
      letter-spacing: normal !important;
      text-transform: none !important;
      font-feature-settings: 'liga' 1 !important;
      font-variant-ligatures: normal !important;
      display: inline-block !important;
      white-space: nowrap !important;
      word-wrap: normal !important;
      direction: ltr !important;
      -webkit-font-smoothing: antialiased !important;
      text-rendering: optimizeLegibility !important;
      -moz-osx-font-smoothing: grayscale !important;
    }


    /* Open Source 'Alex Brush' Font Integration for Cards & Script Accents */

    .font-alex-brush,
    .alex-brush,
    .card-script-font,
    .card-accent-script,
    .glass-panel .italic,
    .glass-panel-hero .italic,
    .project-card-item .italic,
    .project-card-item span.italic,
    .project-card-item h3 span,
    [id^="carousel-wrapper-"] span.italic,
    .project-card-subtitle {
      font-family: 'Alex Brush', cursive !important;
      font-weight: 400 !important;
    }

    /* Hardware Acceleration & Smooth 60 FPS Rendering */
    .glass-panel,
    .glass-panel-hero,
    .it-card-container,
    .project-card-item,
    header#main-header,
    #auth-modal > div {
      will-change: transform, opacity;
      transform: translateZ(0);
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }

    /* Dark Mode Root Overrides — Newsprint Chocolate & Cream Theme */
    body {
      background-color: #1A1412 !important;
      background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.055'/></svg>"),
                        radial-gradient(circle at 50% 50%, rgba(26, 20, 18, 0) 52%, rgba(15, 10, 8, 0.4) 100%),
                        radial-gradient(circle at 65% 50%, rgba(40, 30, 27, 1) 0%, rgba(40, 30, 27, 0.8) 15%, rgba(26, 20, 18, 0) 50%),
                        radial-gradient(circle at 30% 70%, rgba(54, 39, 35, 1) 0%, rgba(54, 39, 35, 0.7) 18%, rgba(26, 20, 18, 0) 50%),
                        radial-gradient(circle at 50% 15%, rgba(74, 52, 46, 0.9) 0%, rgba(74, 52, 46, 0.5) 20%, rgba(26, 20, 18, 0) 50%) !important;
      background-size: 120px 120px, auto, auto, auto, auto !important;
      background-blend-mode: overlay, normal, normal, normal, normal !important;
      background-attachment: fixed !important;
      color: #F5EBE6 !important;
    }

    /* Standard 0 Degree Normal Orientation for Logo Images */
    .logo-mark-flipped,
    img.logo-mark-flipped,
    img[src*="logo"],
    img[alt*="Logo"],
    img[alt*="logo"],
    a[title*="ACHYUTAM BUILDER"] img {
      transform: rotate(0deg) !important;
    }

    /* === 16:9 Image Responsiveness & Zero Distortion === */
    img,
    .project-card-item img,
    .it-card-container .it-card-image,
    .card-slideshow-container img,
    #right-img-container img,
    #left-img-container img,
    .aspect-\[4\/3\] img,
    .aspect-\[16\/9\] img {
      object-fit: cover !important;
      object-position: center !important;
    }

    @media (max-width: 768px) {
      /* Mobile Hero Proportional Heights & 16:9 Aspect Ratios */
      .hero-responsive-image-container,
      #hero-slider-bg-container,
      #left-img-container,
      #right-img-container {
        min-height: 50vh !important;
        max-height: 65vh !important;
      }

    #left-img-container,
    #right-img-container,
    #slideshow-bg > div {
      border: none !important;
      border-right: none !important;
      border-color: transparent !important;
    }
      
      .project-card-item .aspect-\[4\/3\],
      .project-card-item .aspect-\[16\/9\],
      .project-card-item .image-container {
        aspect-ratio: 16 / 9 !important;
        height: auto !important;
        min-height: 220px !important;
      }

      /* Mobile Header Refinements (< 768px): Hide text branding, show ONLY Logo Icon */
      header#main-header a[title*="ACHYUTAM BUILDER"] > div:nth-child(2),
      header#main-header .brand-text-container {
        display: none !important;
      }

      /* Compact Action Buttons on Mobile (< 768px): Hide text labels, show ONLY icons */
      #auth-header-btn #auth-btn-text,
      #header-enquire-btn span.enquire-text-label {
        display: none !important;
      }
      #header-enquire-btn {
        padding: 0.375rem 0.625rem !important;
      }
    }

    /* Light Mode Root Overrides — Editorial Warm Cream & Chocolate Theme */
    html.light-mode {
      color-scheme: light;
    }
    html.light-mode body {
      background-color: #F5EBE4 !important;
      background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.045'/></svg>"),
                        radial-gradient(circle at 50% 50%, rgba(245, 235, 228, 0) 52%, rgba(220, 205, 195, 0.3) 100%),
                        radial-gradient(circle at 65% 50%, rgba(250, 245, 240, 1) 0%, rgba(240, 228, 218, 0.8) 18%, rgba(245, 235, 228, 0) 50%),
                        radial-gradient(circle at 30% 70%, rgba(238, 224, 212, 1) 0%, rgba(226, 209, 195, 0.7) 20%, rgba(245, 235, 228, 0) 50%),
                        radial-gradient(circle at 52% 15%, rgba(212, 187, 167, 0.8) 0%, rgba(212, 187, 167, 0.4) 22%, rgba(245, 235, 228, 0) 50%) !important;
      background-size: 120px 120px, auto, auto, auto, auto !important;
      background-blend-mode: overlay, normal, normal, normal, normal !important;
      background-attachment: fixed !important;
      color: #261C19 !important;
    }

    /* Card Badges Glass & Backdrop Blur Styling (Dark & Light) */
    #animated-hamburger-btn.active #burg-line-1 {
      transform: translateY(4px) rotate(45deg);
    }
    #animated-hamburger-btn.active #burg-line-2 {
      opacity: 0;
    }
    #animated-hamburger-btn.active #burg-line-3 {
      transform: translateY(-4px) rotate(-45deg);
    }

    .card-tag-badge {
      background: rgba(38, 28, 25, 0.88) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
      border-color: rgba(245, 235, 230, 0.25) !important;
      border-radius: 0px !important;
      color: #F5EBE6 !important;
    }
    html.light-mode .card-tag-badge {
      background: rgba(240, 228, 218, 0.88) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
      border-color: rgba(54, 36, 29, 0.25) !important;
      color: #261C19 !important;
    }

    /* Header Full Width Edge-to-Edge Guarantee */
    header,
    header#main-header,
    .header-glass,
    header.header-glass,
    header.sticky-header {
      width: 100% !important;
      max-width: 100% !important;
      left: 0 !important;
      right: 0 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      background: rgba(26, 20, 18, 0.92) !important;
      backdrop-filter: blur(24px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
      border-bottom: 1px solid rgba(245, 235, 230, 0.15) !important;
    }

    header > div,
    header#main-header > div,
    .header-glass > div {
      width: 100% !important;
      max-width: 100% !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      padding-left: 1.5rem !important;
      padding-right: 1.5rem !important;
    }

    @media (min-width: 768px) {
      header > div,
      header#main-header > div,
      .header-glass > div {
        padding-left: 2.5rem !important;
        padding-right: 2.5rem !important;
      }
    }

    html.light-mode header#main-header,
    html.light-mode header#main-header > div,
    html.light-mode header.header-glass,
    html.light-mode header.sticky-header,
    html.light-mode nav.header-glass,
    html.light-mode .header-glass,
    html.light-mode #desktop-nav div.absolute,
    html.light-mode div.absolute.top-full {
      background: rgba(245, 235, 228, 0.85) !important;
      color: #261C19 !important;
      border-color: rgba(54, 36, 29, 0.15) !important;
      box-shadow: 0 4px 20px rgba(54, 36, 29, 0.08) !important;
      backdrop-filter: blur(24px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
    }

    .glass-panel,
    .project-card-item,
    .it-card-container,
    .glass,
    .dark-glass {
      background: rgba(38, 28, 25, 0.60) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
      border: 1.5px solid rgba(245, 235, 230, 0.18) !important;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.40) !important;
      border-radius: 16px !important;
      color: #F5EBE6 !important;
    }

    html.light-mode .glass-panel,
    html.light-mode .project-card-item,
    html.light-mode .it-card-container,
    html.light-mode .glass,
    html.light-mode .dark-glass {
      background: rgba(240, 228, 218, 0.75) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
      border: 1.5px solid rgba(54, 36, 29, 0.18) !important;
      box-shadow: 0 15px 35px rgba(54, 36, 29, 0.12) !important;
      border-radius: 16px !important;
      color: #261C19 !important;
    }  border-radius: 0px !important;
    }
    html.light-mode .card-tag-badge span {
      color: #14B5E6 !important;
    }

    /* Contact Section, Footer, Buttons & Table Headers Styling */
    section#contact,
    section#contact > div,
    section#contact > div > a,
    section#contact div > a,
    footer,
    section#details table thead th,
    section#details table th,
    section#details table thead tr th {
      background-color: rgba(45, 46, 46, 0.65) !important;
      background: rgba(45, 46, 46, 0.65) !important;
      backdrop-filter: blur(28px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(28px) saturate(180%) !important;
      border: 1px solid rgba(156, 159, 159, 0.18) !important;
      box-shadow: none !important;
      text-shadow: none !important;
      border-radius: 0px !important;
    }
    html.light-mode section#contact,
    html.light-mode section#contact > div,
    html.light-mode section#contact > div > a,
    html.light-mode section#contact div > a,
    html.light-mode footer,
    html.light-mode section#details table thead th,
    html.light-mode section#details table th,
    html.light-mode header#main-header button:not(.dn-button-wrapper):not(#animated-hamburger-btn):not(#auth-header-btn) {
      background: rgba(0, 50, 80, 0.55) !important;
      background-color: rgba(0, 50, 80, 0.55) !important;
      color: #ffffff !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      backdrop-filter: blur(28px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(28px) saturate(180%) !important;
      box-shadow: none !important;
      text-shadow: none !important;
      border-radius: 0px !important;
    }

    /* Clean Sign In Icon without Box/Rectangle */
    #auth-header-btn,
    html.light-mode #auth-header-btn,
    button#auth-header-btn,
    html.light-mode button#auth-header-btn {
      background: transparent !important;
      background-color: transparent !important;
      border: none !important;
      border-radius: 0px !important;
      box-shadow: none !important;
      padding: 4px !important;
    }

    /* Day / Night Toggle Button Radius Guarantee */
    .dn-button-wrapper,
    .dn-button-wrapper[data-time="day"],
    html.light-mode .dn-button-wrapper,
    html.light-mode .dn-button-wrapper[data-time="day"],
    html.light-mode header#main-header .dn-button-wrapper {
      border-radius: 2rem !important;
    }

    /* Header Inter Font Guarantee */
    header#main-header,
    header#main-header *,
    .header-glass,
    .header-glass *,
    #desktop-nav a,
    #desktop-nav div,
    #auth-header-btn,
    #header-enquire-btn,
    #header-my-enquiries-btn {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }

    /* Global Glass & Backdrop Blur Styling */
    /* Global Glass & Backdrop Blur Styling */
    header,
    header#main-header,
    .header-glass,
    header.header-glass,
    header.sticky-header {
      width: 100% !important;
      max-width: 100% !important;
      left: 0 !important;
      right: 0 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      background: rgba(26, 20, 18, 0.92) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
      border-bottom: 1px solid rgba(156, 159, 159, 0.18) !important;
    }

    /* User Requested Glassmorphism Card System (.glass & .dark-glass) */
    .glass {
      background: rgba(255, 255, 255, 0.12) !important;
      border-radius: 25px !important;
      backdrop-filter: blur(12px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(12px) saturate(180%) !important;
      border: 2px solid rgba(255, 255, 255, 0.2) !important;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25) !important;
      overflow: hidden;
    }

    .dark-glass {
      background: rgba(0, 0, 0, 0.25) !important;
      border-radius: 25px !important;
      backdrop-filter: blur(12px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(12px) saturate(180%) !important;
      border: 2px solid rgba(0, 0, 0, 0.3) !important;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35) !important;
      overflow: hidden;
    }

    main > section#hero > div > div,
    .glass-panel-hero,
    .it-card-container,
    .project-card-item {
      backdrop-filter: blur(16px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
      background-color: rgba(45, 46, 46, 0.45) !important;
      background: rgba(45, 46, 46, 0.45) !important;
      border: 2px solid rgba(255, 255, 255, 0.20) !important;
      border-radius: 25px !important;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25) !important;
      overflow: hidden;
      transition: backdrop-filter 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                  -webkit-backdrop-filter 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                  background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                  border-color 0.3s ease,
                  box-shadow 0.3s ease,
                  transform 0.3s ease !important;
      will-change: backdrop-filter, background-color, transform;
    }

    /* Static Content Section Glass Panels (Executive Leadership, Registration, Contact Info & Services Cards) */
    section#methodology .glass-panel,
    section#details .glass-panel,
    section#achyutam-details .glass-panel,
    section#services .glass-panel,
    .glass-panel {
      background: rgba(45, 46, 46, 0.45) !important;
      background-color: rgba(45, 46, 46, 0.45) !important;
      backdrop-filter: blur(16px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
      border: 2px solid rgba(255, 255, 255, 0.20) !important;
      border-radius: 25px !important;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25) !important;
      overflow: hidden;
      transition: box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease, transform 0.3s ease !important;
    }

    /* Prototype / Syne Display Font for Slide, Service & Project Card Titles */
    #slide-title,
    h1.font-display-lg,
    section#services h3,
    section#services .font-headline-md,
    .service-card-title,
    .project-card-item h3,
    [id^="carousel-wrapper-"] h3,
    .it-card-title,
    .prototype-title {
      font-family: 'Syne', 'Protest Strike', sans-serif !important;
      letter-spacing: -0.01em !important;
    }

    /* === REMOVE ALL CARD SHADOWS & APPLY SHARP EDGES === */
    .cards-grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
      padding: 1rem;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
    }

    /* Hero & Project Card Hover — Transparent over Background Image */
    .glass-panel-hero:hover,
    .it-card-container:hover,
    .project-card-item:hover,
    section#hero:hover .glass-panel-hero {
      backdrop-filter: blur(0px) !important;
      -webkit-backdrop-filter: blur(0px) !important;
      background-color: transparent !important;
      background: transparent !important;
      border-color: rgba(255, 255, 255, 0.35) !important;
    }

    /* Static Section Glass Panel Hover — Elevated Frosted Card */
    section#methodology .glass-panel:hover,
    section#details .glass-panel:hover,
    section#achyutam-details .glass-panel:hover,
    .glass-panel:hover {
      border-color: rgba(255, 255, 255, 0.4) !important;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45) !important;
    }

    .it-card-container a.it-card-link,
    .project-card-item a {
      text-decoration: none;
      color: inherit;
      display: block;
    }

    /* Project Card Images — Crisp & Unblurred */
    .it-card-container .it-card-image,
    .project-card-item img,
    .project-card-item .card-slideshow-container,
    .card-slide-img,
    .slide-img,
    .img-grayscale-hover {
      filter: none !important;
      -webkit-filter: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      width: 100%;
      height: 220px;
      object-fit: cover;
      display: block;
      border-radius: 20px 20px 0 0 !important;
      transition: transform 0.4s ease !important;
    }

    .image-blur-vignette {
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      filter: none !important;
    }

    .it-card-container .it-card-content {
      padding: var(--it-card-padding);
    }

    .it-card-container .it-card-title,
    .project-card-item h3 {
      font-size: 1.25rem !important;
      font-weight: 600 !important;
      line-height: 1.3 !important;
      margin-top: 0 !important;
      margin-bottom: 0.5rem !important;
    }

    .it-card-container .it-card-description {
      font-size: 1rem !important;
      line-height: 1.5 !important;
      margin: 0 !important;
      color: #94a3b8 !important;
    }

    .it-card-container .it-card-action,
    .project-card-item .it-card-action {
      display: inline-block !important;
      background-color: #f3f4f6 !important;
      color: #111827 !important;
      padding: 0.5rem 1rem !important;
      margin-top: 1rem !important;
      font-size: 0.875rem !important;
      font-weight: 500 !important;
      border-radius: 0px !important;
      transition: background-color 0.2s ease !important;
    }

    .it-card-container .it-card-action:hover,
    .project-card-item .it-card-action:hover {
      background-color: #e5e7eb !important;
    }

    /* Light Mode Day Theme Overrides — Editorial Warm Cream & Glass Palette */
    html.light-mode header#main-header,
    html.light-mode header#main-header > div,
    html.light-mode header.header-glass,
    html.light-mode header.sticky-header,
    html.light-mode nav.header-glass,
    html.light-mode .header-glass,
    html.light-mode #desktop-nav div.absolute,
    html.light-mode div.absolute.top-full {
      background: rgba(250, 245, 240, 0.92) !important;
      background-color: rgba(250, 245, 240, 0.92) !important;
      color: #0f172a !important;
      border-color: rgba(15, 23, 42, 0.12) !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    }
    aside#sidebar-drawer,
    .sidebar-glass,
    aside.sidebar-glass {
      background: rgba(14, 14, 18, 0.35) !important;
      border-color: rgba(255, 255, 255, 0.1) !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    }
    aside#sidebar-drawer:hover,
    .sidebar-glass:hover,
    aside.sidebar-glass:hover {
      background: rgba(14, 14, 18, 0.55) !important;
    }
    html.light-mode aside#sidebar-drawer,
    html.light-mode .sidebar-glass,
    html.light-mode aside.sidebar-glass {
      background: rgba(245, 238, 232, 0.92) !important;
      background-color: rgba(245, 238, 232, 0.92) !important;
      border-color: rgba(15, 23, 42, 0.12) !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
      backdrop-filter: blur(28px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(28px) saturate(180%) !important;
    }
    html.light-mode aside#sidebar-drawer:hover,
    html.light-mode .sidebar-glass:hover,
    html.light-mode aside.sidebar-glass:hover {
      background: rgba(255, 255, 255, 0.95) !important;
      background-color: rgba(255, 255, 255, 0.95) !important;
    }
    html.light-mode main > section#hero > div > div,
    html.light-mode section#methodology .glass-panel,
    html.light-mode section#details .glass-panel,
    html.light-mode section#achyutam-details .glass-panel,
    html.light-mode section#services .glass-panel,
    html.light-mode .project-card-item,
    html.light-mode .it-card-container,
    html.light-mode .glass-panel {
      background: rgba(255, 255, 255, 0.88) !important;
      background-color: rgba(255, 255, 255, 0.88) !important;
      color: #0f172a !important;
      border: 1.5px solid rgba(15, 23, 42, 0.12) !important;
      border-radius: 16px !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06) !important;
      backdrop-filter: blur(16px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
    }

    html.light-mode section#methodology .glass-panel:hover,
    html.light-mode section#details .glass-panel:hover,
    html.light-mode section#achyutam-details .glass-panel:hover,
    html.light-mode section#services .glass-panel:hover,
    html.light-mode .project-card-item:hover,
    html.light-mode .it-card-container:hover,
    html.light-mode .glass-panel:hover {
      background: rgba(0, 88, 138, 0.75) !important;
      background-color: rgba(0, 88, 138, 0.75) !important;
      border-color: #6FD3C9 !important;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25) !important;
    }

    .category-carousel-wrapper,
    .category-carousel-slide,
    .category-carousel-slide > div,
    [id^="carousel-wrapper-"],
    [id^="carousel-wrapper-"] > div,
    [id^="carousel-wrapper-"] > div > div,
    section#methodology,
    section#details,
    section#achyutam-details,
    section#services,
    section#hero,
    section#projects,
    .bg-surface-container-low,
    .bg-surface-container,
    .bg-surface-container-high,
    .bg-surface-container-lowest,
    .bg-surface-dim,
    html.light-mode .category-carousel-wrapper,
    html.light-mode .category-carousel-slide,
    html.light-mode .category-carousel-slide > div,
    html.light-mode [id^="carousel-wrapper-"],
    html.light-mode [id^="carousel-wrapper-"] > div,
    html.light-mode [id^="carousel-wrapper-"] > div > div,
    html.light-mode section#methodology,
    html.light-mode section#details,
    html.light-mode section#achyutam-details,
    html.light-mode section#services,
    html.light-mode section#hero,
    html.light-mode section#projects,
    html.light-mode .bg-surface-container-low,
    html.light-mode .bg-surface-container,
    html.light-mode .bg-surface-container-high,
    html.light-mode .bg-surface-container-lowest,
    html.light-mode .bg-surface-dim {
      background: transparent !important;
      background-color: transparent !important;
      color: #ffffff !important;
      border: none !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
    }

    .category-carousel-wrapper:hover,
    .category-carousel-slide:hover,
    .category-carousel-slide > div:hover,
    [id^="carousel-wrapper-"]:hover,
    [id^="carousel-wrapper-"] > div:hover,
    [id^="carousel-wrapper-"] > div > div:hover,
    section#methodology:hover,
    section#details:hover,
    section#achyutam-details:hover,
    section#services:hover,
    section#hero:hover,
    section#projects:hover,
    html.light-mode .category-carousel-wrapper:hover,
    html.light-mode .category-carousel-slide:hover,
    html.light-mode .category-carousel-slide > div:hover,
    html.light-mode [id^="carousel-wrapper-"]:hover,
    html.light-mode [id^="carousel-wrapper-"] > div:hover,
    html.light-mode [id^="carousel-wrapper-"] > div > div:hover,
    html.light-mode section#methodology:hover,
    html.light-mode section#details:hover,
    html.light-mode section#achyutam-details:hover,
    html.light-mode section#services:hover,
    html.light-mode section#hero:hover,
    html.light-mode section#projects:hover {
      background: transparent !important;
      background-color: transparent !important;
      border: none !important;
      box-shadow: none !important;
    }

    html.light-mode .project-card-item h3,
    html.light-mode [id^="carousel-wrapper-"] h3,
    html.light-mode section#services h3,
    html.light-mode .it-card-container .it-card-title {
      color: #ffffff !important;
    }

    html.light-mode .project-card-item p,
    html.light-mode [id^="carousel-wrapper-"] p,
    html.light-mode section#services p,
    html.light-mode .it-card-container .it-card-description {
      color: #DFF6F2 !important;
    }

    html.light-mode .glass-panel-hero:hover,
    html.light-mode .project-card-item:hover,
    html.light-mode .it-card-container:hover,
    html.light-mode section#hero:hover .glass-panel-hero {
      backdrop-filter: blur(0px) !important;
      -webkit-backdrop-filter: blur(0px) !important;
      background-color: transparent !important;
      background: transparent !important;
      border-color: rgba(255, 255, 255, 0.2) !important;
    }

    .glass-panel-hero:hover h1,
    .glass-panel-hero:hover h2,
    .glass-panel-hero:hover h3,
    .glass-panel-hero:hover p,
    .glass-panel-hero:hover span,
    .glass-panel-hover div,
    .glass-panel:hover h1,
    .glass-panel:hover h2,
    .glass-panel:hover h3,
    .glass-panel:hover p,
    .glass-panel:hover span,
    .glass-panel:hover div,
    .project-card-item:hover h3,
    .project-card-item:hover p,
    .project-card-item:hover span,
    section#hero:hover .glass-panel-hero h1,
    section#hero:hover .glass-panel-hero h2,
    section#hero:hover .glass-panel-hero h3,
    section#hero:hover .glass-panel-hero p,
    section#hero:hover .glass-panel-hero span,
    section#hero:hover .glass-panel-hero div,
    html.light-mode .glass-panel-hero:hover h1,
    html.light-mode .glass-panel-hero:hover h2,
    html.light-mode .glass-panel-hero:hover h3,
    html.light-mode .glass-panel-hero:hover p,
    html.light-mode .glass-panel-hero:hover span,
    html.light-mode section#hero:hover .glass-panel-hero h1,
    html.light-mode section#hero:hover .glass-panel-hero h2,
    html.light-mode section#hero:hover .glass-panel-hero h3,
    html.light-mode section#hero:hover .glass-panel-hero p,
    html.light-mode section#hero:hover .glass-panel-hero span {
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35) !important;
    }
    .bg-surface,
    .bg-surface-container-highest,
    .bg-\[\#131318\],
    .bg-\[\#0a0a0e\],
    .bg-\[\#1c1b22\],
    .bg-\[\#222129\],
    .bg-background,
    html.light-mode .bg-surface,
    html.light-mode .bg-surface-container-highest,
    html.light-mode .bg-\[\#131318\],
    html.light-mode .bg-\[\#0a0a0e\],
    html.light-mode .bg-\[\#1c1b22\],
    html.light-mode .bg-\[\#222129\],
    html.light-mode .bg-background {
      background-color: transparent !important;
      background: transparent !important;
      color: #ffffff !important;
      border: none !important;
      border-color: transparent !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
    }
    html.light-mode .bg-surface-dim,
    html.light-mode .bg-surface-container-lowest {
      background-color: transparent !important;
      background: transparent !important;
      color: #ffffff !important;
    }
    html.light-mode .text-on-surface {
      color: #ffffff !important;
    }
    html.light-mode .text-on-surface-variant {
      color: #DFF6F2 !important;
    }
    html.light-mode .text-primary {
      color: #14B5E6 !important;
    }
    html.light-mode .border-primary,
    html.light-mode .border-primary\/40,
    html.light-mode .border-primary\/60 {
      border-color: #14B5E6 !important;
    }
    html.light-mode .bg-primary {
      background-color: #14B5E6 !important;
      color: #ffffff !important;
    }
    html.light-mode .bg-primary\/10 {
      background-color: rgba(20, 181, 230, 0.15) !important;
    }
    html.light-mode .hover\:bg-primary:hover {
      background-color: #14B5E6 !important;
      color: #ffffff !important;
    }

    /* Refactored Logo Icon Composition: Top visual element becomes bottom visual element */
    header img[alt*="Logo"],
    a img[alt*="ACHYUTAM BUILDER Logo"],
    .logo-mark-flipped {
      transform: rotate(180deg) !important;
      transition: transform 0.3s ease !important;
    }
    .group:hover header img[alt*="Logo"],
    .group:hover a img[alt*="ACHYUTAM BUILDER Logo"],
    .group:hover .logo-mark-flipped {
      transform: rotate(180deg) scale(1.05) !important;
    }
    html.light-mode input,
    html.light-mode select,
    html.light-mode textarea {
      background-color: #f8fafc !important;
      color: #0f172a !important;
      border-color: rgba(0, 0, 0, 0.2) !important;
    }
    html.light-mode .sticky-stage {
      background: #f1f5f9 !important;
    }
    html.light-mode #preloader {
      background: #ffffff !important;
    }
    html.light-mode .blur-transition-bottom-to-top {
      background: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.7) 40%, rgba(255, 255, 255, 0) 100%) !important;
    }
    html.light-mode .blur-transition-top-to-bottom {
      background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.6) 40%, rgba(255, 255, 255, 0) 100%) !important;
    }
    /* Sidebar Filter Buttons Active & Hover States */
    aside#sidebar-drawer .sidebar-filter-btn {
      color: rgba(255, 255, 255, 0.7) !important;
      transition: all 0.3s ease !important;
    }
    aside#sidebar-drawer .sidebar-filter-btn:hover {
      color: #ff7722 !important;
    }
    aside#sidebar-drawer .sidebar-filter-btn.active {
      color: #ff7722 !important;
      background-color: rgba(255, 119, 34, 0.15) !important;
      border-left-color: #ff7722 !important;
    }
    aside#sidebar-drawer .sidebar-filter-btn.active span.material-symbols-outlined {
      color: #ff7722 !important;
    }

    /* Light Mode Sidebar Overrides */
    html.light-mode aside#sidebar-drawer .sidebar-filter-btn {
      color: #475569 !important;
    }
    html.light-mode aside#sidebar-drawer .sidebar-filter-btn:hover {
      color: #d97706 !important;
    }
    html.light-mode aside#sidebar-drawer .sidebar-filter-btn.active {
      color: #b45309 !important;
      background-color: rgba(217, 119, 6, 0.14) !important;
      border-left-color: #d97706 !important;
    }
    html.light-mode aside#sidebar-drawer .sidebar-filter-btn.active span.material-symbols-outlined {
      color: #b45309 !important;
    }

    /* Ensure sidebar text labels are strictly hidden when sidebar is collapsed (not hovered) */
    aside#sidebar-drawer:not(:hover) .sidebar-filter-btn span:not(.material-symbols-outlined),
    aside#sidebar-drawer:not(:hover) .sidebar-filter-btn div {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
      transition: opacity 0.2s ease, visibility 0.2s ease !important;
    }
    aside#sidebar-drawer:hover .sidebar-filter-btn span:not(.material-symbols-outlined),
    aside#sidebar-drawer:hover .sidebar-filter-btn div {
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: auto !important;
      transition: opacity 0.3s ease 0.1s, visibility 0.3s ease 0.1s !important;
    }

    /* Enforce lowercase small letters for all mail IDs */
    a[href^="mailto:"],
    .email-link,
    .mail-id {
      text-transform: lowercase !important;
    }

    /* Light Mode Navigation Overlay & Header Boxes with Blur Effect */
    html.light-mode #navigation-overlay {
      background: rgba(255, 255, 255, 0.88) !important;
      color: #0f172a !important;
      border-color: rgba(0, 0, 0, 0.1) !important;
      backdrop-filter: blur(28px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(28px) saturate(180%) !important;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08) !important;
    }

    html.light-mode header .group .absolute,
    html.light-mode .dropdown-menu {
      background: rgba(255, 255, 255, 0.92) !important;
      color: #0f172a !important;
      border-color: rgba(0, 0, 0, 0.1) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1) !important;
    }

    html.light-mode #animated-hamburger-btn {
      background-color: rgba(0, 0, 0, 0.05) !important;
      border-color: rgba(0, 0, 0, 0.15) !important;
      border-radius: 9999px !important;
    }

    html.light-mode #header-enquire-btn,
    html.light-mode #header-my-enquiries-btn,
    html.light-mode #auth-header-btn {
      background-color: rgba(255, 255, 255, 0.88) !important;
      border: 1px solid rgba(15, 23, 42, 0.25) !important;
      color: #0f172a !important;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06) !important;
    }

    html.light-mode #header-my-enquiries-btn:hover,
    html.light-mode #auth-header-btn:hover {
      background-color: #ffffff !important;
      border-color: #d97706 !important;
      color: #d97706 !important;
    }

    html.light-mode #auth-modal,
    html.light-mode #project-modal {
      background: rgba(15, 23, 42, 0.4) !important;
      backdrop-filter: blur(16px) !important;
      -webkit-backdrop-filter: blur(16px) !important;
    }

    html.light-mode #auth-modal > div,
    html.light-mode #project-modal > div {
      background: rgba(255, 255, 255, 0.95) !important;
      color: #0f172a !important;
      border-color: rgba(0, 0, 0, 0.1) !important;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15) !important;
      backdrop-filter: blur(24px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
    }

    /* DAY & NIGHT TOGGLE BUTTON STYLES */
    :root {
      --dn-ease: cubic-bezier(.4,-0.3,.6,1.3);
      --dn-clr-bg-day: #00588A;
      --dn-clr-bg-night: #2D2E2E;
      --dn-clr-sun: #14B5E6;
      --dn-clr-sun-lgt: #DFF6F2;
      --dn-clr-moon: #9C9F9F;
      --dn-button-width: 1.0rem;
    }

    html.light-mode {
      --dn-clr-sun: #14B5E6;
      --dn-clr-sun-lgt: #DFF6F2;
      --dn-clr-bg-day: #00588A;
    }

    .dn-button-wrapper {
      --x: 1.5px;
      --y: 2px;
      --spread: 3px;
      --offset: 0px;

      position: relative;
      width: 3.2rem;
      height: 1.55rem;
      border-radius: 2rem;
      font-size: 0.72rem;
      border: none;
      overflow: hidden;
      background-color: var(--dn-clr-bg-night);
      box-shadow: 
        var(--x) var(--y) var(--spread) var(--offset) rgba(0, 0, 0, 0.25),
        inset 0 2px 4px rgba(255, 255, 255, 0.2);
      isolation: isolate;
      transition: all 0.75s var(--dn-ease);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
      padding: 0;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      outline: none;
    }

    /* DAY STATE */
    .dn-button-wrapper[data-time="day"] {
      background-color: var(--dn-clr-bg-day);
    }

    /* SUN / MOON ORB */
    .dn-button-wrapper .dn-orb {
      position: absolute;
      left: calc(100% - 0.2rem - var(--dn-button-width));
      top: 50%;
      transform: translate(0, -50%);
      width: var(--dn-button-width);
      height: var(--dn-button-width);
      border-radius: 50%;
      background: radial-gradient(#eee, transparent);
      background-color: var(--dn-clr-moon);
      cursor: pointer;
      box-shadow: 
        0px 0px 0em 0.3em rgba(255, 255, 255, 0.1),
        0px 0px 0em 0.6em rgba(255, 255, 255, 0.1),
        0px 0px 0em 0.9em rgba(255, 255, 255, 0.1),
        0 0 0.3em 0 #fff;
      transition: all 0.75s var(--dn-ease);
      z-index: 2;
    }

    /* MOON CRATERS */
    .dn-button-wrapper .dn-orb::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 60%;
      width: 25%;
      height: 25%;
      border-radius: 50%;
      overflow: hidden;
      transition: all 0.3s ease;
      transition-delay: 0.3s;
      background-color: #c5c5c5ff;
      box-shadow:
        -0.4em -0.35em 0 0.05em #d5d5d5ff,
        0.05em -0.45em 0 -0.05em #d5d5d5ff;
    }

    /* SUN ORB IN DAY MODE */
    .dn-button-wrapper[data-time="day"] .dn-orb {
      left: 0.2rem;
      background: radial-gradient(var(--dn-clr-sun-lgt), transparent);
      background-color: var(--dn-clr-sun);
      box-shadow: 
        0px 0px 0em 0.3em rgba(255, 255, 255, 0.2),
        0px 0px 0em 0.6em rgba(255, 255, 255, 0.2),
        0px 0px 0em 0.9em rgba(255, 255, 255, 0.2),
        0 0 0.3em 0 #fff;
    }

    .dn-button-wrapper[data-time="day"] .dn-orb::after {
      background-color: #c5c5c500;
      box-shadow:
        -0.4em -0.35em 0 0.05em #d5d5d500,
        0.05em -0.45em 0 -0.05em #d5d5d500;
      transition-delay: 0s;
    }

    /* DAY CLOUDS IN PSEUDO ELEMENTS */
    .dn-button-wrapper::before {
      content: '';
      position: absolute;
      width: 1.0rem;
      aspect-ratio: 1 / 1;
      background-color: #fff;
      border-radius: 50%;
      right: -2.5rem;
      bottom: -0.6rem;
      box-shadow:
        -0.5em 0.5em 0 -0.12em #fff,
        -1em 0.6em 0 -0.25em #fff,
        -1.5em 0.7em 0 -0.12em #fff,
        -2em 0.7em 0 -0.3em #fff,
        -2.5em 0.8em 0 -0.25em #fff;
      opacity: 0.5;
      scale: 1.5;
      transition: all 0.75s ease;
      z-index: 1;
    }

    .dn-button-wrapper::after {
      content: '';
      position: absolute;
      width: var(--dn-button-width);
      height: var(--dn-button-width);
      background-color: #fff;
      border-radius: 50%;
      right: -2.5rem;
      bottom: -1rem;
      box-shadow:
        -0.5em 0.5em 0 -0.12em #fff,
        -1em 0.6em 0 -0.25em #fff,
        -1.5em 0.7em 0 -0.12em #fff,
        -2em 0.7em 0 -0.3em #fff,
        -2.5em 0.8em 0 -0.25em #fff;
      scale: 2;
      transition: all 0.75s ease;
      z-index: 1;
    }

    .dn-button-wrapper[data-time="day"]::before {
      right: -0.15rem;
      bottom: 0.2rem;
      scale: 1;
    }

    .dn-button-wrapper[data-time="day"]::after {
      right: -0.5rem;
      bottom: 0rem;
      scale: 1;
    }

    /* STAR CANVAS */
    .dn-button-wrapper canvas.dn-stars {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      opacity: 1;
      transition: all 0.75s ease;
      pointer-events: none;
    }

    /* 180 Degree Rotation Utility */
    .rotate-180-flip {
      transform: rotate(180deg) !important;
      transition: transform 0.5s ease-in-out !important;
    }
  `;

  // Global 180-degree rotation trigger
  window.rotate180 = (targetSelector) => {
    const el = targetSelector
      ? document.querySelector(targetSelector)
      : document.body;
    if (el) {
      el.classList.toggle("rotate-180-flip");
    }
  };

  // Inject Styles into Head
  const styleTag = document.createElement("style");
  styleTag.id = "dn-theme-styles";
  styleTag.textContent = themeStyles;
  document.head.appendChild(styleTag);

  // Read saved theme preference
  const savedTheme = localStorage.getItem("acyutam_theme");
  if (savedTheme === "light") {
    document.documentElement.classList.add("light-mode");
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.remove("light-mode");
    document.documentElement.classList.add("dark");
  }
})();

// Star particle class for canvas
class StarParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 0;
    this.growth = 0.08;
    this.isIncreasing = true;
  }
  update(ctx) {
    if (this.size > 1.8) {
      this.isIncreasing = false;
    }
    if (this.isIncreasing) {
      this.size += this.growth;
    } else {
      this.size -= this.growth * 0.5;
    }
    this.draw(ctx);
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.closePath();
  }
}

// Global Star Canvas Controller
const starCanvases = [];

function initStarCanvas(canvas) {
  if (canvas._starInterval) clearInterval(canvas._starInterval);
  if (canvas._starAnimFrame) cancelAnimationFrame(canvas._starAnimFrame);

  const ctx = canvas.getContext("2d");
  const parent = canvas.parentElement;
  if (!parent) return;

  function resize() {
    canvas.width = parent.clientWidth || 72;
    canvas.height = parent.clientHeight || 34;
  }
  resize();

  const stars = [];

  // Interval to add stars
  canvas._starInterval = setInterval(() => {
    if (!document.body.contains(canvas)) {
      clearInterval(canvas._starInterval);
      return;
    }
    if (canvas.offsetParent !== null && parent.dataset.time === "night") {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      if (stars.length < 25) {
        stars.push(new StarParticle(x, y));
      }
    }
  }, 120);

  function animate() {
    if (!document.body.contains(canvas)) {
      if (canvas._starAnimFrame) cancelAnimationFrame(canvas._starAnimFrame);
      return;
    }
    if (canvas.offsetParent !== null && parent.dataset.time === "night") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i];
        if (!star.isIncreasing && star.size < 0.2) {
          stars.splice(i, 1);
        } else {
          star.update(ctx);
        }
      }
    }
    canvas._starAnimFrame = requestAnimationFrame(animate);
  }
  animate();
}

// Global Main Navigation Drawer Toggle & Auto-Close on Scroll
window.toggleMainNavigation = () => {
  const btn = document.getElementById("animated-hamburger-btn");
  const overlay = document.getElementById("navigation-overlay");
  if (btn) btn.classList.toggle("active");
  if (overlay) overlay.classList.toggle("hidden");
};

window.closeMainNavigation = () => {
  const btn = document.getElementById("animated-hamburger-btn");
  const overlay = document.getElementById("navigation-overlay");
  if (btn) btn.classList.remove("active");
  if (overlay && !overlay.classList.contains("hidden")) {
    overlay.classList.add("hidden");
  }
};

// Automatically close hamburger navigation drawer when user scrolls (especially on mobile)
let lastNavScrollY = window.pageYOffset || document.documentElement.scrollTop;
window.addEventListener(
  "scroll",
  () => {
    const overlay = document.getElementById("navigation-overlay");
    if (overlay && !overlay.classList.contains("hidden")) {
      const curY = window.pageYOffset || document.documentElement.scrollTop;
      if (Math.abs(curY - lastNavScrollY) > 5) {
        window.closeMainNavigation();
      }
    }
    lastNavScrollY = window.pageYOffset || document.documentElement.scrollTop;
  },
  { passive: true },
);

// Initializer: Enforce Dark Architectural Theme as default across entire website
(function initTheme() {
  document.documentElement.classList.remove("light-mode");
  document.documentElement.classList.add("dark");
  localStorage.setItem("acyutam_theme", "dark");
})();

// Global Theme Toggle Handler
window.toggleTheme = () => {
  const isLight = document.documentElement.classList.contains("light-mode");
  const newTheme = isLight ? "dark" : "light";

  if (newTheme === "light") {
    document.documentElement.classList.add("light-mode");
    document.documentElement.classList.remove("dark");
    localStorage.setItem("acyutam_theme", "light");
  } else {
    document.documentElement.classList.remove("light-mode");
    document.documentElement.classList.add("dark");
    localStorage.setItem("acyutam_theme", "dark");
  }

  updateToggleButtons();
};

function updateToggleButtons() {
  const isLight = document.documentElement.classList.contains("light-mode");
  const timeState = isLight ? "day" : "night";
  const toggleBtns = document.querySelectorAll(
    ".theme-toggle-btn, #theme-toggle-btn, .day-night-toggle, .dn-button-wrapper, .hf-dn-switch",
  );

  for (const btn of toggleBtns) {
    btn.className = "dn-button-wrapper theme-toggle-btn cursor-pointer";
    btn.dataset.time = timeState;
    btn.setAttribute("onclick", "toggleTheme()");
    btn.setAttribute(
      "title",
      isLight ? "Switch to Night Mode" : "Switch to Day Mode",
    );
    btn.setAttribute(
      "aria-label",
      isLight ? "Switch to Night Mode" : "Switch to Day Mode",
    );

    if (!btn.querySelector(".dn-orb")) {
      btn.innerHTML = `
        <span class="dn-orb"></span>
        <canvas class="dn-stars"></canvas>
      `;
      const canvas = btn.querySelector("canvas.dn-stars");
      if (canvas) {
        initStarCanvas(canvas);
      }
    }
  }
}

// Global Unified Header Auth UI Controller
window.updateAuthUI = async function () {
  const userStr = localStorage.getItem('achyutam_user');
  const authBtnText = document.getElementById('auth-btn-text');
  const authHeaderBtn = document.getElementById('auth-header-btn');
  const headerMyEnquiriesBtn = document.getElementById('header-my-enquiries-btn');
  const labelSpan = document.getElementById('my-enquiries-label');
  const badge = document.getElementById('my-enquiries-badge');
  const enquireBtn = document.getElementById('header-enquire-btn');

  // Always keep CONTACT US button box visible in the right corner
  if (enquireBtn) {
    enquireBtn.classList.remove('hidden');
    enquireBtn.style.display = 'inline-flex';
  }

  if (userStr && authBtnText) {
    try {
      const user = JSON.parse(userStr);
      const userEmail = (user.email || user.identity || '').toLowerCase().trim();
      const isAdmin = userEmail === 'ankitjangir529@gmail.com' || user.role === 'admin' || user.isAdmin === true;
      
      let rawName = user.displayName || user.name || userEmail.split('@')[0] || 'USER';
      rawName = rawName.replace(/\(Admin\)/gi, '').trim();
      let firstName = rawName.split(/[\s._]+/)[0].toUpperCase();
      if (!firstName || firstName.length === 0) firstName = 'USER';

      authBtnText.textContent = firstName;
      if (authHeaderBtn) {
        authHeaderBtn.className = 'flex items-center justify-center gap-1.5 text-on-surface hover:text-primary transition-all font-label-caps text-xs tracking-widest uppercase cursor-pointer shrink-0 px-2.5 py-1.5 border border-outline-variant/40 hover:border-primary/60 bg-surface-container-low/60 rounded-sm shadow-sm';
      }

      if (isAdmin) {
        if (headerMyEnquiriesBtn) {
          headerMyEnquiriesBtn.classList.remove('hidden');
          headerMyEnquiriesBtn.style.display = 'inline-flex';
          headerMyEnquiriesBtn.href = 'admin-dashboard.html';
          headerMyEnquiriesBtn.className = 'border border-outline-variant/60 bg-surface-container-low/80 hover:bg-surface text-on-surface hover:text-primary px-3.5 py-1.5 transition-all font-label-caps text-xs tracking-widest uppercase rounded-sm cursor-pointer shrink-0 shadow-sm font-bold flex items-center justify-center gap-1.5';
        }
        if (labelSpan) {
          labelSpan.textContent = 'ADMIN PORTAL';
          labelSpan.className = 'text-on-surface font-bold tracking-widest';
        }

        let pendingCount = 0;
        if (window.AchyutamFirebase) {
          if (typeof window.AchyutamFirebase.getRecentEnquiriesForAdmin === 'function') {
            const res = await window.AchyutamFirebase.getRecentEnquiriesForAdmin();
            if (res.success && res.data) {
              pendingCount = res.data.length;
            }
          }
        }

        if (badge) {
          badge.textContent = pendingCount.toString();
          if (pendingCount > 0) {
            badge.classList.remove('hidden');
            badge.style.display = 'inline-block';
            badge.className = 'bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-0.5';
          } else {
            badge.classList.add('hidden');
            badge.style.display = 'none';
          }
        }
      } else {
        // Logged in Client State
        if (headerMyEnquiriesBtn) {
          headerMyEnquiriesBtn.classList.remove('hidden');
          headerMyEnquiriesBtn.style.display = 'inline-flex';
          headerMyEnquiriesBtn.href = 'contact.html';
          headerMyEnquiriesBtn.className = 'border border-outline-variant/60 bg-surface-container-low/80 hover:bg-surface text-on-surface hover:text-primary px-3.5 py-1.5 transition-all font-label-caps text-xs tracking-widest uppercase rounded-sm cursor-pointer shrink-0 shadow-sm font-bold flex items-center justify-center gap-1.5';
        }
        if (labelSpan) {
          labelSpan.textContent = 'MY MESSAGES';
          labelSpan.className = 'text-on-surface font-bold tracking-widest';
        }

        if (window.AchyutamFirebase?.getUserEnquiries) {
          const res = await window.AchyutamFirebase.getUserEnquiries();
          const list = res.enquiries || res.bookings || [];
          if (badge && res.success) {
            badge.textContent = list.length.toString();
            if (list.length > 0) {
              badge.classList.remove('hidden');
              badge.style.display = 'inline-block';
              badge.className = 'bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-0.5';
            }
          }
        }
      }
    } catch(e) {
      console.error("updateAuthUI error:", e);
    }
  } else {
    // Logged Out State
    if (authBtnText) authBtnText.textContent = 'SIGN IN';
    if (headerMyEnquiriesBtn) {
      headerMyEnquiriesBtn.classList.add('hidden');
      headerMyEnquiriesBtn.style.display = 'none';
    }
  }
};

// Auto Initialize & Video Visibility Guard
document.addEventListener("DOMContentLoaded", () => {
  updateToggleButtons();
  setTimeout(updateToggleButtons, 200);
  if (typeof window.updateAuthUI === "function") {
    window.updateAuthUI();
  }
  initCurvedScrollTimeline();

  const preloaderVideo = document.getElementById("preloader-video");
  if (preloaderVideo && "IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            preloaderVideo.pause();
          }
        });
      },
      { threshold: 0.1 }
    );
    videoObserver.observe(preloaderVideo);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (preloaderVideo) preloaderVideo.pause();
    }
  });

  // Global Image Lazy Loading & Fallback Guard
  const allImgs = document.querySelectorAll("img:not([loading])");
  allImgs.forEach((img) => img.setAttribute("loading", "lazy"));

  // Interactive 60fps Mousemove Parallax for Cards & Backgrounds
  let mouseMoveTicking = false;
  document.addEventListener("mousemove", (e) => {
    if (!mouseMoveTicking) {
      requestAnimationFrame(() => {
        const xPercent = (e.clientX / window.innerWidth - 0.5) * 12;
        const yPercent = (e.clientY / window.innerHeight - 0.5) * 12;

        const cards = document.querySelectorAll(
          ".project-card-item, .it-card-container, .glass-panel, .glass, .dark-glass"
        );
        cards.forEach((card) => {
          const img = card.querySelector("img");
          if (img) {
            img.style.transform = `scale(1.04) translate3d(${xPercent * 0.35}px, ${yPercent * 0.35}px, 0)`;
          }
        });
        mouseMoveTicking = false;
      });
      mouseMoveTicking = true;
    }
  }, { passive: true });
});

// Global Image Loading Error Fallback Chain (Priority: webp -> png -> jpeg -> jpg)
document.addEventListener("error", (e) => {
  if (e.target && e.target.tagName === "IMG") {
    const img = e.target;
    const currentSrc = (img.src || "").toLowerCase();
    if (currentSrc.includes("logo")) {
      if (!img.dataset.fallbackLevel) {
        img.dataset.fallbackLevel = "png";
        img.src = "logo.png";
      } else if (img.dataset.fallbackLevel === "png") {
        img.dataset.fallbackLevel = "jpeg";
        img.src = "logo.jpeg";
      } else if (img.dataset.fallbackLevel === "jpeg") {
        img.dataset.fallbackLevel = "jpg";
        img.src = "logo.jpg";
      }
    }
  }
}, true);
