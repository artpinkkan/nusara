"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown, ChevronLeft, ArrowRight, Check, Tag, Layers } from "lucide-react";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const NAVY  = "#0D1B2D";
const BLUE  = "#1E3A8A";
const GREEN = "#16A34A";
const BG    = "#F8FAFC";

// ─── Data ─────────────────────────────────────────────────────────────────────
const WD_FEATURES = [
  { name: "Multi-material BOM dispensing",      desc: "Execute multi-material batches directly from Bill of Materials." },
  { name: "Partial validation + write-locks",   desc: "Step-level validation with write-locks preventing uncommitted changes." },
  { name: "Container / LPN tracking",           desc: "Track every container and licence plate number throughout the process." },
  { name: "Supervisor authorization flows",     desc: "Built-in approval workflows for exception handling and out-of-tolerance events." },
  { name: "Label printing (ZPL)",               desc: "Automatic ZPL label printing at each dispensing step." },
  { name: "Calibration management",             desc: "Manage calibration schedules and certificates for all connected scales." },
  { name: "Audit trail + e-signature",          desc: "Immutable audit trail with e-signatures on every user action." },
  { name: "EU Annex 11 / GxP ready",            desc: "Designed to satisfy EU Annex 11 and GxP regulatory requirements." },
  { name: "Standard reporting suite",           desc: "Out-of-the-box reports for batch records and audit summaries." },
  { name: "Unlimited users",                    desc: "No per-seat licensing — deploy to every user at no extra cost." },
];

const CW_FEATURES = [
  { name: "IPC tolerance verification",         desc: "Per-product IPC tolerance rules enforced at the line automatically." },
  { name: "MB label generation (ZPL)",          desc: "Automatic master box label printing via ZPL on a successful check." },
  { name: "Pack structure: CB / MB / BLS",      desc: "Full support for carton-box, master-box, and blister pack structures." },
  { name: "Reprint + sample label flows",       desc: "Configurable reprint and sample-label workflows with QA gating." },
  { name: "Automatic check weighing",           desc: "Scale-triggered automatic weighing with no manual input required." },
  { name: "Audit trail + e-signature",          desc: "Immutable audit trail with e-signatures on every user action." },
  { name: "EU Annex 11 / GxP ready",            desc: "Designed to satisfy EU Annex 11 and GxP regulatory requirements." },
  { name: "Standard reporting suite",           desc: "Out-of-the-box reports for check-weigh results and QA summaries." },
  { name: "Unlimited packaging lines",          desc: "No line-count cap — deploy across every packaging line under one licence." },
  { name: "Unlimited users",                    desc: "No per-seat licensing — deploy to every user at no extra cost." },
];

const PRODUCT_TAGS = ["Perpetual License", "On-Premise", "GxP / EU Annex 11", "Unlimited Users", "Made in Indonesia"];

const COMING_SOON = [
  { code: "WS-FnB",         name: "Food & Beverage",           color: "#F59E0B" },
  { code: "WS-Nutritional", name: "Nutritional Products",      color: "#8B5CF6" },
  { code: "WS-Cosmetics",   name: "Cosmetics & Personal Care", color: "#EC4899" },
  { code: "WS-Chemical",    name: "Industrial Chemical",       color: "#0EA5E9" },
];

// Inline SVGs for coming-soon icons (avoids lucide naming inconsistencies)
const COMING_SOON_ICONS: Record<string, React.ReactNode> = {
  "WS-FnB": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
  "WS-Nutritional": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
      <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  "WS-Cosmetics": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  "WS-Chemical": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
      <path d="M10 2v7.31"/><path d="M14 9.3V2"/><path d="M8.79 9.18A10 10 0 1 0 21 17"/><path d="M10 2h4"/>
    </svg>
  ),
};

