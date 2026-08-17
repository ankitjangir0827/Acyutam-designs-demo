/**
 * Day & Night Theme Manager for ACHYUTAM BUILDER
 * Inspired by interactive canvas & CSS spring-animated Day/Night toggle switch.
 */
(() => {
  const themeStyles = `
    /* Dark Mode Root Overrides */
    body {
      background-color: #3C3C3C !important;
      color: #e5e2e1 !important;
    }

    /* Light Mode Root Overrides & Glassmorphism Blur Effects */
    html.light-mode {
      color-scheme: light;
    }
    html.light-mode body {
      background-color: #92A6BA !important;
      color: #0f172a !important;
    }

    /* Card Badges Glass & Backdrop Blur Styling (Dark & Light) - Dark Blue Blur */
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
      background: rgba(15, 25, 48, 0.88) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
      border-color: rgba(255, 255, 255, 0.2) !important;
      border-radius: 0px !important;
    }
    html.light-mode .card-tag-badge {
      background: rgba(15, 25, 48, 0.88) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
      border-color: rgba(255, 255, 255, 0.25) !important;
      border-radius: 0px !important;
    }
    html.light-mode .card-tag-badge span {
      color: #ff8c3b !important;
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
      background-color: #3C3C3C !important;
      backdrop-filter: blur(28px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(28px) saturate(180%) !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
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
      background: #92A6BA !important;
      background-color: #92A6BA !important;
      color: #0f172a !important;
      border: 1px solid rgba(0, 0, 0, 0.1) !important;
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

    /* Global Glass & Backdrop Blur Styling */
    header#main-header > div,
    .header-glass,
    header.header-glass,
    header.sticky-header {
      background: #3C3C3C !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    }

    main > section#hero > div > div,
    .glass-panel-hero {
      background: rgba(14, 14, 18, 0.6) !important;
      background-color: rgba(14, 14, 18, 0.6) !important;
      backdrop-filter: blur(24px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4) !important;
    }
    section#methodology,
    section#details,
    section#achyutam-details,
    .glass-panel {
      background-color: #3C3C3C !important;
      backdrop-filter: blur(24px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      box-shadow: none !important;
      border-radius: 0px !important;
    }

    /* === REMOVE ALL CARD SHADOWS & APPLY SHARP EDGES === */
    .cards-grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
      padding: 1rem;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
    }

    .it-card-container,
    .project-card-item,
    .glass-panel,
    .glass-panel-hero,
    [id^="carousel-wrapper-"] > div > div,
    [id^="carousel-wrapper-"] > div > div > a > div {
      --it-card-padding: 1.5rem;
      --it-card-border-radius: 0px;
      --it-card-shadow: none;

      background: rgba(255, 255, 255, 0.08) !important;
      border-radius: 0px !important;
      overflow: hidden !important;
      box-shadow: none !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      transition: transform 0.2s ease-in-out, border-color 0.2s ease-in-out !important;
    }

    .it-card-container:hover,
    .project-card-item:hover,
    .glass-panel:hover,
    [id^="carousel-wrapper-"] > div > div:hover {
      transform: translateY(-5px) !important;
      box-shadow: none !important;
      border-color: #ff7722 !important;
    }

    .it-card-container a.it-card-link,
    .project-card-item a {
      text-decoration: none;
      color: inherit;
      display: block;
    }

    .it-card-container .it-card-image,
    .project-card-item img,
    .project-card-item .card-slideshow-container {
      width: 100%;
      height: 220px;
      object-fit: cover;
      display: block;
      border-radius: 0px !important;
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

    /* Light Mode Glassmorphism Overrides */
    html.light-mode header#main-header,
    html.light-mode header#main-header > div,
    html.light-mode header.header-glass,
    html.light-mode header.sticky-header,
    html.light-mode nav.header-glass,
    html.light-mode .header-glass {
      background: rgba(255, 255, 255, 0.65) !important;
      border-color: rgba(0, 0, 0, 0.08) !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04) !important;
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
      background: rgba(255, 255, 255, 0.45) !important;
      border-color: rgba(0, 0, 0, 0.08) !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    }
    html.light-mode aside#sidebar-drawer:hover,
    html.light-mode .sidebar-glass:hover,
    html.light-mode aside.sidebar-glass:hover {
      background: rgba(255, 255, 255, 0.65) !important;
    }
    html.light-mode main > section#hero > div > div,
    html.light-mode .glass-panel-hero {
      background: rgba(255, 255, 255, 0.55) !important;
      background-color: rgba(255, 255, 255, 0.55) !important;
      color: #0f172a !important;
      border: 1px solid rgba(0, 0, 0, 0.1) !important;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06) !important;
      backdrop-filter: blur(24px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
    }
    html.light-mode section#methodology,
    html.light-mode section#details,
    html.light-mode section#achyutam-details,
    html.light-mode .glass-panel,
    html.light-mode .project-card-item,
    html.light-mode .it-card-container,
    html.light-mode .bg-surface-container-low,
    html.light-mode .bg-surface-container,
    html.light-mode .bg-surface-container-high,
    html.light-mode [id^="carousel-wrapper-"] > div > div,
    html.light-mode [id^="carousel-wrapper-"] > div > div > a > div,
    html.light-mode [id^="carousel-wrapper-"] > div > div > a > div > div,
    html.light-mode [id^="carousel-wrapper-"] div {
      background: #92A6BA !important;
      background-color: #92A6BA !important;
      color: #0f172a !important;
      border: 1px solid rgba(0, 0, 0, 0.12) !important;
      box-shadow: none !important;
      border-radius: 0px !important;
      backdrop-filter: blur(24px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
    }

    html.light-mode .project-card-item h3,
    html.light-mode [id^="carousel-wrapper-"] h3,
    html.light-mode .it-card-container .it-card-title {
      color: #0f172a !important;
    }

    html.light-mode .project-card-item p,
    html.light-mode [id^="carousel-wrapper-"] p,
    html.light-mode .it-card-container .it-card-description {
      color: #1e293b !important;
    }

    html.light-mode .glass-panel:hover,
    html.light-mode .project-card-item:hover,
    html.light-mode .it-card-container:hover,
    html.light-mode [id^="carousel-wrapper-"] > div > div:hover {
      box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.35) !important;
      border-color: #ff7722 !important;
    }
    html.light-mode .bg-surface,
    html.light-mode .bg-surface-container-highest,
    html.light-mode .bg-\[\#131318\],
    html.light-mode .bg-\[\#0a0a0e\],
    html.light-mode .bg-\[\#1c1b22\],
    html.light-mode .bg-\[\#222129\],
    html.light-mode .bg-background {
      background-color: rgba(255, 255, 255, 0.65) !important;
      color: #0f172a !important;
      border-color: rgba(0, 0, 0, 0.08) !important;
      backdrop-filter: blur(16px) !important;
      -webkit-backdrop-filter: blur(16px) !important;
    }
    html.light-mode .bg-surface-dim,
    html.light-mode .bg-surface-container-lowest {
      background-color: rgba(255, 255, 255, 0.65) !important;
      color: #0f172a !important;
    }
    html.light-mode .text-on-surface {
      color: #0f172a !important;
    }
    html.light-mode .text-on-surface-variant {
      color: #334155 !important;
    }
    html.light-mode .text-primary {
      color: #d97706 !important;
    }
    html.light-mode .border-primary,
    html.light-mode .border-primary\/40,
    html.light-mode .border-primary\/60 {
      border-color: #d97706 !important;
    }
    html.light-mode .bg-primary {
      background-color: #d97706 !important;
      color: #ffffff !important;
    }
    html.light-mode .bg-primary\/10 {
      background-color: rgba(217, 119, 6, 0.12) !important;
    }
    html.light-mode .hover\:bg-primary:hover {
      background-color: #d97706 !important;
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
    html.light-mode #header-my-enquiries-btn {
      background-color: rgba(217, 119, 6, 0.08) !important;
      border-color: rgba(217, 119, 6, 0.6) !important;
      color: #d97706 !important;
    }

    html.light-mode #auth-header-btn {
      background: transparent !important;
      background-color: transparent !important;
      border: none !important;
      color: #d97706 !important;
      box-shadow: none !important;
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
      --dn-clr-bg-day: #92A6BA;
      --dn-clr-bg-night: #3C3C3C;
      --dn-clr-sun: #ff7722;
      --dn-clr-sun-lgt: #ffe5d6;
      --dn-clr-moon: #9CAEC1;
      --dn-button-width: 1.0rem;
    }

    html.light-mode {
      --dn-clr-sun: #ff7722;
      --dn-clr-sun-lgt: #fff0e6;
      --dn-clr-bg-day: #92A6BA;
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

// Auto Initialize
document.addEventListener("DOMContentLoaded", () => {
  updateToggleButtons();
  setTimeout(updateToggleButtons, 200);
});
