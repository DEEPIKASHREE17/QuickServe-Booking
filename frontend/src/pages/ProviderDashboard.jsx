import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProviderDashboard() {
  const provider = JSON.parse(localStorage.getItem("user") || "{}");
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (provider.role === "CUSTOMER") {
      navigate("/categories");
      return;
    }
    const all = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(all.filter((b) => b.providerEmail === provider.email || b.categoryName === provider.service));
  }, [provider.email, provider.service]);

  const updateStatus = (id, newStatus) => {
    const all = JSON.parse(localStorage.getItem("bookings") || "[]");
    const updated = all.map((b) => (b.id === id ? { ...b, status: newStatus, providerName: provider.name, providerEmail: provider.email } : b));
    localStorage.setItem("bookings", JSON.stringify(updated));
    setBookings(updated.filter((b) => b.providerEmail === provider.email || b.categoryName === provider.service));
  };

  const [flash, setFlash] = useState("");

  const handleLogout = () => {
    setFlash("You have been logged out successfully.");
    setTimeout(() => {
      setFlash("");
      localStorage.removeItem("user");
      navigate("/");
    }, 1500);
  };

  const pending   = bookings.filter((b) => b.status === "Pending");
  const accepted  = bookings.filter((b) => b.status === "Accepted");
  const completed = bookings.filter((b) => b.status === "Completed");

  return (
    <>
      <div style={page}>
        {/* Header */}
        <div style={header}>
          <div>
            <p style={headerSub}>Provider Dashboard</p>
            <h1 style={headerTitle}>{provider.name || "Provider"}</h1>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={badge}>{provider.service || "Service"}</div>
            <div style={expBadge}>📅 {provider.experience || "—"} exp</div>
            <button style={logoutBtn} onClick={handleLogout}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.25)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.12)"}
            >
              Logout
            </button>
          </div>
        </div>

        {flash && <div style={flashBox}>{flash}</div>}

        {/* Stats */}
        <div style={statsRow}>
          {[
            { label: "Total", value: bookings.length, color: "#38bdf8", icon: "📋" },
            { label: "Pending",   value: pending.length,   color: "#f59e0b", icon: "⏳" },
            { label: "Accepted",  value: accepted.length,  color: "#a78bfa", icon: "✔️" },
            { label: "Completed", value: completed.length, color: "#10b981", icon: "✅" },
          ].map((s) => (
            <div key={s.label} style={statCard}>
              <span style={statIcon}>{s.icon}</span>
              <span style={{ ...statNum, color: s.color }}>{s.value}</span>
              <span style={statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Bookings */}
        <h2 style={sectionH}>Customer Requests</h2>
        {bookings.length === 0 ? (
          <div style={emptyBox}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
            <h3 style={{ color: "#f1f5f9", marginBottom: "6px" }}>No requests yet</h3>
            <p style={{ color: "#94a3b8" }}>Customer bookings will appear here.</p>
          </div>
        ) : (
          <div style={grid}>
            {bookings.map((b) => (
              <div key={b.id} style={card}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(56,189,248,0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={cardTop}>
                  <div>
                    <h3 style={cardTitle}>{b.categoryName}</h3>
                    <p style={cardCustomer}>👤 {b.customerName}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
                <div style={divider} />
                <div style={detGrid}>
                  <Det icon="📅" label="Date"   value={b.bookingDate} />
                  <Det icon="⏰" label="Time"   value={b.bookingTime} />
                  <div style={{ gridColumn: "1 / -1" }}>
                    <Det icon="📍" label="Address" value={b.location || "—"} />
                  </div>
                  <Det icon="💰" label="Price"  value={`₹${b.totalCost || b.cost || 0}`} />
                  {b.selectedServices?.length > 0 && (
                    <Det icon="🛠️" label="Services" value={b.selectedServices.map((s) => s.name).join(", ")} />
                  )}
                </div>
                <div style={btnRow}>
                  {b.status === "Pending" && (
                    <ActionBtn label="Accept ✔" color="#38bdf8" onClick={() => updateStatus(b.id, "Accepted")} />
                  )}
                  {b.status === "Accepted" && (
                    <ActionBtn label="Mark Complete ✅" color="#10b981" onClick={() => updateStatus(b.id, "Completed")} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function StatusBadge({ status }) {
  const map = { Pending: ["#f59e0b","rgba(245,158,11,0.15)","⏳"], Accepted: ["#a78bfa","rgba(167,139,250,0.15)","✔️"], Completed: ["#10b981","rgba(16,185,129,0.15)","✅"] };
  const [c, bg, ico] = map[status] || ["#94a3b8","rgba(148,163,184,0.15)","•"];
  return <span style={{ padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, color: c, background: bg, border: `1px solid ${c}44`, flexShrink: 0 }}>{ico} {status}</span>;
}

function Det({ icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
      <span style={{ fontSize: "14px" }}>{icon}</span>
      <div>
        <p style={{ fontSize: "10px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>{label}</p>
        <p style={{ fontSize: "13px", color: "#cbd5e1", fontWeight: 500 }}>{value}</p>
      </div>
    </div>
  );
}

function ActionBtn({ label, color, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: "10px 20px", borderRadius: "10px", border: `1px solid ${color}44`, background: `${color}18`, color, fontWeight: 700, fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={e => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.color = color; }}
    >{label}</button>
  );
}

const page = { minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1a1f3a 50%,#0f172a 100%)", padding: "40px 32px", fontFamily: "'Inter','Poppins',sans-serif" };
const header = { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "32px" };
const headerSub = { fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#38bdf8", marginBottom: "4px" };
const headerTitle = { fontSize: "clamp(22px,4vw,36px)", fontWeight: 800, background: "linear-gradient(90deg,#fff 30%,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 };
const badge = { padding: "7px 14px", borderRadius: "999px", background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)", color: "#38bdf8", fontWeight: 700, fontSize: "13px" };
const expBadge = { padding: "7px 14px", borderRadius: "999px", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", color: "#a78bfa", fontWeight: 600, fontSize: "13px" };
const logoutBtn = { padding: "9px 16px", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.12)", color: "#f87171", fontWeight: 700, fontSize: "13px", cursor: "pointer", transition: "all 0.2s" };
const statsRow = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: "16px", marginBottom: "36px" };
const statCard = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "18px 16px", display: "flex", flexDirection: "column", gap: "4px" };
const statIcon = { fontSize: "20px" };
const statNum = { fontSize: "26px", fontWeight: 800 };
const statLabel = { fontSize: "12px", color: "#94a3b8", fontWeight: 500 };
const sectionH = { fontSize: "20px", fontWeight: 700, color: "#f1f5f9", marginBottom: "20px" };
const emptyBox = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "60px 32px", textAlign: "center" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" };
const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "22px", backdropFilter: "blur(16px)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", transition: "all 0.3s ease" };
const cardTop = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "16px" };
const cardTitle = { fontSize: "16px", fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" };
const cardCustomer = { fontSize: "13px", color: "#94a3b8" };
const divider = { height: "1px", background: "rgba(255,255,255,0.07)", marginBottom: "16px" };
const detGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" };
const btnRow = { display: "flex", gap: "10px", flexWrap: "wrap" };
const flashBox = { background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)", color: "#38bdf8", borderRadius: "12px", padding: "12px 18px", marginBottom: "20px", fontWeight: 600, fontSize: "14px" };

export default ProviderDashboard;