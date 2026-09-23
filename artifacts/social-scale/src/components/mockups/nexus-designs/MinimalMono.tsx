export function MinimalMono() {
  const posts = [
    { id: "1", user: "Aria Chen", handle: "aria.chen", time: "2 min", content: "Shipped the new gradient tokenization system — 40% faster inference on edge devices.", tags: ["AI", "ML"], likes: 847, reposts: 124, comments: 63, signal: "hot" },
    { id: "2", user: "Devraj K.", handle: "devraj.k", time: "14 min", content: "Accessibility isn't a feature, it's a baseline. Ship nothing without it.", tags: ["Design"], likes: 2341, reposts: 891, comments: 312, signal: "rising" },
    { id: "3", user: "Mira Osei", handle: "0xmira", time: "1 hr", content: "The DeFi space is converging on intent-based architectures. Here's what that means for liquidity.", tags: ["DeFi"], likes: 512, reposts: 87, comments: 44, signal: null },
    { id: "4", user: "Luca Zimmermann", handle: "lucaz_dev", time: "3 hr", content: "GNN paper: 94.7% accuracy on citation networks with 3x fewer parameters. Link in bio.", tags: ["Research"], likes: 1203, reposts: 445, comments: 178, signal: null },
  ];

  const spaces = ["For You", "AI", "Design", "Dev", "Security", "Research"];

  return (
    <div style={{ width: 390, minHeight: 844, background: "#FAFAFA", fontFamily: "'Georgia', 'Times New Roman', serif", position: "relative" }}>
      {/* Status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 20px 0", fontSize: 11, color: "#888", fontFamily: "system-ui, sans-serif" }}>
        <span style={{ fontWeight: 600 }}>9:41</span>
        <span>WiFi · 100%</span>
      </div>

      {/* Header */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #E5E5E5" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
            <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: -1, color: "#111", fontFamily: "'Georgia', serif" }}>Nexus</span>
            <span style={{ fontSize: 11, color: "#999", fontFamily: "system-ui", fontWeight: 400, letterSpacing: 0.5, textTransform: "uppercase" }}>Community</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#999", fontFamily: "system-ui" }}>
              <span>🔥</span>
              <span style={{ fontWeight: 600, color: "#111" }}>7</span>
            </div>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#FAFAFA", fontFamily: "system-ui" }}>A</div>
          </div>
        </div>
      </div>

      {/* Spaces bar */}
      <div style={{ display: "flex", gap: 0, overflowX: "auto", scrollbarWidth: "none", borderBottom: "1px solid #E5E5E5" }}>
        {spaces.map((s, i) => (
          <div key={s} style={{
            flexShrink: 0, padding: "12px 18px", fontSize: 13, cursor: "pointer",
            fontFamily: "system-ui, sans-serif", fontWeight: i === 0 ? 600 : 400,
            color: i === 0 ? "#111" : "#888",
            borderBottom: i === 0 ? "2px solid #111" : "2px solid transparent",
            marginBottom: -1
          }}>{s}</div>
        ))}
      </div>

      {/* Daily prompt */}
      <div style={{ margin: "16px 20px", padding: "16px", background: "#F0F0F0", borderRadius: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10, fontFamily: "system-ui", fontWeight: 600, color: "#888", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Today's Question</div>
          <div style={{ fontSize: 14, color: "#333", lineHeight: 1.4, fontStyle: "italic" }}>What did you ship this week?</div>
        </div>
        <div style={{ borderBottom: "1px solid #111", color: "#111", fontSize: 12, fontFamily: "system-ui", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", marginLeft: 12, paddingBottom: 1 }}>Answer →</div>
      </div>

      {/* Posts */}
      {posts.map((post, idx) => (
        <div key={post.id} style={{ padding: "16px 20px", borderBottom: "1px solid #E5E5E5" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#E5E5E5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "#555", fontFamily: "system-ui", flexShrink: 0 }}>{post.user[0]}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111", fontFamily: "system-ui", lineHeight: 1.2 }}>{post.user}</div>
                <div style={{ fontSize: 12, color: "#888", fontFamily: "system-ui" }}>@{post.handle} · {post.time}</div>
              </div>
            </div>
            {post.signal && (
              <span style={{ fontSize: 10, fontFamily: "system-ui", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 }}>
                {post.signal === "hot" ? "↑ Trending" : "↑ Rising"}
              </span>
            )}
          </div>
          <div style={{ fontSize: 15, color: "#222", lineHeight: 1.6, marginBottom: 10 }}>{post.content}</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {post.tags.map(t => (
              <span key={t} style={{ fontSize: 11, color: "#888", fontFamily: "system-ui", borderBottom: "1px solid #CCC" }}>#{t.toLowerCase()}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 18, fontFamily: "system-ui", fontSize: 12, color: "#888" }}>
            {[["Reply", post.comments], ["Boost", post.reposts], ["Like", post.likes]].map(([label, count]) => (
              <div key={label as string} style={{ display: "flex", gap: 4, alignItems: "center", cursor: "pointer" }}>
                <span>{label}</span>
                <span style={{ color: "#111", fontWeight: 600 }}>{Number(count) > 999 ? (Number(count)/1000).toFixed(1)+"k" : count}</span>
              </div>
            ))}
            <div style={{ marginLeft: "auto", cursor: "pointer" }}>Share</div>
          </div>
          {/* Emoji react */}
          <div style={{ display: "flex", gap: 6, marginTop: 10, paddingTop: 10, borderTop: "1px solid #EBEBEB" }}>
            {["🔥","💡","🚀","🤯","👏"].map(e => (
              <div key={e} style={{ width: 30, height: 30, borderRadius: "50%", background: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, cursor: "pointer" }}>{e}</div>
            ))}
          </div>
        </div>
      ))}

      {/* Bottom tab bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, width: 390, height: 72, background: "#FAFAFA", borderTop: "1px solid #E5E5E5", display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 100 }}>
        {[["Home", "⌂", true], ["Explore", "◎", false], ["Messages", "✉", false], ["Activity", "◉", false], ["Profile", "○", false]].map(([label, icon, active]) => (
          <div key={label as string} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 20, color: active ? "#111" : "#CCC" }}>{icon}</span>
            <span style={{ fontSize: 9, fontFamily: "system-ui", fontWeight: 500, color: active ? "#111" : "#CCC", letterSpacing: 0.5 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* FAB — minimal */}
      <div style={{ position: "fixed", right: 20, bottom: 84, width: 48, height: 48, borderRadius: "50%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#FAFAFA", zIndex: 101, cursor: "pointer" }}>+</div>
    </div>
  );
}