// ─── Animation variants ────────────────────────────────────────────────────────
const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};
const slideUp = {
  hidden:  { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ name, desc, accent }: { name: string; desc: string; accent: string }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(13,27,45,0.1)" }}
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        padding: "18px 20px",
        display: "flex",
        gap: 14,
        boxShadow: "0 1px 4px rgba(13,27,45,0.06)",
      }}
    >
      <div style={{
        width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
        backgroundColor: accent + "1A",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginTop: 2,
      }}>
        <Check size={13} strokeWidth={3} color={accent} />
      </div>
      <div>
        <p style={{ fontWeight: 700, fontSize: "0.84rem", color: NAVY, marginBottom: 4, lineHeight: 1.4 }}>{name}</p>
        <p style={{ fontSize: "0.77rem", color: "#64748b", lineHeight: 1.6 }}>{desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Hero panel component ──────────────────────────────────────────────────────
interface HeroPanelProps {
  side: "left" | "right";
  code: string;
  name: string;
  subtitle: string;
  accent: string;
  gradient: string;
  teaser: string[];
  isHovered: boolean;
  otherHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

function HeroPanel({ side, code, name, subtitle, accent, gradient, teaser, isHovered, otherHovered, onHover, onLeave, onClick }: HeroPanelProps) {
  const checkColor = accent === BLUE ? "#93c5fd" : "#86efac";

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        position: "relative",
        flex: isHovered ? "0 0 62%" : otherHovered ? "0 0 38%" : "0 0 50%",
        transition: "flex 0.48s cubic-bezier(0.25,0.46,0.45,0.94)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        overflow: "hidden",
        borderRight: side === "left" ? "1px solid rgba(255,255,255,0.08)" : "none",
      }}
    >
      {/* Gradient fill */}
      <div style={{ position: "absolute", inset: 0, background: gradient }} />
      {/* Glow */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(ellipse at ${side === "left" ? "65% 50%" : "35% 50%"}, ${accent}28 0%, transparent 65%)`,
      }} />
      {/* Dim overlay when other side is hovered */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundColor: "rgba(0,0,0,0.42)",
        opacity: otherHovered ? 1 : 0,
        transition: "opacity 0.35s",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <motion.div
        animate={{ opacity: otherHovered ? 0.45 : 1 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", padding: "0 52px", maxWidth: 400,
        }}
      >
        <motion.span
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: side === "left" ? 0.25 : 0.35, duration: 0.5 }}
          style={{
            fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "#fff",
            backgroundColor: accent, padding: "4px 14px", borderRadius: 999,
            marginBottom: 22, display: "inline-block",
          }}
        >
          {code}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: side === "left" ? 0.35 : 0.45, duration: 0.5 }}
          style={{ color: "#fff", fontSize: "clamp(1.9rem, 2.8vw, 2.6rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: 8 }}
        >
          {name}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: side === "left" ? 0.45 : 0.55 }}
          style={{ color: "#94a3b8", fontSize: "0.88rem", marginBottom: 28 }}
        >
          {subtitle}
        </motion.p>

        <div style={{ width: 36, height: 1, backgroundColor: "rgba(255,255,255,0.15)", marginBottom: 28 }} />

        <ul style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left", width: "100%", marginBottom: 36, listStyle: "none" }}>
          {teaser.map(f => (
            <li key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: "0.8rem", color: "#cbd5e1" }}>
              <Check size={12} strokeWidth={3} style={{ color: checkColor, flexShrink: 0 }} />
              {f}
            </li>
          ))}
        </ul>

        <motion.button
          whileHover={{ scale: 1.04, backgroundColor: "#fff", color: NAVY }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: "0.8rem", fontWeight: 600,
            padding: "9px 22px", borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.28)",
            color: "#fff", backgroundColor: "transparent",
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Explore module <ArrowRight size={13} />
        </motion.button>
      </motion.div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [hovered,   setHovered]   = useState<"wd" | "cw" | null>(null);
  const [activeTab, setActiveTab] = useState<"wd" | "cw">("wd");
  const [scrolled,  setScrolled]  = useState(false);

  const featuresRef    = useRef<HTMLDivElement>(null);
  const bundleRef      = useRef<HTMLDivElement>(null);
  const comingSoonRef  = useRef<HTMLDivElement>(null);

  const bundleInView  = useInView(bundleRef,    { once: true, margin: "-80px" });
  const comingInView  = useInView(comingSoonRef, { once: true, margin: "-60px" });

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollToFeatures = (tab: "wd" | "cw") => {
    setActiveTab(tab);
    setTimeout(() => featuresRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const accent   = activeTab === "wd" ? BLUE : GREEN;
  const features = activeTab === "wd" ? WD_FEATURES : CW_FEATURES;
  const prodName = activeTab === "wd" ? "Nusara Dispense" : "Nusara CheckWeigh";
  const prodDesc = activeTab === "wd"
    ? "A pharmaceutical weighing and dispensing module purpose-built for GxP manufacturing environments. Full BOM execution with immutable audit trail."
    : "A check-weighing module for pharmaceutical packaging lines. Automated IPC tolerance enforcement with ZPL label printing and full traceability.";

  return (
    <div style={{ fontFamily: "'KalbeSystem', system-ui, sans-serif", overflowX: "hidden", background: BG }}>

      {/* ── Sticky nav ─────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px",
        backgroundColor: scrolled ? "rgba(13,27,45,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        transition: "background-color 0.3s, border-color 0.3s, backdrop-filter 0.3s",
      }}>
        <a href="#" style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: "0.82rem", color: "rgba(255,255,255,0.5)",
          textDecoration: "none", transition: "color 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
        >
          <ChevronLeft size={15} /> Back to site
        </a>

        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          <Image src="/logo-white.png" alt="Nusara Technology" width={120} height={32}
            style={{ height: 32, width: "auto", objectFit: "contain" }} priority />
        </div>

        <span style={{
          fontSize: "0.73rem", fontWeight: 600, letterSpacing: "0.06em",
          padding: "4px 12px", borderRadius: 999,
          backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)",
        }}>
          Nusara WS-Pharma
        </span>
      </nav>

      {/* ── Split hero ─────────────────────────────────────────────────────── */}
      <section style={{
        height: "100vh", minHeight: 600,
        backgroundColor: NAVY,
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}>
        <HeroPanel
          side="left" code="WS-WD" name="Nusara Dispense" subtitle="Weighing & Dispensing"
          accent={BLUE}
          gradient="linear-gradient(150deg, #0D1B2D 0%, #0f2348 55%, #1a3a8a 100%)"
          teaser={["Multi-material BOM dispensing", "Partial validation + write-locks", "Unlimited users"]}
          isHovered={hovered === "wd"}
          otherHovered={hovered === "cw"}
          onHover={() => setHovered("wd")}
          onLeave={() => setHovered(null)}
          onClick={() => scrollToFeatures("wd")}
        />

        {/* Centre divider */}
        <div style={{
          position: "absolute", left: "50%", top: 0, bottom: 0, zIndex: 30,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          pointerEvents: "none", transform: "translateX(-50%)",
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <div style={{ width: 1, height: 80, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.18))" }} />
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "0.9rem", fontWeight: 700,
            }}>N</div>
            <div style={{ width: 1, height: 80, background: "linear-gradient(to top, transparent, rgba(255,255,255,0.18))" }} />
          </motion.div>
        </div>

        <HeroPanel
          side="right" code="WS-CW" name="Nusara CheckWeigh" subtitle="Check Weighing"
          accent={GREEN}
          gradient="linear-gradient(150deg, #0D1B2D 0%, #0a2318 55%, #16A34A 100%)"
          teaser={["IPC tolerance verification", "MB label generation (ZPL)", "Unlimited packaging lines"]}
          isHovered={hovered === "cw"}
          otherHovered={hovered === "wd"}
          onHover={() => setHovered("cw")}
          onLeave={() => setHovered(null)}
          onClick={() => scrollToFeatures("cw")}
        />

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
          zIndex: 30, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        }}>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown size={20} style={{ color: "rgba(255,255,255,0.28)" }} />
          </motion.div>
          <span style={{ fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
            Scroll
          </span>
        </div>
      </section>

      {/* ── Feature section ───────────────────────────────────────────────── */}
      <section ref={featuresRef} style={{ backgroundColor: BG, padding: "88px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>

          {/* Tab switcher */}
          <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", marginBottom: 56 }}>
            {(["wd", "cw"] as const).map(tab => {
              const isActive  = activeTab === tab;
              const tabAccent = tab === "wd" ? BLUE : GREEN;
              const label     = tab === "wd" ? "WS-WD · Nusara Dispense" : "WS-CW · Nusara CheckWeigh";
              return (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  position: "relative", padding: "10px 24px 14px",
                  fontSize: "0.87rem", fontWeight: 600,
                  color: isActive ? tabAccent : "#94a3b8",
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "inherit", transition: "color 0.2s",
                }}>
                  {label}
                  {isActive && (
                    <motion.div layoutId="tab-line" style={{
                      position: "absolute", bottom: -2, left: 0, right: 0,
                      height: 2.5, backgroundColor: tabAccent, borderRadius: 2,
                    }} transition={{ duration: 0.3, ease }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Animated content */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -22 }}
              transition={{ duration: 0.28, ease }}
            >
              {/* Header */}
              <div style={{
                display: "flex", flexWrap: "wrap", gap: 28,
                justifyContent: "space-between", alignItems: "flex-start",
                marginBottom: 40,
              }}>
                <div style={{ flex: "1 1 320px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.15em",
                      textTransform: "uppercase", color: "#fff",
                      backgroundColor: accent, padding: "4px 13px", borderRadius: 999,
                    }}>
                      {activeTab === "wd" ? "WS-WD" : "WS-CW"}
                    </span>
                    <h2 style={{ fontSize: "clamp(1.5rem, 2.4vw, 2rem)", fontWeight: 700, color: NAVY }}>
                      {prodName}
                    </h2>
                  </div>
                  <p style={{ fontSize: "0.87rem", color: "#64748b", lineHeight: 1.75, maxWidth: 460 }}>
                    {prodDesc}
                  </p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxWidth: 300 }}>
                  {PRODUCT_TAGS.map(tag => (
                    <span key={tag} style={{
                      fontSize: "0.72rem", fontWeight: 600,
                      padding: "5px 13px", borderRadius: 999,
                      backgroundColor: "#e2e8f0", color: "#475569",
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Feature grid — 2 columns */}
              <motion.div
                variants={staggerContainer} initial="hidden" animate="visible"
                style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}
              >
                {features.map(f => (
                  <FeatureCard key={f.name} name={f.name} desc={f.desc} accent={accent} />
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Bundle callout ────────────────────────────────────────────────── */}
      <section ref={bundleRef} style={{ backgroundColor: NAVY, padding: "80px 0" }}>
        <motion.div
          variants={slideUp} initial="hidden" animate={bundleInView ? "visible" : "hidden"}
          style={{
            maxWidth: 1100, margin: "0 auto", padding: "0 40px",
            display: "flex", flexWrap: "wrap", alignItems: "center",
            justifyContent: "space-between", gap: 36,
          }}
        >
          <div style={{ flex: "1 1 340px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Tag size={14} color="#4ade80" />
              <span style={{
                fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em",
                textTransform: "uppercase", color: "#4ade80",
              }}>Bundle offer</span>
            </div>
            <h3 style={{ fontSize: "clamp(1.4rem, 2.4vw, 1.85rem)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
              Bundle: WS-WD + WS-CW
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#cbd5e1", lineHeight: 1.75 }}>
              Purchase both modules together and receive{" "}
              <strong style={{ color: "#fff" }}>15% off</strong> the combined list price.
              One platform, complete pharmaceutical weighing coverage.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{
              padding: "22px 48px", borderRadius: 20, backgroundColor: GREEN,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: "2.4rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>Save 15%</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#64748b" }}>Bundle pricing available on request</p>
          </div>
        </motion.div>
      </section>

      {/* ── Coming soon ───────────────────────────────────────────────────── */}
      <section ref={comingSoonRef} style={{ backgroundColor: BG, padding: "96px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
          <motion.div
            variants={slideUp} initial="hidden" animate={comingInView ? "visible" : "hidden"}
            style={{ textAlign: "center", marginBottom: 52 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
              <Layers size={14} color="#94a3b8" />
              <span style={{
                fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.16em",
                textTransform: "uppercase", color: "#94a3b8",
              }}>
                Coming soon · Nusara Weighing Solution
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: NAVY, marginBottom: 12 }}>
              Expanding beyond pharma
            </h2>
            <p style={{ fontSize: "0.88rem", color: "#64748b", maxWidth: 440, margin: "0 auto", lineHeight: 1.75 }}>
              The Nusara platform is designed to scale across industries that demand precision weighing and full traceability.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer} initial="hidden" animate={comingInView ? "visible" : "hidden"}
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}
          >
            {COMING_SOON.map(item => (
              <motion.div key={item.code}
                variants={fadeUp}
                whileHover={{ y: -6, opacity: 1, boxShadow: "0 12px 32px rgba(13,27,45,0.1)" }}
                style={{
                  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20,
                  padding: "36px 24px", display: "flex", flexDirection: "column",
                  alignItems: "center", textAlign: "center", gap: 12,
                  opacity: 0.62, cursor: "default",
                  boxShadow: "0 2px 8px rgba(13,27,45,0.05)",
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  backgroundColor: item.color + "1A",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: item.color,
                }}>
                  {COMING_SOON_ICONS[item.code]}
                </div>
                <span style={{
                  fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: item.color,
                  backgroundColor: item.color + "1A",
                  padding: "3px 11px", borderRadius: 999,
                }}>{item.code}</span>
                <p style={{ fontSize: "0.87rem", fontWeight: 700, color: NAVY }}>{item.name}</p>
                <span style={{
                  fontSize: "0.7rem", fontWeight: 600, color: "#94a3b8",
                  backgroundColor: "#f1f5f9", padding: "4px 14px", borderRadius: 999,
                  marginTop: 4,
                }}>In Development</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid #e2e8f0", padding: "28px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16, backgroundColor: BG,
      }}>
        <Image src="/logo.png" alt="Nusara Technology" width={100} height={28}
          style={{ height: 28, width: "auto", objectFit: "contain", opacity: 0.45 }} />
        <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
          © {new Date().getFullYear()} Nusara Technology · Pharmaceutical Weighing Software
        </p>
      </footer>

    </div>
  );
}
