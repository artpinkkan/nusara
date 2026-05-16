"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useInView,
} from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ArrowRight,
  Check,
  Tag,
  Layers,
  FlaskConical,
  Apple,
  Sparkles,
  Beaker,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const WD_FEATURES = [
  {
    name: "Multi-material BOM dispensing",
    desc: "Execute multi-material batches directly from Bill of Materials",
  },
  {
    name: "Partial validation + write-locks",
    desc: "Step-level validation with write-locks preventing uncommitted changes",
  },
  {
    name: "Container / LPN tracking",
    desc: "Track every container and licence plate number throughout the process",
  },
  {
    name: "Supervisor authorization flows",
    desc: "Built-in approval workflows for exception handling and out-of-tolerance events",
  },
  {
    name: "Label printing (ZPL)",
    desc: "Automatic ZPL label printing at each dispensing step",
  },
  {
    name: "Calibration management",
    desc: "Manage calibration schedules and certificates for all connected scales",
  },
  {
    name: "Audit trail + e-signature",
    desc: "Immutable audit trail with e-signatures on every action",
  },
  {
    name: "EU Annex 11 / GxP ready",
    desc: "Designed to satisfy EU Annex 11 and GxP regulatory requirements",
  },
  {
    name: "Standard reporting suite",
    desc: "Out-of-the-box reports for batch records and audit summaries",
  },
  {
    name: "Unlimited users",
    desc: "No per-seat licensing; deploy to every user at no extra cost",
  },
];

const CW_FEATURES = [
  {
    name: "IPC tolerance verification",
    desc: "Per-product IPC tolerance rules enforced at the line automatically",
  },
  {
    name: "MB label generation (ZPL)",
    desc: "Automatic master box label printing via ZPL on a successful check",
  },
  {
    name: "Pack structure: CB / MB / BLS",
    desc: "Full support for carton-box, master-box, and blister pack structures",
  },
  {
    name: "Reprint + sample label flows",
    desc: "Configurable reprint and sample-label workflows with QA gating",
  },
  {
    name: "Automatic check weighing",
    desc: "Scale-triggered automatic weighing with no manual input required",
  },
  {
    name: "Audit trail + e-signature",
    desc: "Immutable audit trail with e-signatures on every action",
  },
  {
    name: "EU Annex 11 / GxP ready",
    desc: "Designed to satisfy EU Annex 11 and GxP regulatory requirements",
  },
  {
    name: "Standard reporting suite",
    desc: "Out-of-the-box reports for check-weigh results and QA summaries",
  },
  {
    name: "Unlimited packaging lines",
    desc: "No line-count cap; deploy across every packaging line under one licence",
  },
  {
    name: "Unlimited users",
    desc: "No per-seat licensing; deploy to every user at no extra cost",
  },
];

const PRODUCT_TAGS = [
  "Perpetual License",
  "On-Premise",
  "GxP / EU Annex 11",
  "Unlimited Users",
  "Made in Indonesia",
];

const COMING_SOON = [
  { code: "WS-FnB", name: "Food & Beverage", icon: Apple, color: "#F59E0B" },
  { code: "WS-Nutritional", name: "Nutritional Products", icon: Sparkles, color: "#8B5CF6" },
  { code: "WS-Cosmetics", name: "Cosmetics & Personal Care", icon: FlaskConical, color: "#EC4899" },
  { code: "WS-Chemical", name: "Industrial Chemical", icon: Beaker, color: "#0EA5E9" },
];

// ─── Animation Variants ───────────────────────────────────────────────────────

