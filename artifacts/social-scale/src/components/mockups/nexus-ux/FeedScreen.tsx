import React, { useState } from "react";

const COLORS = {
  background: "#0A0A0F",
  card: "#13131A",
  primary: "#8B5CF6",
  border: "#1E1E2E",
  foreground: "#F8F9FF",
  mutedForeground: "#6B7280",
  muted: "#1A1A24",
  accent: "#7C3AED",
};

const SPACES = [
  { id: "all", label: "For You", emoji: "✨" },
  { id: "ai", label: "AI & ML", emoji: "🤖" },
  { id: "design", label: "Design", emoji: "🎨" },
  { id: "dev", label: "Engineering", emoji: "💻" },
  { id: "crypto", label: "DeFi", emoji: "⛓️" },
  { id: "security", label: "Security", emoji: "🔐" },
];

const POSTS = [
  {
    id: "1", name: "Aria Chen", handle: "aria", time: "2m",
    body: "Just shipped Dijkstra-based social graph viz with D3. The degree-of-separation insight is wild — I'm 3 hops from Linus. 🤯",
    tags: ["TypeScript", "Algorithms"], likes: "1.2K", reposts: "234", comments: "89",
    liked: true, signal: "hot",
  },
  {
    id: "2", name: "Marcus Webb", handle: "mwebb", time: "15m",
    body: "Hot take: design systems built around motion principles ship 3x faster than color-first ones. Change my mind.",
    tags: ["Design", "UI"], likes: "847", reposts: "102", comments: "56",
    liked: false, signal: "rising",
  },
  {
    id: "3", name: "Priya Nair", handle: "priya_dev", time: "1h",
    body: "Finally got 100% Lighthouse score on a React app with 400 components. Thread 🧵",
    tags: ["Performance", "Engineering"], likes: "2.1K", reposts: "412", comments: "178",
    liked: false, signal: null,
  },
];

const REACTIONS = ["🔥", "💡", "🚀", "🤯", "👏"];

const SIGNAL_CONFIG: Record<string, { label: string; emoji: string; bg: string; color: string }> = {
  hot: { label: "HOT", emoji: "🔥", bg: "#EF444422", color: "#EF4444" },
  rising: { label: "RISING", emoji: "📈", bg: "#F59E0B22", color: "#F59E0B" },
};

