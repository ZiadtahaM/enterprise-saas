export function AuroraGradient() {
  const posts = [
    { id: "1", user: "aria.chen", name: "Aria Chen", handle: "aria.chen", time: "2m", content: "Just shipped the new gradient tokenization system — 40% faster inference on edge devices 🚀", tags: ["AI", "ML"], likes: 847, reposts: 124, comments: 63, signal: "hot" },
    { id: "2", user: "devraj.k", name: "Devraj K.", handle: "devraj.k", time: "14m", content: "Hot take: accessibility isn't a feature, it's a baseline. Ship nothing without it.", tags: ["Design", "UI"], likes: 2341, reposts: 891, comments: 312, signal: "rising" },
    { id: "3", user: "0xmira", name: "Mira Osei", handle: "0xmira", time: "1h", content: "The DeFi space is converging on intent-based architectures. Here's why that matters for liquidity fragmentation...", tags: ["DeFi", "Blockchain"], likes: 512, reposts: 87, comments: 44, signal: null },
    { id: "4", user: "lucaz_dev", name: "Luca Zimmermann", handle: "lucaz_dev", time: "3h", content: "GNN paper drop: we achieved 94.7% accuracy on citation networks with 3x fewer parameters. Link in bio.", tags: ["Research", "GNN"], likes: 1203, reposts: 445, comments: 178, signal: "new" },
  ];

  const spaces = ["✦ For You", "🤖 AI", "🎨 Design", "⚡ Dev", "🔐 Security", "🔬 Research"];

  return (
    <div style={{ width: 390, minHeight: 844, background: "#0A0A0F", fontFamily: "'Inter', -apple-system, sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Aurora background blobs */}
      <div style={{ position: "fixed", top: -120, left: -80, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: 200, right: -100, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: 100, left: 40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.14) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px 0", color: "#F8F9FF", fontSize: 12, fontWeight: 600, position: "relative", zIndex: 10 }}>
        <span>9:41</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span>●●●</span>
          <span>WiFi</span>
          <span>100%</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px 12px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #8B5CF6, #EC4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff", boxShadow: "0 0 16px rgba(139,92,246,0.5)" }}>N</div>
          <span style={{ color: "#F8F9FF", fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>Nexus</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)", borderRadius: 20, padding: "3px 10px", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: "#fff" }}>
            <span>🔥</span><span>7</span>
          </div>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>A</div>
        </div>
      </div>

      {/* Spaces bar */}
      <div style={{ display: "flex", gap: 8, padding: "0 16px 12px", overflowX: "auto", scrollbarWidth: "none", position: "relative", zIndex: 10 }}>
        {spaces.map((s, i) => (
          <div key={s} style={{
            flexShrink: 0, padding: "7px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
            background: i === 0 ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "rgba(255,255,255,0.07)",
            color: i === 0 ? "#fff" : "rgba(255,255,255,0.6)",
            border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.1)",
            boxShadow: i === 0 ? "0 4px 12px rgba(139,92,246,0.4)" : "none"
          }}>{s}</div>
        ))}
      </div>

      {/* Daily prompt card */}
      <div style={{ margin: "0 16px 12px", padding: "14px 16px", borderRadius: 16, background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1))", border: "1px solid rgba(139,92,246,0.3)", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#A78BFA", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>💡 Daily Question</div>
            <div style={{ fontSize: 14, color: "#F8F9FF", fontWeight: 500, lineHeight: 1.4 }}>What's one thing you shipped this week that you're proud of?</div>
          </div>
          <div style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)", borderRadius: 10, padding: "6px 14px", fontSize: 13, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", marginLeft: 10, boxShadow: "0 4px 12px rgba(139,92,246,0.4)" }}>Answer</div>
        </div>
      </div>

      {/* Posts */}
      <div style={{ position: "relative", zIndex: 10 }}>
        {posts.map((post, idx) => (
          <div key={post.id} style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: idx % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: `linear-gradient(135deg, hsl(${idx * 60 + 200},70%,60%), hsl(${idx * 60 + 260},70%,50%))`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", boxShadow: `0 2px 8px rgba(139,92,246,0.3)` }}>{post.name[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#F8F9FF", fontSize: 14, fontWeight: 600 }}>{post.name}</span>
                    {post.signal && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6, background: post.signal === "hot" ? "rgba(239,68,68,0.2)" : post.signal === "rising" ? "rgba(16,185,129,0.2)" : "rgba(139,92,246,0.2)", color: post.signal === "hot" ? "#F87171" : post.signal === "rising" ? "#34D399" : "#A78BFA", letterSpacing: 0.5, textTransform: "uppercase" }}>
                        {post.signal === "hot" ? "🔥 HOT" : post.signal === "rising" ? "📈 RISING" : "⚡ NEW"}
                      </span>
                    )}
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{post.time}</span>
                </div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, marginBottom: 8 }}>@{post.handle}</div>
                <div style={{ color: "rgba(248,249,255,0.85)", fontSize: 14, lineHeight: 1.55, marginBottom: 8 }}>{post.content}</div>
                <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                  {post.tags.map(t => <span key={t} style={{ fontSize: 12, color: "#A78BFA", fontWeight: 500 }}>#{t}</span>)}
                </div>
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  {[["💬", post.comments], ["🔁", post.reposts], ["❤️", post.likes], ["↗", ""]].map(([icon, count], i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                      <span>{icon}</span>{count ? <span>{count > 999 ? (count/1000).toFixed(1)+"k" : count}</span> : null}
                    </div>
                  ))}
                </div>
                {/* Emoji react bar */}
                <div style={{ display: "flex", gap: 8, marginTop: 8, padding: "8px 0 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  {["🔥","💡","🚀","🤯","👏"].map(e => (
                    <div key={e} style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer", border: "1px solid rgba(255,255,255,0.08)" }}>{e}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom tab bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, width: 390, height: 80, background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 16px 16px", zIndex: 100 }}>
        {[["🏠","Home",true],["🔍","Explore",false],["💬","DM",false],["🔔","Activity",false],["👤","Profile",false]].map(([icon, label, active]) => (
          <div key={label as string} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: active ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: active ? "0 4px 12px rgba(139,92,246,0.4)" : "none" }}>{icon}</div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <div style={{ position: "fixed", right: 20, bottom: 92, width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #8B5CF6, #EC4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 8px 24px rgba(139,92,246,0.5)", zIndex: 101 }}>✏️</div>
    </div>
  );
}
