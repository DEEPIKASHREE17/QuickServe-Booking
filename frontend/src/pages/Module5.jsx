import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// ── Status metadata ───────────────────────────────────────────────────────────
const STATUS_META = {
  PENDING:   { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)",  icon: "⏳", label: "Pending"   },
  CONFIRMED: { color: "#38bdf8", bg: "rgba(56,189,248,0.12)",  border: "rgba(56,189,248,0.3)",  icon: "✔️", label: "Confirmed" },
  COMPLETED: { color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)",  icon: "✅", label: "Completed" },
  CANCELLED: { color: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)",   icon: "🚫", label: "Cancelled" },
};

function sm(s = "") {
  return STATUS_META[(s || "").toUpperCase()] || { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", icon: "•", label: s };
}

function formatDate(d) {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return d; }
}

// Normalise local booking to unified shape
function fromLocal(b) {
  return {
    id:           b.id,
    customerName: b.customerName || "Customer",
    serviceName:  b.categoryName || b.serviceName || "Service",
    serviceDate:  b.bookingDate,
    serviceTime:  b.bookingTime || "—",
    totalAmount:  b.totalCost || b.cost || 0,
    address:      b.location || "—",
    notes:        "",
    status:       (b.status || "PENDING").toUpperCase(),
    selectedServices: b.selectedServices || [],
    source:       "local",
  };
}

// Normalise API booking to unified shape
function fromApi(b) {
  return {
    id:           b.bookingId,
    customerName: b.customerName || "Customer",
    serviceName:  b.serviceName  || "Service",
    serviceDate:  b.serviceDate,
    serviceTime:  b.serviceTime  || "—",
    totalAmount:  b.totalAmount  || 0,
    address:      b.address      || "—",
    notes:        b.notes        || "",
    status:       (b.status      || "PENDING").toUpperCase(),
    selectedServices: [],
    source:       "api",
  };
}

function mergeBySource(apiData, localData) {
  const map = {};
  localData.forEach(b => { map[b.id] = b; });
  apiData.forEach(b   => { map[b.id] = b; });
  return Object.values(map);
}