type Easing = [number, number, number, number];
const smooth: Easing = [0.25, 0.46, 0.45, 0.94];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const featureItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: smooth } },
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: smooth } },
};

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({ name, desc, accentColor }: { name: string; desc: string; accentColor: string }) {
  return (
    <motion.div
      variants={featureItemVariants}
      className="bg-white rounded-xl p-5 flex gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      <div
        className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: accentColor + "20", color: accentColor }}
      >
        <Check size={13} strokeWidth={3} />
      </div>
      <div>
        <p className="font-semibold text-sm leading-snug mb-1" style={{ color: "#0D1B2D" }}>
          {name}
        </p>
        <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [hovered, setHovered] = useState<"wd" | "cw" | null>(null);
  const [activeTab, setActiveTab] = useState<"wd" | "cw">("wd");
  const [scrolled, setScrolled] = useState(false);

  const featuresRef = useRef<HTMLDivElement>(null);
  const bundleRef = useRef<HTMLDivElement>(null);
  const comingSoonRef = useRef<HTMLDivElement>(null);

  const bundleInView = useInView(bundleRef, { once: true, margin: "-100px" });
  const comingSoonInView = useInView(comingSoonRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollToFeatures = (tab: "wd" | "cw") => {
    setActiveTab(tab);
    setTimeout(() => {
      featuresRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 60);
  };

  const wdBasis = hovered === "wd" ? "60%" : hovered === "cw" ? "40%" : "50%";
  const cwBasis = hovered === "cw" ? "60%" : hovered === "wd" ? "40%" : "50%";

  return (
    <div className="min-h-screen" style={{ fontFamily: "'KalbeSystem', system-ui, sans-serif" }}>

      {/* ── Sticky Nav ───────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-[60px] transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(13,27,45,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        }}
      >
        <a
          href="#"
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: "rgba(255,255,255,0.55)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
        >
          <ChevronLeft size={16} />
          Back to site
        </a>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Image
            src={scrolled ? "/logo-white.png" : "/logo.png"}
            alt="Nusara Technology"
            width={120}
            height={32}
            className="object-contain"
            style={{ height: "32px", width: "auto" }}
            priority
          />
        </div>

        <div
          className="text-xs font-medium px-3 py-1 rounded-full"
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Nusara WS-Pharma
        </div>
      </nav>

      {/* ── Split Hero ───────────────────────────────────────────────────── */}
      <section
        className="flex overflow-hidden relative"
        style={{ height: "100vh", backgroundColor: "#0D1B2D" }}
      >
        {/* WS-WD Panel */}
        <motion.div
          className="relative flex flex-col justify-center items-center cursor-pointer overflow-hidden"
          animate={{ flexBasis: wdBasis }}
          transition={{ duration: 0.45, ease: smooth }}
          onHoverStart={() => setHovered("wd")}
          onHoverEnd={() => setHovered(null)}
          onClick={() => scrollToFeatures("wd")}
          style={{ borderRight: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}
        >
          {/* Gradient bg */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, #0D1B2D, #0f2348, #1E3A8A)",
              opacity: 0.18,
            }}
          />
          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 60% 40%, rgba(30,58,138,0.12) 0%, transparent 60%)",
            }}
          />

          {/* Dim overlay */}
          <AnimatePresence>
            {hovered === "cw" && (
              <motion.div
                className="absolute inset-0 pointer-events-none z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ backgroundColor: "rgba(0,0,0,0.38)" }}
              />
            )}
          </AnimatePresence>

          <motion.div
            className="relative z-20 flex flex-col items-center text-center px-10 max-w-sm mx-auto"
            animate={{ opacity: hovered === "cw" ? 0.5 : 1 }}
            transition={{ duration: 0.35 }}
          >
            <motion.span
              className="text-xs font-bold px-3 py-1 rounded-full mb-5 tracking-widest uppercase"
              style={{ backgroundColor: "#1E3A8A", color: "#fff" }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              WS-WD
            </motion.span>

            <motion.h2
              className="text-white mb-2 leading-tight"
              style={{ fontSize: "2.6rem", fontWeight: 700 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Nusara Dispense
            </motion.h2>
            <motion.p
              className="text-slate-400 text-sm mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Weighing &amp; Dispensing
            </motion.p>

            <div
              className="w-12 mb-6"
              style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.15)" }}
            />

            <ul className="flex flex-col gap-2.5 text-left w-full mb-8">
              {["Multi-material BOM dispensing", "Partial validation + write-locks", "Unlimited users"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                  <Check size={12} strokeWidth={3} style={{ color: "#60a5fa", flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>

            <motion.button
              className="text-xs font-semibold px-5 py-2 rounded-full border border-white/30 text-white flex items-center gap-1.5 transition-colors duration-200"
              whileHover={{ scale: 1.04, backgroundColor: "#fff", color: "#0D1B2D" }}
              whileTap={{ scale: 0.97 }}
              style={{ backgroundColor: "transparent" }}
            >
              Explore module
              <ArrowRight size={13} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Centre divider */}
        <div className="absolute left-1/2 top-0 bottom-0 z-30 flex flex-col items-center justify-center pointer-events-none -translate-x-1/2">
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div
              className="w-px"
              style={{
                height: "80px",
                background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2))",
              }}
            />
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base"
              style={{
                backgroundColor: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              N
            </div>
            <div
              className="w-px"
              style={{
                height: "80px",
                background: "linear-gradient(to top, transparent, rgba(255,255,255,0.2))",
              }}
            />
          </motion.div>
        </div>

        {/* WS-CW Panel */}
        <motion.div
          className="relative flex flex-col justify-center items-center cursor-pointer overflow-hidden"
          animate={{ flexBasis: cwBasis }}
          transition={{ duration: 0.45, ease: smooth }}
          onHoverStart={() => setHovered("cw")}
          onHoverEnd={() => setHovered(null)}
          onClick={() => scrollToFeatures("cw")}
          style={{ flexShrink: 0 }}
        >
          {/* Gradient bg */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, #0D1B2D, #0a2318, #16A34A)",
              opacity: 0.18,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 40% 40%, rgba(22,163,74,0.12) 0%, transparent 60%)",
            }}
          />

          {/* Dim overlay */}
          <AnimatePresence>
            {hovered === "wd" && (
              <motion.div
                className="absolute inset-0 pointer-events-none z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ backgroundColor: "rgba(0,0,0,0.38)" }}
              />
            )}
          </AnimatePresence>

          <motion.div
            className="relative z-20 flex flex-col items-center text-center px-10 max-w-sm mx-auto"
            animate={{ opacity: hovered === "wd" ? 0.5 : 1 }}
            transition={{ duration: 0.35 }}
          >
            <motion.span
              className="text-xs font-bold px-3 py-1 rounded-full mb-5 tracking-widest uppercase"
              style={{ backgroundColor: "#16A34A", color: "#fff" }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              WS-CW
            </motion.span>

            <motion.h2
              className="text-white mb-2 leading-tight"
              style={{ fontSize: "2.6rem", fontWeight: 700 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              Nusara CheckWeigh
            </motion.h2>
            <motion.p
              className="text-slate-400 text-sm mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              Check Weighing
            </motion.p>

            <div
              className="w-12 mb-6"
              style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.15)" }}
            />

            <ul className="flex flex-col gap-2.5 text-left w-full mb-8">
              {["IPC tolerance verification", "MB label generation (ZPL)", "Unlimited packaging lines"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                  <Check size={12} strokeWidth={3} style={{ color: "#4ade80", flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>

            <motion.button
              className="text-xs font-semibold px-5 py-2 rounded-full border border-white/30 text-white flex items-center gap-1.5 transition-colors duration-200"
              whileHover={{ scale: 1.04, backgroundColor: "#fff", color: "#0D1B2D" }}
              whileTap={{ scale: 0.97 }}
              style={{ backgroundColor: "transparent" }}
            >
              Explore module
              <ArrowRight size={13} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1">
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={22} style={{ color: "rgba(255,255,255,0.35)" }} />
          </motion.div>
          <span
            className="text-[10px] tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            Scroll
          </span>
        </div>
      </section>

      {/* ── Feature Detail Section ───────────────────────────────────────── */}
      <section
        ref={featuresRef}
        className="py-20 px-6"
        style={{ backgroundColor: "#F8FAFC" }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Tab switcher */}
          <div className="flex gap-0 border-b border-gray-200 mb-12">
            {(["wd", "cw"] as const).map((tab) => {
              const isActive = activeTab === tab;
              const label = tab === "wd" ? "WS-WD · Nusara Dispense" : "WS-CW · Nusara CheckWeigh";
              const color = tab === "wd" ? "#1E3A8A" : "#16A34A";
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative pb-3 pt-1 px-5 text-sm font-semibold transition-colors duration-200 focus:outline-none"
                  style={{ color: isActive ? color : "#94a3b8" }}
                >
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 rounded-full"
                      style={{ height: "2.5px", backgroundColor: color }}
                      transition={{ duration: 0.3, ease: smooth }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: smooth }}
            >
              {/* Product header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase"
                      style={{
                        backgroundColor: activeTab === "wd" ? "#1E3A8A" : "#16A34A",
                        color: "#fff",
                      }}
                    >
                      {activeTab === "wd" ? "WS-WD" : "WS-CW"}
                    </span>
                    <h2
                      className="font-bold"
                      style={{ fontSize: "1.85rem", color: "#0D1B2D" }}
                    >
                      {activeTab === "wd" ? "Nusara Dispense" : "Nusara CheckWeigh"}
                    </h2>
                  </div>
                  <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                    {activeTab === "wd"
                      ? "A pharmaceutical weighing and dispensing module purpose-built for GxP manufacturing environments. Full BOM execution with immutable audit trail."
                      : "A check-weighing module for pharmaceutical packaging lines. Automated IPC tolerance enforcement with ZPL label printing and full traceability."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 md:max-w-xs md:justify-end">
                  {PRODUCT_TAGS.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ backgroundColor: "#e2e8f0", color: "#475569" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Feature grid */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {(activeTab === "wd" ? WD_FEATURES : CW_FEATURES).map((f) => (
                  <FeatureCard
                    key={f.name}
                    name={f.name}
                    desc={f.desc}
                    accentColor={activeTab === "wd" ? "#1E3A8A" : "#16A34A"}
                  />
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Bundle Callout ───────────────────────────────────────────────── */}
      <section
        ref={bundleRef}
        className="py-16 px-6"
        style={{ backgroundColor: "#0D1B2D" }}
      >
        <motion.div
          className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8"
          variants={slideUp}
          initial="hidden"
          animate={bundleInView ? "visible" : "hidden"}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <Tag size={16} style={{ color: "#4ade80" }} />
              <span
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: "#4ade80" }}
              >
                Bundle offer
              </span>
            </div>
            <h3
              className="font-bold text-white"
              style={{ fontSize: "1.6rem" }}
            >
              Bundle: WS-WD + WS-CW
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-md">
              Purchase both modules together and receive{" "}
              <strong className="text-white">15% off</strong> the combined list
              price. One platform, complete pharmaceutical weighing coverage.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 flex-shrink-0">
            <div
              className="px-8 py-4 rounded-2xl flex flex-col items-center"
              style={{ backgroundColor: "#16A34A" }}
            >
              <span
                className="text-white font-bold"
                style={{ fontSize: "2rem" }}
              >
                Save 15%
              </span>
            </div>
            <p className="text-slate-400 text-xs">Bundle pricing available on request</p>
          </div>
        </motion.div>
      </section>

      {/* ── Coming Soon ──────────────────────────────────────────────────── */}
      <section
        ref={comingSoonRef}
        className="py-20 px-6"
        style={{ backgroundColor: "#F8FAFC" }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate={comingSoonInView ? "visible" : "hidden"}
            className="mb-10 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Layers size={14} style={{ color: "#94a3b8" }} />
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: "#94a3b8" }}
              >
                Coming soon · Nusara Weighing Solution
              </span>
            </div>
            <h2
              className="font-bold"
              style={{ fontSize: "2rem", color: "#0D1B2D" }}
            >
              Expanding beyond pharma
            </h2>
            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
              The Nusara platform is designed to scale across industries that
              demand precision weighing and full traceability.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate={comingSoonInView ? "visible" : "hidden"}
          >
            {COMING_SOON.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.code}
                  variants={featureItemVariants}
                  className="bg-white rounded-2xl p-6 flex flex-col items-center text-center gap-3 border border-gray-100 cursor-default"
                  style={{ opacity: 0.62 }}
                  whileHover={{
                    opacity: 0.88,
                    y: -4,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-1"
                    style={{ backgroundColor: item.color + "18" }}
                  >
                    <Icon size={22} style={{ color: item.color }} />
                  </div>
                  <span
                    className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded"
                    style={{ backgroundColor: item.color + "18", color: item.color }}
                  >
                    {item.code}
                  </span>
                  <p className="font-semibold text-sm" style={{ color: "#0D1B2D" }}>
                    {item.name}
                  </p>
                  <span
                    className="text-xs px-3 py-1 rounded-full font-medium mt-auto"
                    style={{ backgroundColor: "#f1f5f9", color: "#94a3b8" }}
                  >
                    In Development
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        className="py-8 px-6 border-t border-slate-200"
        style={{ backgroundColor: "#F8FAFC" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Image
            src="/logo.png"
            alt="Nusara Technology"
            width={100}
            height={28}
            className="object-contain"
            style={{ height: "28px", width: "auto", opacity: 0.55 }}
          />
          <p className="text-xs text-slate-400 text-center">
            &copy; {new Date().getFullYear()} Nusara Technology. All rights reserved.&nbsp;&nbsp;|&nbsp;&nbsp;Pharmaceutical Weighing Software
          </p>
        </div>
      </footer>

    </div>
  );
}
