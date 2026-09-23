export function Brutalist() {
  const posts = [
    { id: "1", user: "ARIA.CHEN", handle: "aria.chen", time: "2M AGO", content: "Just shipped the new gradient tokenization system — 40% faster inference on edge devices.", tags: ["AI", "ML"], likes: 847, reposts: 124, comments: 63, signal: "HOT" },
    { id: "2", user: "DEVRAJ K.", handle: "devraj.k", time: "14M AGO", content: "Hot take: accessibility isn't a feature, it's a baseline. Ship nothing without it.", tags: ["Design"], likes: 2341, reposts: 891, comments: 312, signal: "RISING" },
    { id: "3", user: "MIRA OSEI", handle: "0xmira", time: "1H AGO", content: "The DeFi space is converging on intent-based architectures. Here's why that matters.", tags: ["DeFi"], likes: 512, reposts: 87, comments: 44, signal: null },
    { id: "4", user: "LUCA Z.", handle: "lucaz_dev", time: "3H AGO", content: "GNN paper drop: 94.7% accuracy on citation networks with 3x fewer parameters.", tags: ["Research"], likes: 1203, reposts: 445, comments: 178, signal: "NEW" },
  ];

  const spaces = ["ALL", "AI", "DESIGN", "DEV", "SECURITY", "RESEARCH"];

  return (
    <div style={{ width: 390, minHeight: 844, background: "#FFFFF0", fontFamily: "'Courier New', 'Courier', monospace", position: "relative" }}>
      {/* Status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px 0", fontSize: 11, fontWeight: 700, color: "#000", borderBottom: "3px solid #000" }}>
        <span>9:41</span>
        <span>■■■ WiFi 100%</span>
      </div>

      {/* Header */}
      <div style={{ background: "#000", padding: "16px 16px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <div style={{ width: 36, height: 36, background: "#FFFF00", border: "3px solid #FFFF00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#000" }}>N</div>
          <span style={{ color: "#FFFFF0", fontSize: 22, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", marginLeft: 10, fontFamily: "'Courier New', monospace" }}>NEXUS</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "#FFFF00", border: "2px solid #FFFF00", padding: "4px 10px", fontSize: 13, fontWeight: 900, color: "#000", display: "flex", gap: 4, alignItems: "center" }}>
            <span>◆</span><span>7 DAY STREAK</span>
          </div>
        </div>
      </div>

      {/* Spaces bar */}
      <div style={{ display: "flex", gap: 0, borderBottom: "3px solid #000", overflowX: "auto", scrollbarWidth: "none" }}>
        {spaces.map((s, i) => (
          <div key={s} style={{
            flexShrink: 0, padding: "10px 16px", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1,
            background: i === 0 ? "#000" : "#FFFFF0",
            color: i === 0 ? "#FFFF00" : "#000",
            borderRight: "3px solid #000",
            cursor: "pointer"
          }}>{s}</div>
        ))}
      </div>

      {/* Daily prompt */}
      <div style={{ margin: "0", padding: "14px 16px", background: "#FFFF00", borderBottom: "3px solid #000", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1, textTransform: "uppercase", color: "#000", marginBottom: 3 }}>◆ DAILY QUESTION</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#000", lineHeight: 1.35 }}>What did you ship this week?</div>
        </div>
        <div style={{ background: "#000", color: "#FFFF00", padding: "8px 14px", fontSize: 12, fontWeight: 900, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", border: "3px solid #000" }}>ANSWER →</div>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <div key={post.id} style={{ borderBottom: "3px solid #000", padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 36, height: 36, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#FFFF00", border: "2px solid #000" }}>{post.user[0]}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#000", textTransform: "uppercase", letterSpacing: 0.5 }}>{post.user}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase" }}>@{post.handle}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {post.signal && (
                <span style={{ fontSize: 10, fontWeight: 900, padding: "3px 8px", background: post.signal === "HOT" ? "#FF0000" : post.signal === "RISING" ? "#00AA00" : "#0000FF", color: "#fff", textTransform: "uppercase", letterSpacing: 1, border: "2px solid #000" }}>
                  {post.signal}
                </span>
              )}
              <span style={{ fontSize: 11, fontWeight: 700, color: "#888" }}>{post.time}</span>
            </div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#000", lineHeight: 1.5, marginBottom: 8, borderLeft: "4px solid #000", paddingLeft: 10 }}>{post.content}</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {post.tags.map(t => (
              <span key={t} style={{ fontSize: 11, fontWeight: 900, padding: "3px 8px", background: "#000", color: "#FFFF00", textTransform: "uppercase", letterSpacing: 1 }}>#{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 0, borderTop: "2px solid #000", paddingTop: 10 }}>
            {[["◉ REPLY", post.comments], ["⟳ BOOST", post.reposts], ["♥ LIKE", post.likes]].map(([label, count]) => (
              <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 4, marginRight: 16, fontSize: 11, fontWeight: 900, color: "#000", textTransform: "uppercase", letterSpacing: 0.5 }}>
                <span>{label}</span>
                <span style={{ background: "#000", color: "#FFFF00", padding: "1px 5px", fontSize: 10, fontWeight: 900 }}>{Number(count) > 999 ? (Number(count)/1000).toFixed(1)+"K" : count}</span>
              </div>
            ))}
          </div>
          {/* Emoji bar */}
          <div style={{ display: "flex", gap: 0, marginTop: 8, borderTop: "2px solid #000", paddingTop: 8 }}>
            {["🔥","💡","🚀","🤯","👏"].map(e => (
              <div key={e} style={{ padding: "6px 8px", border: "2px solid #000", marginRight: -2, fontSize: 15, background: "#FFFFF0", cursor: "pointer" }}>{e}</div>
            ))}
          </div>
        </div>
      ))}

      {/* Bottom tab bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, width: 390, height: 72, background: "#000", borderTop: "3px solid #000", display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 100 }}>
        {[["⌂","HOME",true],["◎","EXPLORE",false],["✉","DM",false],["◉","ALERTS",false],["◈","PROFILE",false]].map(([icon, label, active]) => (
          <div key={label as string} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 18, color: active ? "#FFFF00" : "#888" }}>{icon}</span>
            <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1, color: active ? "#FFFF00" : "#888" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* FAB */}
      <div style={{ position: "fixed", right: 16, bottom: 84, width: 52, height: 52, background: "#FFFF00", border: "3px solid #000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, zIndex: 101, cursor: "pointer" }}>+</div>
    </div>
  );
}
