"use client";

import {
  Building2,
  Lock,
  Menu,
  PhoneCall,
  Search,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import React from "react";
import type { useAuth } from "../projects/useAuth";

interface NavbarProps {
  onOpenAdminGate: () => void;
  onOpenAdminDashboard: () => void;
  auth: ReturnType<typeof useAuth>;
  onSelectCategory?: (category: string) => void;
  activeCategory?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdminGate,
  onOpenAdminDashboard,
  auth,
  onSelectCategory,
  activeCategory = "all",
  searchQuery = "",
  onSearchChange,
}) => {
  const { session } = auth;
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#0e0e14]/90 border-b border-white/10 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary via-amber-500 to-amber-300 p-0.5 shadow-[0_0_20px_rgba(255,119,34,0.3)] transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-[#0e0e14] rounded-[10px] flex items-center justify-center">
              <span className="font-serif text-primary font-black text-xl">
                अ
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                ACHYUTAM
              </span>
              <span className="text-[10px] font-mono text-primary font-bold px-1.5 py-0.5 rounded bg-primary/10 border border-primary/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] font-mono tracking-widest text-on-surface-variant/70 uppercase -mt-0.5">
              Architects &amp; Builder
            </p>
          </div>
        </a>

        {/* Global Search Box (Desktop) */}
        {onSearchChange && (
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search landmarks by title, location, client, or tech..."
                className="w-full bg-[#161620] border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono uppercase tracking-wider">
          <a
            href="/"
            className="text-primary font-bold transition-colors flex items-center gap-1"
          >
            <Building2 className="w-3.5 h-3.5" /> Projects Showcase
          </a>

          <a
            href="#about-achyutam"
            className="text-on-surface-variant hover:text-white transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> About Achyutam
          </a>

          <a
            href="enquire.html"
            className="text-on-surface-variant hover:text-white transition-colors flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5 text-primary" /> Consultation
            &amp; Contact
          </a>
        </nav>

        {/* Right Action: Admin Security Gate & Quick Enquire */}
        <div className="flex items-center gap-3">
          {session.isAuthenticated ? (
            <button
              type="button"
              onClick={onOpenAdminDashboard}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider hover:bg-emerald-500/30 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Admin Portal</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAdminGate}
              className="px-3.5 py-2 rounded-xl bg-surface-container border border-white/10 text-on-surface-variant hover:text-primary hover:border-primary/40 font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Restricted Admin Gate (Dual-Layer Auth)"
            >
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Admin Login</span>
            </button>
          )}

          <a
            href="enquire.html"
            className="hidden sm:flex px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-amber-500 hover:opacity-95 text-background font-mono text-xs font-bold uppercase tracking-wider transition-all items-center gap-1.5 shadow-[0_0_20px_rgba(255,119,34,0.3)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consultation</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-white"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#121219] p-4 space-y-3 font-mono text-xs uppercase">
          {onSearchChange && (
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search projects..."
                className="w-full bg-[#181824] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white focus:border-primary focus:outline-none"
              />
            </div>
          )}
          <a
            href="/"
            className="block py-2 text-primary font-bold"
            onClick={() => setMobileMenuOpen(false)}
          >
            Projects Showcase
          </a>
          <button
            type="button"
            className="block py-2 text-on-surface-variant hover:text-white text-left w-full"
            onClick={() => {
              setMobileMenuOpen(false);
              document
                .getElementById("about-achyutam")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            About Achyutam Builder
          </button>
          <a
            href="enquire.html"
            className="block py-2 text-on-surface-variant hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Book Consultation &amp; Contact
          </a>
        </div>
      )}
    </header>
  );
};
