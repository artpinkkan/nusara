"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ChevronDown, ChevronLeft, ArrowRight, Check, Tag, Layers } from "lucide-react";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const NAVY  = "#0D1B2D";
const BLUE  = "#1E3A8A";
const GREEN = "#16A34A";
const LIGHT = "#F8FAFC";

// ─── Data ─────────────────────────────────────────────────────────────────────
const WD_FEATURES = [
  { name: "Multi-material BOM dispensing",    desc: "Execute multi-material batches directly from Bill of Materials." },
  { name: "Partial validation + write-locks", desc: "Step-level validation with write-locks preventing uncommitted changes." },
  { name: "Container / LPN tracking",         desc: "Track every container and licence plate number throughout the process." },
  { name: "Supervisor authorization flows",   desc: "Built-in approval workflows for exception handling and out-of-tolerance events." },
  { name: "Label printing (ZPL)",             desc: "Automatic ZPL label printing at each dispensing step." },
  { name: "Calibration management",           desc: "Manage calibration schedules and certificates for all connected scales." },
  { name: "Audit trail + e-signature",        desc: "Immutable audit trail with e-signatures on every user action." },
  { name: "EU Annex 11 / GxP ready",          desc: "Designed to satisfy EU Annex 11 and GxP regulatory requirements." },
  { name: "Standard reporting suite",         desc: "Out-of-the-box reports for batch records and audit summaries." },
  { name: "Unlimited users",                  desc: "No per-seat licensing — deploy to every user at no extra cost." },
];

const CW_FEATURES = [
  { name: "IPC tolerance verification",       desc: "Per-product IPC tolerance rules enforced at the line automatically." },
  { name: "MB label generation (ZPL)",        desc: "Automatic master box label printing via ZPL on a successful check." },
  { name: "Pack structure: CB / MB / BLS",    desc: "Full support for carton-box, master-box, and blister pack structures." },
  { name: "Reprint + sample label flows",     desc: "Configurable reprint and sample-label workflows with QA gating." },
  { name: "Automatic check weighing",         desc: "Scale-triggered automatic weighing with no manual input required." },
  { name: "Audit trail + e-signature",        desc: "Immutable audit trail with e-signatures on every user action." },
  { name: "EU Annex 11 / GxP ready",          desc: "Designed to satisfy EU Annex 11 and GxP regulatory requirements." },
  { name: "Standard reporting suite",         desc: "Out-of-the-box reports for check-weigh results and QA summaries." },
  { name: "Unlimited packaging lines",        desc: "No line-count cap — deploy across every packaging line under one licence." },
  { name: "Unlimited users",                  desc: "No per-seat licensing — deploy to every user at no extra cost." },
];

const PRODUCT_TAGS = ["Perpetual License", "On-Premise", "GxP / EU Annex 11", "Unlimited Users", "Made in Indonesia"];

const COMING_SOON = [
  { code: "WS-FnB",         name: "Food & Beverage",           color: "#F59E0B" },
  { code: "WS-Nutritional", name: "Nutritional Products",      color: "#8B5CF6" },
  { code: "WS-Cosmetics",   name: "Cosmetics & Personal Care", color: "#EC4899" },
  { code: "WS-Chemical",    name: "Industrial Chemical",       color: "#0EA5E9" },
];

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