// ── Component ─────────────────────────────────────────────────────────────────
const TABS = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default function Module5() {
  const navigate = useNavigate();
  const provider = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (provider.role === "CUSTOMER") {
      navigate("/categories");
    }
  }, [provider.role, navigate]);

  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [flash,     setFlash]     = useState({ msg: "", type: "success" });

  // ── Fetch ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      const all   = JSON.parse(localStorage.getItem("bookings") || "[]");
      const local = all
        .filter(b => b.providerEmail === provider.email || b.categoryName === provider.service)
        .map(fromLocal);

      try {
        const res = await api.get(`/bookings/provider/${provider.id}`);
        const api_ = (res.data || []).map(fromApi);
        setBookings(mergeBySource(api_, local));
      } catch {
        setBookings(local);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [provider.id, provider.email, provider.service]);

  // ── Status update ──────────────────────────────────────────────────
  const updateStatus = async (booking, newStatus) => {
    // Optimistic update
    setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: newStatus, providerName: provider.name } : b));

    // Sync localStorage
    const all     = JSON.parse(localStorage.getItem("bookings") || "[]");
    const updated = all.map(b =>
      b.id === booking.id ? { ...b, status: newStatus.charAt(0) + newStatus.slice(1).toLowerCase(), providerName: provider.name, providerEmail: provider.email } : b
    );
    localStorage.setItem("bookings", JSON.stringify(updated));

    // Try API
    try {
      if (booking.source === "api") {
        await api.put(`/bookings/status/${booking.id}`, { status: newStatus });
      }
      showFlash(`Booking ${newStatus.toLowerCase()}.`, "success");
    } catch {
      showFlash(`Updated locally (API offline).`, "warn");
    }
  };

  function showFlash(msg, type = "success") {
    setFlash({ msg, type });
    setTimeout(() => setFlash({ msg: "", type: "success" }), 3000);
  }

  // ── Derived data ───────────────────────────────────────────────────
  const filtered = bookings.filter(b =>
    activeTab === "ALL" || b.status === activeTab
  );

  const stats = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === "PENDING").length,
    confirmed: bookings.filter(b => b.status === "CONFIRMED").length,
    completed: bookings.filter(b => b.status === "COMPLETED").length,
  };

  const earned = bookings
    .filter(b => b.status === "COMPLETED")
    .reduce((s, b) => s + (b.totalAmount || 0), 0);

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div style={page}>
      {/* Header */}
      <div style={header}>
        <div>
          <p style={headerSub}>MODULE 5 · PROVIDER</p>
          <h1 style={headerTitle}>Service Fulfillment</h1>
          <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>
            {provider.name || "Provider"} · {provider.service || "Services"}
          </p>
        </div>
        <button onClick={() => navigate("/provider-dashboard")} style={backBtn}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
        >← Dashboard</button>
      </div>

      {/* Flash */}
      {flash.msg && (
        <div style={{ ...flashBox, ...(flash.type === "warn" ? flashWarn : {}) }}>
          {flash.msg}
        </div>
      )}

      {/* Stats */}
      <div style={statsRow}>
        {[
          { label: "Total Requests", value: stats.total,     color: "#38bdf8" },
          { label: "Pending",        value: stats.pending,   color: "#f59e0b" },
          { label: "Confirmed",      value: stats.confirmed, color: "#a78bfa" },
          { label: "Completed",      value: stats.completed, color: "#10b981" },
          { label: "Total Earned",   value: `₹${earned}`,   color: "#34d399" },
        ].map(s => (
          <div key={s.label} style={statCard}>
            <span style={{ ...statNum, color: s.color }}>{s.value}</span>
            <span style={statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={tabBar}>
        {TABS.filter(t => t !== "CANCELLED").map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ ...tabBtn, ...(activeTab === t ? tabActive : {}) }}
          >
            {t === "ALL" ? "All Requests" : sm(t).icon + " " + sm(t).label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <div style={grid}>
          {filtered.map(b => (
            <RequestCard
              key={b.id}
              booking={b}
              onAccept={()  => updateStatus(b, "CONFIRMED")}
              onComplete={() => updateStatus(b, "COMPLETED")}
              onReject={()  => updateStatus(b, "CANCELLED")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RequestCard({ booking, onAccept, onComplete, onReject }) {
  const m = sm(booking.status);
  return (
    <div style={card}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(56,189,248,0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Top row */}
      <div style={cardTop}>
        <div style={{ flex: 1 }}>
          <h3 style={cardTitle}>{booking.serviceName}</h3>
          <p style={cardSub}>👤 {booking.customerName}</p>
        </div>
        <span style={{ ...badge, color: m.color, background: m.bg, border: `1px solid ${m.border}` }}>
          {m.icon} {m.label}
        </span>
      </div>

      <div style={divider} />

      {/* Details */}
      <div style={detGrid}>
        <Det icon="📅" label="Date"    value={formatDate(booking.serviceDate)} />
        <Det icon="⏰" label="Time"    value={booking.serviceTime} />
        <Det icon="📍" label="Address" value={booking.address} />
        <Det icon="💰" label="Amount"  value={`₹${booking.totalAmount}`} highlight />
      </div>

      {/* Selected sub-services */}
      {booking.selectedServices?.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <p style={{ fontSize: "10px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Services Requested</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {booking.selectedServices.map((s, i) => (
              <span key={i} style={{ padding: "3px 10px", borderRadius: "999px", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", color: "#7dd3fc", fontSize: "12px", fontWeight: 600 }}>
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={btnRow}>
        {booking.status === "PENDING" && (
          <>
            <ActionBtn label="✔ Accept"  color="#38bdf8" onClick={onAccept} />
            <ActionBtn label="✕ Reject"  color="#ef4444" onClick={onReject} />
          </>
        )}
        {booking.status === "CONFIRMED" && (
          <ActionBtn label="✅ Mark Complete" color="#10b981" onClick={onComplete} />
        )}
        {(booking.status === "COMPLETED" || booking.status === "CANCELLED") && (
          <span style={{ fontSize: "13px", color: "#64748b", fontStyle: "italic" }}>
            {booking.status === "COMPLETED" ? "Service fulfilled ✅" : "Request rejected"}
          </span>
        )}
      </div>
    </div>
  );
}

function ActionBtn({ label, color, onClick }) {
  return (
    <button onClick={onClick}
      style={{ padding: "9px 18px", borderRadius: "10px", border: `1px solid ${color}44`, background: `${color}18`, color, fontWeight: 700, fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={e => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.color = color; }}
    >{label}</button>
  );
}

function Det({ icon, label, value, highlight }) {
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
      <span style={{ fontSize: "14px", flexShrink: 0 }}>{icon}</span>
      <div>
        <p style={{ fontSize: "10px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>{label}</p>
        <p style={{ fontSize: "13px", color: highlight ? "#38bdf8" : "#cbd5e1", fontWeight: highlight ? 700 : 500 }}>{value}</p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ ...card, minHeight: "200px" }}>
          <div style={{ height: "14px", width: "55%", background: "rgba(255,255,255,0.08)", borderRadius: "6px", marginBottom: "10px" }} />
          <div style={{ height: "10px", width: "70%", background: "rgba(255,255,255,0.05)", borderRadius: "6px" }} />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ tab }) {
  return (
    <div style={emptyBox}>
      <div style={{ fontSize: "52px", marginBottom: "14px" }}>📭</div>
      <h3 style={{ color: "#f1f5f9", fontSize: "18px", marginBottom: "8px" }}>
        {tab === "ALL" ? "No requests yet" : `No ${tab.toLowerCase()} requests`}
      </h3>
      <p style={{ color: "#94a3b8" }}>
        {tab === "ALL" ? "Customer requests will appear here." : `You have no ${tab.toLowerCase()} requests right now.`}
      </p>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const page      = { minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1a1f3a 50%,#0f172a 100%)", padding: "40px 32px", fontFamily: "'Inter','Poppins',sans-serif" };
const header    = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "32px" };
const headerSub = { fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#a78bfa", marginBottom: "4px" };
const headerTitle = { fontSize: "clamp(22px,4vw,36px)", fontWeight: 800, background: "linear-gradient(90deg,#fff 30%,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 4px" };
const backBtn   = { padding: "10px 18px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: "#94a3b8", fontWeight: 700, fontSize: "13px", cursor: "pointer", transition: "all 0.2s" };
const flashBox  = { background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399", borderRadius: "12px", padding: "12px 18px", marginBottom: "20px", fontWeight: 600, fontSize: "14px" };
const flashWarn = { background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", color: "#fbbf24" };
const statsRow  = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: "12px", marginBottom: "28px" };
const statCard  = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px 14px", display: "flex", flexDirection: "column", gap: "4px" };
const statNum   = { fontSize: "22px", fontWeight: 800 };
const statLabel = { fontSize: "11px", color: "#94a3b8", fontWeight: 500 };
const tabBar    = { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" };
const tabBtn    = { padding: "8px 18px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#94a3b8", fontWeight: 600, fontSize: "13px", cursor: "pointer", transition: "all 0.2s" };
const tabActive = { background: "rgba(167,139,250,0.15)", border: "1px solid #a78bfa", color: "#a78bfa" };
const grid      = { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" };
const card      = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "22px", backdropFilter: "blur(16px)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", transition: "all 0.3s ease" };
const cardTop   = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "14px" };
const cardTitle = { fontSize: "16px", fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" };
const cardSub   = { fontSize: "13px", color: "#94a3b8" };
const badge     = { padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, flexShrink: 0 };
const divider   = { height: "1px", background: "rgba(255,255,255,0.07)", margin: "0 0 14px" };
const detGrid   = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" };
const btnRow    = { display: "flex", gap: "8px", flexWrap: "wrap" };
const emptyBox  = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "60px 32px", textAlign: "center" };
