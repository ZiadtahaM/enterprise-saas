import React, { useState } from "react";

const COLORS = {
  background: "#0A0A0F",
  card: "#13131A",
  primary: "#8B5CF6",
  border: "#1E1E2E",
  foreground: "#F8F9FF",
  mutedForeground: "#6B7280",
  muted: "#1A1A24",
};

const INTERESTS = [
  { id: "ai", label: "AI & Machine Learning", emoji: "🤖" },
  { id: "design", label: "Design & UX", emoji: "🎨" },
  { id: "crypto", label: "Blockchain & DeFi", emoji: "⛓️" },
  { id: "security", label: "Cybersecurity", emoji: "🔐" },
  { id: "dev", label: "Software Engineering", emoji: "💻" },
  { id: "research", label: "Research & Academia", emoji: "🔬" },
  { id: "product", label: "Product & Startups", emoji: "🚀" },
  { id: "gaming", label: "Gaming & Graphics", emoji: "🎮" },
  { id: "data", label: "Data Science", emoji: "📊" },
  { id: "open", label: "Open Source", emoji: "🌐" },
  { id: "mobile", label: "Mobile Dev", emoji: "📱" },
  { id: "cloud", label: "Cloud & DevOps", emoji: "☁️" },
];

const MIN = 3;

export default function OnboardingScreen() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [step, setStep] = useState<"pick" | "welcome">("pick");

  function toggle(id: string) {
    setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  if (step === "welcome") {
    return (
      <div style={{ width: 390, minHeight: 844, backgroundColor: COLORS.background, fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px", gap: 20 }}>
        <div style={{ width: 72, height: 72, borderRadius: 22, backgroundColor: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#FFF", fontWeight: 800, fontSize: 40 }}>N</span>
        </div>
        <div style={{ color: COLORS.foreground, fontWeight: 700, fontSize: 28, letterSpacing: -0.7, textAlign: "center" }}>Welcome to Nexus</div>
        <div style={{ color: COLORS.mutedForeground, fontSize: 15, lineHeight: 1.6, textAlign: "center" }}>
          Your feed is curated around {selected.size} topics you care about. The more you engage, the smarter it gets.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, justifyContent: "center" }}>
          {Array.from(selected).map(id => {
            const cat = INTERESTS.find(c => c.id === id);
            if (!cat) return null;
            return (
              <div key={id} style={{ display: "flex", alignItems: "center", gap: 5, backgroundColor: COLORS.card, padding: "6px 10px", borderRadius: 10, border: `1px solid ${COLORS.border}` }}>
                <span>{cat.emoji}</span>
                <span style={{ color: COLORS.primary, fontSize: 12, fontWeight: 500 }}>{cat.label}</span>
              </div>
            );
          })}
        </div>
        <button onClick={() => setStep("pick")} style={{ width: "100%", backgroundColor: COLORS.primary, border: "none", borderRadius: 14, padding: "16px 0", color: "#FFF", fontWeight: 700, fontSize: 16, cursor: "pointer", marginTop: 8 }}>
          Enter Nexus →
        </button>
      </div>
    );
  }

  const pct = Math.min(100, (selected.size / INTERESTS.length) * 100);
  const ready = selected.size >= MIN;

  return (
    <div style={{ width: 390, minHeight: 844, backgroundColor: COLORS.background, fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Status Bar */}
      <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        <span style={{ color: COLORS.foreground, fontSize: 15, fontWeight: 700 }}>9:41</span>
      </div>

      {/* Header */}
      <div style={{ padding: "16px 20px 12px", display: "flex", flexDirection: "column" as const, gap: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
          <span style={{ color: "#FFF", fontWeight: 700, fontSize: 20 }}>N</span>
        </div>
        <div style={{ color: COLORS.foreground, fontWeight: 700, fontSize: 26, letterSpacing: -0.6 }}>What are you into?</div>
        <div style={{ color: COLORS.mutedForeground, fontSize: 15, lineHeight: 1.5 }}>Pick {MIN}+ topics to personalize your Nexus feed</div>
        <div style={{ height: 4, borderRadius: 2, backgroundColor: COLORS.muted, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, backgroundColor: ready ? COLORS.primary : "#7C3AED", minWidth: 8, transition: "width 0.3s ease" }} />
        </div>
        <div style={{ color: COLORS.mutedForeground, fontSize: 12 }}>
          {selected.size} selected {ready ? "✓ ready" : `(need ${MIN - selected.size} more)`}
        </div>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, padding: "0 16px 120px", display: "flex", flexWrap: "wrap" as const, gap: 10, alignContent: "flex-start" }}>
        {INTERESTS.map(cat => {
          const isSel = selected.has(cat.id);
          return (
            <button key={cat.id} onClick={() => toggle(cat.id)} style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "10px 14px", borderRadius: 14, cursor: "pointer",
              backgroundColor: isSel ? COLORS.primary : COLORS.card,
              border: `1.5px solid ${isSel ? COLORS.primary : COLORS.border}`,
              color: isSel ? "#FFF" : COLORS.foreground,
              fontSize: 14, fontWeight: 500,
              transition: "all 0.15s ease",
            }}>
              <span style={{ fontSize: 16 }}>{cat.emoji}</span>
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div style={{ position: "absolute" as const, bottom: 0, left: 0, right: 0, padding: "12px 20px 44px", backgroundColor: COLORS.background }}>
        <button
          onClick={() => ready && setStep("welcome")}
          style={{
            width: "100%", borderRadius: 14, padding: "16px 0", border: "none",
            backgroundColor: ready ? COLORS.primary : COLORS.muted,
            color: ready ? "#FFF" : COLORS.mutedForeground,
            fontWeight: 700, fontSize: 16, cursor: ready ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
          }}
        >Continue</button>
      </div>
    </div>
  );
}
