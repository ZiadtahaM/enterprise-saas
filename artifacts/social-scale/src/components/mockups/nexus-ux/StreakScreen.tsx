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

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ACTIVITY = [true, true, true, true, true, false, true];

const LEADERBOARD = [
  { rank: 1, name: "Aria Chen", handle: "aria", streak: 42, points: 12400, badge: "🥇" },
  { rank: 2, name: "Marcus Webb", handle: "mwebb", streak: 31, points: 9800, badge: "🥈" },
  { rank: 3, name: "You", handle: "nexususer", streak: 7, points: 6100, badge: "🥉", isYou: true },
  { rank: 4, name: "Priya Nair", handle: "priya_dev", streak: 5, points: 4200 },
  { rank: 5, name: "Jin Park", handle: "jinp", streak: 3, points: 3100 },
];

const MILESTONES = [
  { days: 7, label: "Week Warrior", emoji: "⚡", unlocked: true },
  { days: 14, label: "Biweekly Beast", emoji: "💪", unlocked: false },
  { days: 30, label: "Monthly Legend", emoji: "🏆", unlocked: false },
  { days: 100, label: "Centurion", emoji: "💎", unlocked: false },
];

export default function StreakScreen() {
  const [activeTab, setActiveTab] = useState<"streak" | "leaderboard">("streak");

  return (
    <div style={{ width: 390, minHeight: 844, backgroundColor: COLORS.background, fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>
      {/* Status Bar */}
      <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        <span style={{ color: COLORS.foreground, fontSize: 15, fontWeight: 700 }}>9:41</span>
      </div>

      {/* Header */}
      <div style={{ padding: "8px 16px 0", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ color: COLORS.foreground, fontWeight: 700, fontSize: 22, letterSpacing: -0.5, marginBottom: 12 }}>Your Progress</div>
        <div style={{ display: "flex", gap: 0, backgroundColor: COLORS.muted, borderRadius: 10, padding: 3, marginBottom: 0 }}>
          {(["streak", "leaderboard"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: "7px 0", borderRadius: 8, border: "none",
              backgroundColor: activeTab === tab ? COLORS.card : "transparent",
              color: activeTab === tab ? COLORS.foreground : COLORS.mutedForeground,
              fontWeight: activeTab === tab ? 600 : 400, fontSize: 14, cursor: "pointer",
              textTransform: "capitalize" as const,
            }}>{tab === "streak" ? "🔥 Streak" : "🏆 Leaderboard"}</button>
          ))}
        </div>
      </div>

      {activeTab === "streak" ? (
        <div style={{ padding: "16px" }}>
          {/* Big streak number */}
          <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "24px", textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 56, marginBottom: 4 }}>🔥</div>
            <div style={{ color: COLORS.foreground, fontWeight: 800, fontSize: 52, letterSpacing: -2, lineHeight: 1 }}>7</div>
            <div style={{ color: COLORS.mutedForeground, fontSize: 16, marginTop: 4 }}>day streak</div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ color: COLORS.primary, fontWeight: 700, fontSize: 20 }}>42</div>
                <div style={{ color: COLORS.mutedForeground, fontSize: 12 }}>Longest</div>
              </div>
              <div style={{ width: 1, backgroundColor: COLORS.border }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ color: COLORS.primary, fontWeight: 700, fontSize: 20 }}>6,100</div>
                <div style={{ color: COLORS.mutedForeground, fontSize: 12 }}>XP this week</div>
              </div>
              <div style={{ width: 1, backgroundColor: COLORS.border }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ color: COLORS.primary, fontWeight: 700, fontSize: 20 }}>#3</div>
                <div style={{ color: COLORS.mutedForeground, fontSize: 12 }}>Rank</div>
              </div>
            </div>
          </div>

          {/* Weekly Activity */}
          <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "16px", marginBottom: 16 }}>
            <div style={{ color: COLORS.foreground, fontWeight: 600, fontSize: 14, marginBottom: 12 }}>This Week</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {DAYS.map((day, i) => (
                <div key={day} style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    backgroundColor: ACTIVITY[i] ? COLORS.primary : COLORS.muted,
                    border: `1px solid ${ACTIVITY[i] ? COLORS.primary : COLORS.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {ACTIVITY[i] ? <span style={{ fontSize: 16 }}>⚡</span> : null}
                  </div>
                  <span style={{ fontSize: 10, color: COLORS.mutedForeground }}>{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div style={{ color: COLORS.foreground, fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Milestones</div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
            {MILESTONES.map(m => (
              <div key={m.days} style={{
                display: "flex", alignItems: "center", gap: 12,
                backgroundColor: COLORS.card, border: `1px solid ${m.unlocked ? COLORS.primary + "44" : COLORS.border}`,
                borderRadius: 14, padding: "12px 16px",
                opacity: m.unlocked ? 1 : 0.5,
              }}>
                <div style={{ fontSize: 24 }}>{m.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: m.unlocked ? COLORS.foreground : COLORS.mutedForeground, fontWeight: 600, fontSize: 14 }}>{m.label}</div>
                  <div style={{ color: COLORS.mutedForeground, fontSize: 12 }}>{m.days} day streak</div>
                </div>
                {m.unlocked ? (
                  <div style={{ backgroundColor: COLORS.primary + "22", color: COLORS.primary, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 8 }}>UNLOCKED</div>
                ) : (
                  <div style={{ color: COLORS.mutedForeground, fontSize: 12 }}>{m.days - 7}d to go</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: "16px" }}>
          <div style={{ color: COLORS.mutedForeground, fontSize: 13, marginBottom: 12 }}>Ranked by XP points this month</div>
          {LEADERBOARD.map(entry => (
            <div key={entry.rank} style={{
              display: "flex", alignItems: "center", gap: 12,
              backgroundColor: (entry as any).isYou ? COLORS.primary + "11" : COLORS.card,
              border: `1px solid ${(entry as any).isYou ? COLORS.primary + "44" : COLORS.border}`,
              borderRadius: 14, padding: "14px 16px", marginBottom: 10,
            }}>
              <span style={{ fontSize: 22, minWidth: 28 }}>{entry.badge ?? `#${entry.rank}`}</span>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: `linear-gradient(135deg, ${COLORS.primary}, #7C3AED)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#FFF", fontWeight: 700, fontSize: 18 }}>{entry.name[0]}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: COLORS.foreground, fontWeight: (entry as any).isYou ? 700 : 600, fontSize: 14 }}>
                  {entry.name} {(entry as any).isYou && <span style={{ color: COLORS.primary, fontSize: 11 }}>(you)</span>}
                </div>
                <div style={{ color: COLORS.mutedForeground, fontSize: 12 }}>🔥 {entry.streak}d streak</div>
              </div>
              <div style={{ textAlign: "right" as const }}>
                <div style={{ color: COLORS.primary, fontWeight: 700, fontSize: 15 }}>{entry.points.toLocaleString()}</div>
                <div style={{ color: COLORS.mutedForeground, fontSize: 11 }}>XP</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Bar */}
      <div style={{ position: "absolute" as const, bottom: 0, left: 0, right: 0, height: 84, backgroundColor: COLORS.card, borderTop: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-around", paddingBottom: 20 }}>
        {[{ icon: "🏠", label: "Feed" }, { icon: "🔍", label: "Explore" }, { icon: "✉️", label: "DMs" }, { icon: "🔔", label: "Alerts", active: true }, { icon: "👤", label: "Profile" }].map(tab => (
          <div key={tab.label} style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 22, opacity: tab.active ? 1 : 0.5 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, color: tab.active ? COLORS.primary : COLORS.mutedForeground, fontWeight: tab.active ? 700 : 400 }}>{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
