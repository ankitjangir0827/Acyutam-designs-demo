"use client";

import {
  ArrowRight,
  Award,
  Clock,
  Compass,
  FileCheck2,
  HardHat,
  Layers,
  Mail,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type React from "react";

interface AboutAchyutamProps {
  onOpenEnquiry?: () => void;
}

export const AboutAchyutam: React.FC<AboutAchyutamProps> = ({
  onOpenEnquiry,
}) => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "IS Structural Code Compliance",
      description:
        "Engineered to Bureau of Indian Standards IS 456 (RCC), IS 1893 (Seismic Zones II–IV), and NBC 2016 for multi-generational permanence.",
      highlight: "IS 456 / IS 1893 / NBC",
    },
    {
      icon: Compass,
      title: "Vedic Vastu & Sacred Geometry",
      description:
        "Integrating authentic Vedic Vastu Shastra with contemporary spatial engineering to foster prosperity, natural light, and spiritual harmony.",
      highlight: "Vedic Spatial Geometry",
    },
    {
      icon: HardHat,
      title: "Turnkey Project Execution",
      description:
        "Complete lifecycle execution from soil strata testing, 3D architectural design, structural engineering to turnkey interior handovers.",
      highlight: "Full EPC / Turnkey PMC",
    },
    {
      icon: Award,
      title: "Certified Material Testing",
      description:
        "Strict batch testing of M30/M40 grade RMC, Fe550D high-ductility TMT rebars, and ultrasonic weld tests with complete lab certifications.",
      highlight: "Fe550D • M35+ RMC",
    },
  ];

  const regionalHubs = [
    {
      name: "Head Office (Sikar)",
      address:
        "1st floor, Pawan Market, Station Road, Sikar 332001 Rajasthan India",
      type: "Headquarters & Corporate Studio",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=1st+Floor+Pawan+Market+Station+Road+Sikar+Rajasthan+332001",
    },
    {
      name: "Branch Office (Mathura)",
      address: "Radha kund Goverdhan Mathura U.P.",
      type: "Sacred Heritage & Regional Hub",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Radhakund+Goverdhan+Mathura+UP",
    },
    {
      name: "Branch Office (Dharamshala)",
      address: "Civil bazar Dharamshala, H.P.",
      type: "Hill Infrastructure & Branch Studio",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Civil+Bazar+Dharamshala+HP",
    },
  ];

  return (
    <section
      id="about-achyutam"
      className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
    >
      {/* Background Ambient Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Container Card */}
      <div className="rounded-3xl bg-[#12121a]/90 border border-white/10 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl space-y-12">
        {/* Brand Header & Profile */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 border-b border-white/10 pb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Logo Badge */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary/25 via-[#161622] to-amber-500/20 border-2 border-primary/60 ring-2 ring-primary/20 flex items-center justify-center p-1.5 shadow-[0_0_30px_rgba(255,119,34,0.3)] group-hover:scale-105 transition-transform overflow-hidden">
                <img
                  src="/photos and videos/logo.png"
                  alt="Achyutam Builder Logo"
                  className="w-full h-full rounded-full object-cover filter drop-shadow-md"
                  onError={(e) => {
                    // Fallback to stylized emblem if logo image fails
                    e.currentTarget.style.display = "none";
                    const fallback =
                      e.currentTarget.parentElement?.querySelector(
                        ".fallback-emblem",
                      );
                    if (fallback) fallback.classList.remove("hidden");
                  }}
                />
                <span className="fallback-emblem hidden font-serif font-bold text-3xl text-primary">
                  अ
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-primary text-background font-mono text-[9px] font-bold uppercase tracking-wider shadow">
                Since 2020
              </div>
            </div>

            {/* Brand Title & Mission */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-mono text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ACHYUTAM BUILDER® • Turnkey Projects</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal tracking-tight">
                Achyutam Builder &amp; Architects
              </h2>
              <p className="font-mono text-xs sm:text-sm text-primary tracking-widest uppercase">
                Experience the experts • Since 2005 in Dubai &amp; Since 2020 in
                India
              </p>
              <p className="text-sm text-on-surface-variant max-w-2xl font-sans pt-1 leading-relaxed">
                Registered under the Companies Act, 1956 (Reg. No:
                8005270035000293 | GSTIN: 08DIYPG7301D1Z5), Achyutam Builder
                executes high-calibre turnkey architectural, industrial,
                residential, and monumental heritage developments across
                Rajasthan, UP, and Himachal Pradesh.
              </p>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="tel:9116400862"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-amber-500 hover:opacity-90 text-background font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,119,34,0.3)] cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call: +91 9116400862</span>
            </a>
            <a
              href="#showcase"
              className="px-6 py-3 rounded-xl bg-surface-container hover:bg-white/10 text-white border border-white/10 font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Portfolio</span>
              <ArrowRight className="w-4 h-4 text-primary" />
            </a>
          </div>
        </div>

        {/* Executive Leadership Highlight: Ram Gopal Jangir (Chief & CEO) */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-[#181824] to-amber-500/10 border border-primary/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full border-2 border-primary/60 overflow-hidden shrink-0 shadow-[0_0_15px_rgba(255,184,0,0.3)] bg-surface-container">
              <img
                src="/photos and videos/ceo-admin-profile.png"
                alt="Er. Ram Gopal Jangir - Chief & CEO"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/logo.png";
                }}
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary font-mono text-[10px] font-bold uppercase tracking-widest mb-1">
                Executive Leadership &amp; Direction
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-white font-bold tracking-tight">
                Er. Ram Gopal Jangir
              </h3>
              <p className="font-mono text-xs text-amber-300 font-semibold tracking-wider uppercase mt-0.5">
                Founder &amp; CEO • Achyutam Builder
              </p>
            </div>
          </div>
          <div className="text-xs text-on-surface-variant font-sans max-w-md text-center md:text-right leading-relaxed border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-6">
            Pioneering precision civil engineering, Vedic Vastu structural
            masterplans, and high-tensile turnkey landmark executions across
            India and international territories.
          </div>
        </div>

        {/* Official Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-surface-container-low border border-white/5 font-mono text-xs">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/60 border border-white/5">
            <FileCheck2 className="w-5 h-5 text-primary shrink-0" />
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block">
                Registration
              </span>
              <span className="text-white font-bold text-[11px]">
                Companies Act, 1956
              </span>
              <span className="text-[10px] text-amber-400 block">
                Reg: 8005270035000293
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/60 border border-white/5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block">
                GSTIN Certificate
              </span>
              <span className="text-white font-bold text-[11px]">
                08DIYPG7301D1Z5
              </span>
              <span className="text-[10px] text-emerald-400 block">
                Govt. Verified Taxpayer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/60 border border-white/5">
            <Clock className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block">
                Global Track Record
              </span>
              <span className="text-white font-bold text-[11px]">
                Since 2005 in Dubai
              </span>
              <span className="text-[10px] text-amber-400 block">
                Since 2020 in India
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/60 border border-white/5">
            <Mail className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block">
                Official Inquiries
              </span>
              <a
                href="mailto:info@achyutambuilder.com"
                className="text-white hover:text-primary transition-colors text-[11px] block truncate"
              >
                info@achyutambuilder.com
              </a>
              <span className="text-[10px] text-on-surface-variant block">
                www.achyutambuilder.com
              </span>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl text-white flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-primary" />
              <span>Core Architectural &amp; Engineering Pillars</span>
            </h3>
            <span className="font-mono text-xs text-on-surface-variant hidden sm:inline-block">
              Zero Compromise on Structural Safety
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-5 rounded-2xl bg-surface-container/60 border border-white/5 hover:border-primary/40 transition-all group hover:-translate-y-1 duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-background transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-base font-bold text-white mb-2">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant font-sans leading-relaxed mb-3">
                    {pillar.description}
                  </p>
                  <span className="inline-block font-mono text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    {pillar.highlight}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Official Offices & Footprint */}
        <div className="p-6 rounded-2xl bg-surface-container-low/80 border border-white/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <span className="font-mono text-[10px] text-primary uppercase tracking-widest block font-bold">
                Corporate Footprint
              </span>
              <h4 className="font-serif text-lg text-white font-bold">
                Registered &amp; Branch Offices
              </h4>
            </div>
            <p className="text-xs text-on-surface-variant font-sans">
              Mobilized engineering teams across Rajasthan, Uttar Pradesh &amp;
              Himachal Pradesh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            {regionalHubs.map((hub) => (
              <a
                key={hub.name}
                href={hub.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-surface-container/50 border border-white/5 hover:border-primary/40 transition-all space-y-1.5 group block"
              >
                <div className="flex items-center justify-between text-primary font-bold text-xs uppercase">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                    <span>{hub.name}</span>
                  </div>
                  <span className="text-[10px] opacity-60 group-hover:opacity-100 group-hover:text-primary transition-opacity">
                    ↗
                  </span>
                </div>
                <p className="text-xs text-white/90 font-sans group-hover:text-amber-300 transition-colors">
                  {hub.address}
                </p>
                <span className="inline-block text-[10px] text-amber-400 font-mono">
                  {hub.type}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