// ─── Feature row ──────────────────────────────────────────────────────────────
function FeatureRow({
  name,
  desc,
  isLast,
  accentBg,
  accentBorder,
  accentText,
}: {
  name: string;
  desc: string;
  isLast: boolean;
  accentBg: string;
  accentBorder: string;
  accentText: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 16,
        alignItems: "flex-start",
        padding: "18px 0",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Check circle */}
      <div style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        backgroundColor: accentBg,
        border: `1px solid ${accentBorder}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: 2,
      }}>
        <Check size={10} strokeWidth={2.5} color={accentText} />
      </div>
      {/* Feature name */}
      <div style={{ flex: "0 0 200px", flexShrink: 0 }}>
        <span style={{ color: "#ffffff", fontSize: "0.86rem", fontWeight: 600, lineHeight: 1.5 }}>{name}</span>
      </div>
      {/* Description */}
      <div style={{ flex: 1 }}>
        <span style={{ color: "rgba(148,163,184,0.75)", fontSize: "0.82rem", lineHeight: 1.6 }}>{desc}</span>
      </div>
    </motion.div>
  );
}

// ─── Pill badge ───────────────────────────────────────────────────────────────
function PillBadge({
  label,
  bg,
  border,
  color,
  size = "0.72rem",
}: {
  label: string;
  bg: string;
  border: string;
  color: string;
  size?: string;
}) {
  return (
    <span style={{
      display: "inline-block",
      fontSize: size,
      fontWeight: 600,
      padding: "4px 12px",
      borderRadius: 999,
      backgroundColor: bg,
      border: `1px solid ${border}`,
      color,
      letterSpacing: "0.04em",
    }}>
      {label}
    </span>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [scrolled, setScrolled] = useState(false);

  const wdRef          = useRef<HTMLElement>(null);
  const cwRef          = useRef<HTMLElement>(null);
  const bundleRef      = useRef<HTMLDivElement>(null);
  const comingSoonRef  = useRef<HTMLDivElement>(null);

  // WD section refs
  const wdLeftRef   = useRef<HTMLDivElement>(null);
  const wdRightRef  = useRef<HTMLDivElement>(null);
  const wdLeftInView  = useInView(wdLeftRef,  { once: true, margin: "-100px" });
  const wdRightInView = useInView(wdRightRef, { once: true, margin: "-100px" });

  // CW section refs
  const cwLeftRef   = useRef<HTMLDivElement>(null);
  const cwRightRef  = useRef<HTMLDivElement>(null);
  const cwLeftInView  = useInView(cwLeftRef,  { once: true, margin: "-100px" });
  const cwRightInView = useInView(cwRightRef, { once: true, margin: "-100px" });

  const bundleInView = useInView(bundleRef,     { once: true, margin: "-80px" });
  const comingInView = useInView(comingSoonRef, { once: true, margin: "-60px" });

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'KalbeSystem', system-ui, sans-serif", overflowX: "hidden", background: NAVY }}>

      {/* ── Sticky nav ───────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        backgroundColor: "rgba(13,27,45,0.97)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        <a
          href="#"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.82rem",
            color: "rgba(255,255,255,0.5)",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
        >
          <ChevronLeft size={15} /> Back to site
        </a>

        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          <Image
            src="/logo-white.png"
            alt="Nusara Technology"
            width={120}
            height={32}
            style={{ height: 32, width: "auto", objectFit: "contain" }}
            priority
          />
        </div>

        <span style={{
          fontSize: "0.72rem",
          fontWeight: 600,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.06em",
        }}>
          Nusara WS-Pharma
        </span>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section style={{
        height: "100vh",
        minHeight: 580,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: NAVY,
      }}>
        {/* Background layers */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: [
            "radial-gradient(ellipse at 25% 60%, rgba(30,58,138,0.3) 0%, transparent 55%)",
            "radial-gradient(ellipse at 75% 40%, rgba(22,163,74,0.2) 0%, transparent 55%)",
          ].join(", "),
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

        {/* Hero content */}
        <div style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 24px",
        }}>
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
            style={{
              display: "inline-block",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#fff",
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              padding: "5px 16px",
              borderRadius: 999,
              marginBottom: 28,
            }}
          >
            Nusara WS-Pharma
          </motion.span>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease }}
            style={{
              color: "#ffffff",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              fontWeight: 700,
              maxWidth: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 20,
            }}
          >
            Precision weighing for pharmaceutical manufacturing.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease }}
            style={{
              color: "rgba(148,163,184,1)",
              fontSize: "1rem",
              maxWidth: 500,
              lineHeight: 1.7,
              marginBottom: 48,
            }}
          >
            Two purpose-built modules. Full GxP compliance. On-premise, perpetual license.
          </motion.p>

          {/* Product cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4, ease }}
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: 56,
            }}
          >
            {/* WS-WD card */}
            <motion.div
              whileHover={{
                backgroundColor: "rgba(30,58,138,0.22)",
                borderColor: "rgba(30,58,138,0.6)",
                scale: 1.02,
              }}
              onClick={() => scrollTo(wdRef)}
              style={{
                width: 260,
                padding: "24px 28px",
                backgroundColor: "rgba(30,58,138,0.12)",
                border: "1px solid rgba(30,58,138,0.35)",
                borderRadius: 18,
                cursor: "pointer",
                transition: "background-color 0.2s, border-color 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <PillBadge
                  label="WS-WD"
                  bg="rgba(30,58,138,0.3)"
                  border="rgba(30,58,138,0.6)"
                  color="#93c5fd"
                  size="0.68rem"
                />
                <ArrowRight size={14} color="#94a3b8" />
              </div>
              <p style={{ color: "#ffffff", fontSize: "1.1rem", fontWeight: 700, marginTop: 12, marginBottom: 4 }}>
                Nusara Dispense
              </p>
              <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Weighing &amp; Dispensing</p>
            </motion.div>

            {/* WS-CW card */}
            <motion.div
              whileHover={{
                backgroundColor: "rgba(22,163,74,0.22)",
                borderColor: "rgba(22,163,74,0.6)",
                scale: 1.02,
              }}
              onClick={() => scrollTo(cwRef)}
              style={{
                width: 260,
                padding: "24px 28px",
                backgroundColor: "rgba(22,163,74,0.12)",
                border: "1px solid rgba(22,163,74,0.35)",
                borderRadius: 18,
                cursor: "pointer",
                transition: "background-color 0.2s, border-color 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <PillBadge
                  label="WS-CW"
                  bg="rgba(22,163,74,0.3)"
                  border="rgba(22,163,74,0.6)"
                  color="#86efac"
                  size="0.68rem"
                />
                <ArrowRight size={14} color="#94a3b8" />
              </div>
              <p style={{ color: "#ffffff", fontSize: "1.1rem", fontWeight: 700, marginTop: 12, marginBottom: 4 }}>
                Nusara CheckWeigh
              </p>
              <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Check Weighing</p>
            </motion.div>
          </motion.div>

          {/* Tag strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55, ease }}
            style={{
              display: "inline-flex",
              gap: 24,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {PRODUCT_TAGS.map((tag, i) => (
              <span
                key={tag}
                style={{
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.28)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 24,
                }}
              >
                {i > 0 && <span style={{ opacity: 0.4, marginRight: -16 }}>·</span>}
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={22} color="rgba(255,255,255,0.2)" />
          </motion.div>
        </div>
      </section>

      {/* ── WS-WD Section ────────────────────────────────────────────────────── */}
      <section
        ref={wdRef}
        style={{
          backgroundColor: "#080e1a",
          padding: "120px 0",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>

          {/* Top bar */}
          <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 64,
            flexWrap: "wrap",
            gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <PillBadge
                label="WS-WD"
                bg="rgba(30,58,138,0.25)"
                border="rgba(30,58,138,0.5)"
                color="#93c5fd"
              />
              <span style={{ color: "#ffffff", fontSize: "0.85rem" }}>Weighing &amp; Dispensing</span>
            </div>
            <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>10 features included</span>
          </div>

          {/* Two-column */}
          <div style={{ display: "flex", gap: 80, flexWrap: "wrap" }}>

            {/* Left: product info */}
            <motion.div
              ref={wdLeftRef}
              initial={{ opacity: 0, x: -30 }}
              animate={wdLeftInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease }}
              style={{ flex: "0 0 340px", flexShrink: 0 }}
            >
              <h2 style={{
                color: "#ffffff",
                fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: 16,
              }}>
                Nusara Dispense
              </h2>
              <p style={{
                color: "rgba(148,163,184,0.85)",
                fontSize: "0.9rem",
                lineHeight: 1.8,
                marginBottom: 32,
              }}>
                Multi-material BOM-driven weighing and dispensing — purpose-built for pharmaceutical manufacturing.
                Covers partial validation, container tracking, supervisor authorization, and built-in calibration.
              </p>

              {/* Tag pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
                {["Perpetual License", "On-Premise", "GxP/EU Annex 11", "Unlimited Users"].map(t => (
                  <PillBadge
                    key={t}
                    label={t}
                    bg="rgba(30,58,138,0.2)"
                    border="rgba(30,58,138,0.5)"
                    color="#93c5fd"
                  />
                ))}
              </div>

              {/* CTA */}
              <a
                href="#"
                style={{
                  color: "#93c5fd",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "text-decoration 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
              >
                See module details →
              </a>
            </motion.div>

            {/* Right: feature list */}
            <motion.div
              ref={wdRightRef}
              variants={staggerContainer}
              initial="hidden"
              animate={wdRightInView ? "visible" : "hidden"}
              style={{ flex: 1, minWidth: 0 }}
            >
              {WD_FEATURES.map((f, i) => (
                <FeatureRow
                  key={f.name}
                  name={f.name}
                  desc={f.desc}
                  isLast={i === WD_FEATURES.length - 1}
                  accentBg="rgba(30,58,138,0.25)"
                  accentBorder="rgba(30,58,138,0.5)"
                  accentText="#93c5fd"
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────────────────────── */}
      <div style={{
        width: "100%",
        height: 1,
        backgroundColor: "rgba(255,255,255,0.06)",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#080e1a",
          padding: "4px 20px",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 999,
          fontSize: "0.7rem",
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.1em",
          whiteSpace: "nowrap",
        }}>
          WS-CW →
        </div>
      </div>

      {/* ── WS-CW Section ────────────────────────────────────────────────────── */}
      <section
        ref={cwRef}
        style={{
          backgroundColor: NAVY,
          padding: "120px 0",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>

          {/* Top bar */}
          <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 64,
            flexWrap: "wrap",
            gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <PillBadge
                label="WS-CW"
                bg="rgba(22,163,74,0.25)"
                border="rgba(22,163,74,0.5)"
                color="#86efac"
              />
              <span style={{ color: "#ffffff", fontSize: "0.85rem" }}>Check Weighing</span>
            </div>
            <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>10 features included</span>
          </div>

          {/* Two-column — features left, info right */}
          <div style={{ display: "flex", gap: 80, flexWrap: "wrap" }}>

            {/* Left: feature list */}
            <motion.div
              ref={cwLeftRef}
              variants={staggerContainer}
              initial="hidden"
              animate={cwLeftInView ? "visible" : "hidden"}
              style={{ flex: 1, minWidth: 0 }}
            >
              {CW_FEATURES.map((f, i) => (
                <FeatureRow
                  key={f.name}
                  name={f.name}
                  desc={f.desc}
                  isLast={i === CW_FEATURES.length - 1}
                  accentBg="rgba(22,163,74,0.25)"
                  accentBorder="rgba(22,163,74,0.5)"
                  accentText="#86efac"
                />
              ))}
            </motion.div>

            {/* Right: product info */}
            <motion.div
              ref={cwRightRef}
              initial={{ opacity: 0, x: 30 }}
              animate={cwRightInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease }}
              style={{ flex: "0 0 340px", flexShrink: 0 }}
            >
              <h2 style={{
                color: "#ffffff",
                fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: 16,
              }}>
                Nusara CheckWeigh
              </h2>
              <p style={{
                color: "rgba(148,163,184,0.85)",
                fontSize: "0.9rem",
                lineHeight: 1.8,
                marginBottom: 32,
              }}>
                Automatic check weighing at the packaging line — IPC tolerance verification, ZPL master box label generation,
                and full audit trail across CB/MB/BLS pack structures.
              </p>

              {/* Tag pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
                {["Perpetual License", "On-Premise", "GxP/EU Annex 11", "Unlimited Users"].map(t => (
                  <PillBadge
                    key={t}
                    label={t}
                    bg="rgba(22,163,74,0.2)"
                    border="rgba(22,163,74,0.5)"
                    color="#86efac"
                  />
                ))}
              </div>

              {/* CTA */}
              <a
                href="#"
                style={{
                  color: "#86efac",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "text-decoration 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
              >
                See module details →
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Bundle section ────────────────────────────────────────────────────── */}
      <section style={{
        backgroundColor: "#080e1a",
        padding: "80px 0",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <motion.div
          ref={bundleRef}
          variants={slideUp}
          initial="hidden"
          animate={bundleInView ? "visible" : "hidden"}
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 40px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          {/* Left */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Tag size={14} color="#4ade80" />
              <span style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#4ade80",
              }}>
                Bundle offer
              </span>
            </div>
            <h3 style={{
              color: "#ffffff",
              fontSize: "clamp(1.6rem, 2.5vw, 2rem)",
              fontWeight: 700,
              marginTop: 10,
              marginBottom: 12,
              letterSpacing: "-0.01em",
            }}>
              WS-WD + WS-CW — save 15%
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.75, maxWidth: 440 }}>
              Purchase both modules together and receive 15% off the combined list price.
            </p>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{
              backgroundColor: GREEN,
              color: "#ffffff",
              fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
              fontWeight: 700,
              padding: "16px 40px",
              borderRadius: 999,
              lineHeight: 1,
            }}>
              Save 15%
            </div>
            <p style={{ color: "#64748b", fontSize: "0.75rem" }}>Bundle pricing on request</p>
          </div>
        </motion.div>
      </section>

      {/* ── Coming soon section ───────────────────────────────────────────────── */}
      <section style={{
        backgroundColor: LIGHT,
        padding: "100px 0",
      }}>
        <div ref={comingSoonRef} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>

          {/* Header */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate={comingInView ? "visible" : "hidden"}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
              <Layers size={14} color="#94a3b8" />
              <span style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#94a3b8",
              }}>
                Coming soon · Nusara Weighing Solution
              </span>
            </div>
            <h2 style={{
              color: NAVY,
              fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
              fontWeight: 700,
              marginTop: 12,
              marginBottom: 12,
              letterSpacing: "-0.01em",
            }}>
              Expanding beyond pharma
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.75 }}>
              The same trusted platform, adapted for new regulated industries.
            </p>
          </motion.div>

          {/* Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={comingInView ? "visible" : "hidden"}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
            }}
          >
            {COMING_SOON.map(item => (
              <motion.div
                key={item.code}
                variants={fadeUp}
                whileHover={{ opacity: 1, y: -6 }}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 20,
                  padding: "32px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 14,
                  opacity: 0.6,
                  cursor: "default",
                  boxShadow: "0 2px 8px rgba(13,27,45,0.05)",
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  backgroundColor: item.color + "1A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: item.color,
                }}>
                  {COMING_SOON_ICONS[item.code]}
                </div>

                {/* Code badge */}
                <span style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: item.color,
                  backgroundColor: item.color + "1A",
                  padding: "3px 11px",
                  borderRadius: 999,
                }}>
                  {item.code}
                </span>

                {/* Name */}
                <p style={{ fontSize: "0.88rem", fontWeight: 700, color: NAVY }}>
                  {item.name}
                </p>

                {/* Status badge */}
                <span style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#94a3b8",
                  backgroundColor: "#f1f5f9",
                  padding: "4px 14px",
                  borderRadius: 999,
                }}>
                  In Development
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer style={{
        backgroundColor: LIGHT,
        borderTop: "1px solid #e2e8f0",
        padding: "28px 40px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
      }}>
        <Image
          src="/logo.png"
          alt="Nusara Technology"
          width={100}
          height={26}
          style={{ height: 26, width: "auto", objectFit: "contain", opacity: 0.4 }}
        />
        <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
          © {new Date().getFullYear()} Nusara Technology · Pharmaceutical Weighing Software
        </p>
      </footer>

    </div>
  );
}
