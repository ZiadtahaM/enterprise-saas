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

const SPACES = [
  { id: "ai", label: "AI & Machine Learning", emoji: "🤖", members: "24.3K", posts: "1.2K", hot: true },
  { id: "design", label: "Design & UX", emoji: "🎨", members: "18.7K", posts: "890", hot: false },
  { id: "dev", label: "Software Engineering", emoji: "💻", members: "31.2K", posts: "2.1K", hot: true },
  { id: "crypto", label: "Blockchain & DeFi", emoji: "⛓️", members: "12.5K", posts: "567", hot: false },
  { id: "security", label: "Cybersecurity", emoji: "🔐", members: "9.8K", posts: "443", hot: false },
  { id: "research", label: "Research & Academia", emoji: "🔬", members: "6.2K", posts: "289", hot: false },
  { id: "product", label: "Product & Startups", emoji: "🚀", members: "15.9K", posts: "734", hot: true },
  { id: "gaming", label: "Gaming & Graphics", emoji: "🎮", members: "21.4K", posts: "1.5K", hot: false },
];

export default function SpacesScreen() {
  const [joined, setJoined] = useState<Set<string>>(new Set(["ai", "dev", "design"]));
  const [activeTab, setActiveTab] = useState<"discover" | "joined">("discover");

  const displayed = activeTab === "joined"
    ? SPACES.filter(s => joined.has(s.id))
    : SPACES;

  return (
    <div style={{ width: 390, minHeight: 844, backgroundColor: COLORS.background, fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>
      {/* Status Bar */}
      <div style={{ height: 44, backgroundColor: COLORS.background, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        <span style={{ color: COLORS.foreground, fontSize: 15, fontWeight: 700 }}>9:41</span>
      </div>

      {/* Header */}
      <div style={{ padding: "8px 16px 12px", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ color: COLORS.foreground, fontWeight: 700, fontSize: 22, letterSpacing: -0.5, marginBottom: 12 }}>Spaces</div>

        {/* Search Bar */}
        <div style={{ backgroundColor: COLORS.muted, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <span style={{ color: COLORS.mutedForeground, fontSize: 15 }}>Search spaces...</span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, backgroundColor: COLORS.muted, borderRadius: 10, padding: 3 }}>
          {(["discover", "joined"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: "7px 0", borderRadius: 8, border: "none",
              backgroundColor: activeTab === tab ? COLORS.card : "transparent",
              color: activeTab === tab ? COLORS.foreground : COLORS.mutedForeground,
              fontWeight: activeTab === tab ? 600 : 400, fontSize: 14, cursor: "pointer",
              textTransform: "capitalize" as const,
            }}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Spaces List */}
      <div style={{ padding: "8px 0", overflowY: "auto" as const, maxHeight: 660 }}>
        {displayed.map(space => {
          const isJoined = joined.has(space.id);
          return (
            <div key={space.id} style={{ display: "flex", alignItems: "center", padding: "14px 16px", borderBottom: `1px solid ${COLORS.border}`, gap: 14 }}>
              {/* Icon */}
              <div style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: COLORS.primary + "22", border: `1px solid ${COLORS.primary}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 24 }}>{space.emoji}</span>
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ color: COLORS.foreground, fontWeight: 600, fontSize: 15 }}>{space.label}</span>
                  {space.hot && (
                    <div style={{ display: "flex", alignItems: "center", gap: 3, backgroundColor: "#EF444422", padding: "2px 6px", borderRadius: 6 }}>
                      <span style={{ fontSize: 10 }}>🔥</span>
                      <span style={{ color: "#EF4444", fontSize: 9, fontWeight: 700, letterSpacing: 0.5 }}>HOT</span>
                    </div>
                  )}
                </div>
                <div style={{ color: COLORS.mutedForeground, fontSize: 13 }}>
                  {space.members} members · {space.posts} posts today
                </div>
              </div>
              {/* Join / Leave */}
              <button onClick={() => setJoined(p => { const n = new Set(p); n.has(space.id) ? n.delete(space.id) : n.add(space.id); return n; })}
                style={{
                  padding: "7px 14px", borderRadius: 20,
                  backgroundColor: isJoined ? COLORS.muted : COLORS.primary,
                  border: isJoined ? `1px solid ${COLORS.border}` : "none",
                  color: isJoined ? COLORS.mutedForeground : "#FFF",
                  fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}>
                {isJoined ? "Joined" : "Join"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Tab Bar */}
      <div style={{ position: "absolute" as const, bottom: 0, left: 0, right: 0, height: 84, backgroundColor: COLORS.card, borderTop: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-around", paddingBottom: 20 }}>
        {[{ icon: "🏠", label: "Feed" }, { icon: "🔍", label: "Explore", active: true }, { icon: "✉️", label: "DMs" }, { icon: "🔔", label: "Alerts" }, { icon: "👤", label: "Profile" }].map(tab => (
          <div key={tab.label} style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 22, opacity: tab.active ? 1 : 0.5 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, color: tab.active ? COLORS.primary : COLORS.mutedForeground, fontWeight: tab.active ? 700 : 400 }}>{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