export default function FeedScreen() {
  const [activeSpace, setActiveSpace] = useState("all");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set(["1"]));
  const [reactions, setReactions] = useState<Record<string, string | null>>({});

  return (
    <div style={{ width: 390, minHeight: 844, backgroundColor: COLORS.background, fontFamily: "system-ui, -apple-system, sans-serif", overflow: "hidden", position: "relative" }}>
      {/* Status Bar */}
      <div style={{ height: 44, backgroundColor: COLORS.background, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        <span style={{ color: COLORS.foreground, fontSize: 15, fontWeight: 700 }}>9:41</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 13 }}>●●●</span>
          <span style={{ color: COLORS.foreground, fontSize: 13 }}>📶 🔋</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}`, gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#FFF", fontWeight: 800, fontSize: 16 }}>N</span>
        </div>
        <span style={{ color: COLORS.foreground, fontWeight: 700, fontSize: 20, letterSpacing: -0.5, flex: 1 }}>Nexus</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Streak badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, backgroundColor: "#F59E0B22", border: "1px solid #F59E0B", borderRadius: 8, padding: "3px 8px" }}>
            <span style={{ fontSize: 12 }}>🔥</span>
            <span style={{ color: "#F59E0B", fontSize: 11, fontWeight: 700 }}>7d streak</span>
          </div>
          <span style={{ fontSize: 20 }}>🔔</span>
          <div style={{ width: 30, height: 30, borderRadius: 15, background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#FFF", fontWeight: 700, fontSize: 14 }}>A</span>
          </div>
        </div>
      </div>

      {/* Spaces Bar */}
      <div style={{ display: "flex", gap: 8, padding: "8px 16px", overflowX: "auto", borderBottom: `1px solid ${COLORS.border}` }}>
        {SPACES.map(s => (
          <button key={s.id} onClick={() => setActiveSpace(s.id)} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "5px 12px",
            borderRadius: 20, border: "none", cursor: "pointer", whiteSpace: "nowrap",
            backgroundColor: activeSpace === s.id ? COLORS.primary : COLORS.muted,
            color: activeSpace === s.id ? "#FFF" : COLORS.mutedForeground,
            fontWeight: 600, fontSize: 13,
          }}>
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {/* Daily Prompt */}
      <div style={{ margin: "10px 16px 4px", backgroundColor: COLORS.card, border: `1px solid ${COLORS.primary}44`, borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.primary + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 18 }}>💬</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: COLORS.primary, fontWeight: 700, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 3 }}>Today's Question</div>
            <div style={{ color: COLORS.foreground, fontSize: 14, lineHeight: 1.4, fontWeight: 500 }}>What's the most underrated algorithm you've used in production?</div>
          </div>
          <span style={{ color: COLORS.mutedForeground, fontSize: 16, cursor: "pointer" }}>×</span>
        </div>
        <div style={{ backgroundColor: COLORS.primary, borderRadius: 10, padding: "10px 0", textAlign: "center", color: "#FFF", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Answer publicly ✏️</div>
      </div>

      {/* Posts */}
      {POSTS.map(post => {
        const isLiked = likedPosts.has(post.id);
        const picked = reactions[post.id];
        const sig = post.signal ? SIGNAL_CONFIG[post.signal] : null;
        return (
          <div key={post.id} style={{ display: "flex", padding: "14px 16px 12px", borderBottom: `1px solid ${COLORS.border}`, gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: `linear-gradient(135deg, ${COLORS.primary}, #7C3AED)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#FFF", fontWeight: 700, fontSize: 18 }}>{post.name[0]}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
                <div>
                  <span style={{ color: COLORS.foreground, fontWeight: 600, fontSize: 15 }}>{post.name}</span>
                  <div style={{ color: COLORS.mutedForeground, fontSize: 13 }}>@{post.handle} · {post.time}</div>
                </div>
                {sig && (
                  <div style={{ display: "flex", alignItems: "center", gap: 3, backgroundColor: sig.bg, padding: "3px 6px", borderRadius: 6 }}>
                    <span style={{ fontSize: 11 }}>{sig.emoji}</span>
                    <span style={{ color: sig.color, fontWeight: 700, fontSize: 9, letterSpacing: 0.5 }}>{sig.label}</span>
                  </div>
                )}
              </div>
              <p style={{ color: COLORS.foreground, fontSize: 15, lineHeight: 1.5, margin: "6px 0", letterSpacing: -0.1 }}>{post.body}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 6 }}>
                {post.tags.map(t => <span key={t} style={{ color: COLORS.primary, fontSize: 14, fontWeight: 500 }}>#{t}</span>)}
              </div>
              <div style={{ display: "flex", gap: 28, marginTop: 4 }}>
                {[
                  { icon: "💬", count: post.comments },
                  { icon: "🔁", count: post.reposts },
                  { icon: isLiked ? "❤️" : "🤍", count: post.likes, onClick: () => setLikedPosts(prev => { const n = new Set(prev); n.has(post.id) ? n.delete(post.id) : n.add(post.id); return n; }) },
                  { icon: "↗️", count: "" },
                ].map((a, i) => (
                  <button key={i} onClick={a.onClick} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <span style={{ fontSize: 17 }}>{a.icon}</span>
                    {a.count && <span style={{ color: COLORS.mutedForeground, fontSize: 13 }}>{a.count}</span>}
                  </button>
                ))}
              </div>
              {/* Quick React Bar */}
              <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" as const }}>
                {REACTIONS.map(emoji => {
                  const isActive = picked === emoji;
                  return (
                    <button key={emoji} onClick={() => setReactions(p => ({ ...p, [post.id]: p[post.id] === emoji ? null : emoji }))}
                      style={{
                        display: "flex", alignItems: "center", gap: 3, padding: "4px 8px", borderRadius: 14,
                        backgroundColor: isActive ? COLORS.primary + "22" : COLORS.muted,
                        border: isActive ? `1px solid ${COLORS.primary}` : "1px solid transparent",
                        cursor: "pointer", fontSize: 14,
                      }}>
                      {emoji}
                      {isActive && <span style={{ color: COLORS.primary, fontSize: 11, fontWeight: 600 }}>1</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* FAB */}
      <div style={{ position: "absolute", bottom: 96, right: 20, width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(139,92,246,0.5)", cursor: "pointer", fontSize: 22 }}>✏️</div>

      {/* Tab Bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 84, backgroundColor: COLORS.card, borderTop: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-around", paddingBottom: 20 }}>
        {[{ icon: "🏠", label: "Feed", active: true }, { icon: "🔍", label: "Explore" }, { icon: "✉️", label: "DMs" }, { icon: "🔔", label: "Alerts" }, { icon: "👤", label: "Profile" }].map(tab => (
          <div key={tab.label} style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 22, opacity: tab.active ? 1 : 0.5 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, color: tab.active ? COLORS.primary : COLORS.mutedForeground, fontWeight: tab.active ? 700 : 400 }}>{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
