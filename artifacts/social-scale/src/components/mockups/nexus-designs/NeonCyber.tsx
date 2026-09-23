export function NeonCyber() {
  const posts = [
    { id: "1", user: "aria.chen", name: "Aria Chen", time: "02:14", content: "Shipped gradient tokenization system — 40% faster inference on edge devices. Signal confirmed.", tags: ["#AI", "#ML"], likes: 847, reposts: 124, comments: 63, signal: "HOT", color: "#FF3366" },
    { id: "2", user: "devraj.k", name: "Devraj K.", time: "14:07", content: "Accessibility isn't a feature. It's a baseline. If you're not shipping accessible code, you're shipping incomplete code.", tags: ["#Design"], likes: 2341, reposts: 891, comments: 312, signal: "SURGE", color: "#00FFCC" },
    { id: "3", user: "0xmira", name: "Mira Osei", time: "01:22", content: "DeFi intent-based architectures will fragment liquidity less than AMM pools. Thread inbound.", tags: ["#DeFi"], likes: 512, reposts: 87, comments: 44, signal: null, color: "#FF9900" },
    { id: "4", user: "lucaz_dev", name: "Luca Z.", time: "03:41", content: "94.7% on citation networks. GNN with 3x fewer params. Architecture paper dropped.", tags: ["#GNN", "#Research"], likes: 1203, reposts: 445, comments: 178, signal: "NEW", color: "#AA00FF" },
  ];

  const spaces = ["/ ALL /", "/ AI /", "/ DEV /", "/ DEFI /", "/ SEC /", "/ RES /"];

  return (
    <div style={{ width: 390, minHeight: 844, background: "#050510", fontFamily: "'Courier New', monospace", position: "relative", overflow: "hidden" }}>
      {/* Scanlines overlay */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,204,0.015) 2px, rgba(0,255,204,0.015) 4px)", pointerEvents: "none", zIndex: 1 }} />

      {/* Grid bg */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(0,255,204,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,204,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none", zIndex: 0 }} />

      {/* Status */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px 0", fontSize: 11, color: "#00FFCC", fontFamily: "monospace", position: "relative", zIndex: 10 }}>
        <span>SYS::09:41:00</span>
        <span>NET:OK | PWR:100%</span>
      </div>

      {/* Header */}
      <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid rgba(0,255,204,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, border: "2px solid #00FFCC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#00FFCC", background: "rgba(0,255,204,0.08)", boxShadow: "0 0 12px rgba(0,255,204,0.3), inset 0 0 12px rgba(0,255,204,0.05)" }}>N</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#00FFCC", letterSpacing: 3, textTransform: "uppercase", textShadow: "0 0 10px rgba(0,255,204,0.6)" }}>NEXUS</div>
            <div style={{ fontSize: 9, color: "rgba(0,255,204,0.5)", letterSpacing: 2 }}>COMMUNITY PROTOCOL v2.1</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ border: "1px solid #FF9900", padding: "4px 10px", fontSize: 11, color: "#FF9900", display: "flex", gap: 5, alignItems: "center", textShadow: "0 0 8px rgba(255,153,0,0.6)", boxShadow: "0 0 8px rgba(255,153,0,0.2)" }}>
            <span>◆</span><span>STK:7D</span>
          </div>
          <div style={{ width: 28, height: 28, border: "2px solid #AA00FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#AA00FF", background: "rgba(170,0,255,0.1)", boxShadow: "0 0 8px rgba(170,0,255,0.4)" }}>AC</div>
        </div>
      </div>

      {/* Spaces */}
      <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none", borderBottom: "1px solid rgba(0,255,204,0.15)", position: "relative", zIndex: 10 }}>
        {spaces.map((s, i) => (
          <div key={s} style={{
            flexShrink: 0, padding: "9px 12px", fontSize: 11, fontWeight: 700, letterSpacing: 1, cursor: "pointer",
            color: i === 0 ? "#050510" : "rgba(0,255,204,0.5)",
            background: i === 0 ? "#00FFCC" : "transparent",
            boxShadow: i === 0 ? "0 0 16px rgba(0,255,204,0.4)" : "none",
            borderRight: "1px solid rgba(0,255,204,0.1)"
          }}>{s}</div>
        ))}
      </div>

      {/* Daily prompt */}
      <div style={{ margin: "10px 12px", padding: "12px 14px", border: "1px solid rgba(255,51,102,0.4)", background: "rgba(255,51,102,0.05)", position: "relative", zIndex: 10 }}>
        <div style={{ position: "absolute", top: -1, left: 10, background: "#050510", padding: "0 6px", fontSize: 9, color: "#FF3366", letterSpacing: 2, textTransform: "uppercase", textShadow: "0 0 8px rgba(255,51,102,0.6)" }}>▶ DAILY_PROMPT.exe</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.4, fontStyle: "italic" }}>"What did you ship this week?"</div>
          <div style={{ border: "1px solid #FF3366", padding: "5px 10px", fontSize: 10, color: "#FF3366", marginLeft: 10, cursor: "pointer", whiteSpace: "nowrap", textShadow: "0 0 6px rgba(255,51,102,0.5)", boxShadow: "0 0 6px rgba(255,51,102,0.2)" }}>EXECUTE</div>
        </div>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <div key={post.id} style={{ padding: "12px", margin: "0 8px 8px", border: `1px solid ${post.color}22`, background: `${post.color}05`, position: "relative", zIndex: 10 }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: post.color, boxShadow: `0 0 8px ${post.color}` }} />
          <div style={{ paddingLeft: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, border: `1px solid ${post.color}`, background: `${post.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: post.color, boxShadow: `0 0 8px ${post.color}40` }}>{post.name[0]}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: post.color, letterSpacing: 0.5, textShadow: `0 0 6px ${post.color}60` }}>{post.user}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>T+{post.time}</div>
                </div>
              </div>
              {post.signal && (
                <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", border: `1px solid ${post.color}`, color: post.color, letterSpacing: 1.5, textTransform: "uppercase", textShadow: `0 0 6px ${post.color}60`, boxShadow: `0 0 6px ${post.color}20` }}>
                  {post.signal}
                </span>
              )}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.55, marginBottom: 8, fontFamily: "'Courier New', monospace" }}>{post.content}</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              {post.tags.map(t => <span key={t} style={{ fontSize: 11, color: post.color, opacity: 0.7 }}>{t}</span>)}
            </div>
            <div style={{ display: "flex", gap: 14, fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>
              {[["[MSG]", post.comments], ["[RPT]", post.reposts], ["[LIK]", post.likes]].map(([label, count]) => (
                <div key={label as string} style={{ display: "flex", gap: 4, cursor: "pointer" }}>
                  <span style={{ color: "rgba(0,255,204,0.5)" }}>{label}</span>
                  <span>{Number(count) > 999 ? (Number(count)/1000).toFixed(1)+"K" : count}</span>
                </div>
              ))}
            </div>
            {/* Emoji react */}
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {["🔥","💡","🚀","🤯","👏"].map(e => (
                <div key={e} style={{ width: 28, height: 28, border: "1px solid rgba(0,255,204,0.2)", background: "rgba(0,255,204,0.03)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer" }}>{e}</div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, width: 390, height: 72, background: "rgba(5,5,16,0.95)", borderTop: "1px solid rgba(0,255,204,0.2)", display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 100 }}>
        {[["HOME","⌂",true,"#00FFCC"],["SCAN","◎",false,"#00FFCC"],["MSG","✉",false,"#00FFCC"],["ALERT","◉",false,"#00FFCC"],["ID","◈",false,"#00FFCC"]].map(([label, icon, active, clr]) => (
          <div key={label as string} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 18, color: active ? clr as string : "rgba(0,255,204,0.25)", textShadow: active ? `0 0 8px ${clr}` : "none" }}>{icon}</span>
            <span style={{ fontSize: 8, color: active ? clr as string : "rgba(0,255,204,0.25)", letterSpacing: 1, textShadow: active ? `0 0 6px ${clr}` : "none" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* FAB */}
      <div style={{ position: "fixed", right: 16, bottom: 84, width: 48, height: 48, background: "transparent", border: "2px solid #00FFCC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#00FFCC", zIndex: 101, boxShadow: "0 0 16px rgba(0,255,204,0.4), inset 0 0 16px rgba(0,255,204,0.05)", cursor: "pointer" }}>+</div>
    </div>
  );
}
