import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// ── Helper utilities ─────────────────────────────────────────────────────────
const STATUS_META = {
  PENDING:   { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)",  icon: "⏳", label: "Pending"   },
  CONFIRMED: { color: "#38bdf8", bg: "rgba(56,189,248,0.12)",  border: "rgba(56,189,248,0.3)",  icon: "✔️", label: "Confirmed" },
  COMPLETED: { color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)",  icon: "✅", label: "Completed" },
  CANCELLED: { color: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)",   icon: "🚫", label: "Cancelled" },
};

function statusMeta(s = "") {
  return STATUS_META[s.toUpperCase()] || { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", icon: "•", label: s };
}

function formatDate(d) {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return d; }
}

// Merge API data + localStorage data, de-duplicating by id
function mergeBookings(apiData, localData) {
  const map = {};
  localData.forEach((b) => { map[b.id] = normalizeLocal(b); });
  apiData.forEach((b)   => { map[b.bookingId] = normalizeApi(b); });
  return Object.values(map);
}

function normalizeApi(b) {
  return {
    id:           b.bookingId,
    serviceName:  b.serviceName,
    providerName: b.providerName,
    serviceDate:  b.serviceDate,
    serviceTime:  b.serviceTime,
    totalAmount:  b.totalAmount,
    address:      b.address,
    notes:        b.notes,
    status:       (b.status || "PENDING").toUpperCase(),
    source:       "api",
  };
}

function normalizeLocal(b) {
  return {
    id:           b.id,
    serviceName:  b.categoryName || b.serviceName || "Service",
    providerName: b.providerName || "—",
    serviceDate:  b.bookingDate,
    serviceTime:  b.bookingTime,
    totalAmount:  b.totalCost || b.cost || 0,
    address:      b.location || "—",
    notes:        "",
    status:       (b.status || "PENDING").toUpperCase(),
    source:       "local",
  };
}

// ── Main Component ────────────────────────────────────────────────────────────
const TABS = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default function Module4() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user.role === "PROVIDER") {
      navigate("/provider-dashboard");
    }
  }, [user.role, navigate]);

  const [bookings,    setBookings]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState("ALL");
  const [selected,    setSelected]    = useState(null);  // detail modal
  const [actionMsg,   setActionMsg]   = useState("");

  // ── Fetch ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      // Always get localStorage base
      const all   = JSON.parse(localStorage.getItem("bookings") || "[]");
      const local = all.filter((b) => b.customerEmail === user.email);

      try {
        const res = await api.get(`/bookings/customer/${user.id}`);
        setBookings(mergeBookings(res.data || [], local));
      } catch {
        setBookings(local.map(normalizeLocal));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user.id, user.email]);

  // ── Cancel ─────────────────────────────────────────────────────────
  const cancelBooking = async (booking) => {
    if (!window.confirm("Cancel this booking?")) return;
    // Optimistic UI
    const updated = bookings.map((b) => b.id === booking.id ? { ...b, status: "CANCELLED" } : b);
    setBookings(updated);
    setSelected(null);

    // Sync localStorage
    const all = JSON.parse(localStorage.getItem("bookings") || "[]");
    localStorage.setItem("bookings", JSON.stringify(all.map((b) => b.id === booking.id ? { ...b, status: "Cancelled" } : b)));

    // Try API
    try {
      if (booking.source === "api") await api.put(`/bookings/cancel/${booking.id}`);
      flash("Booking cancelled.");
    } catch {
      flash("Cancelled locally (API offline).");
    }
  };

  // ── Rate ───────────────────────────────────────────────────────────
  const rateBooking = (booking, rating) => {
    // Optimistic UI
    const updated = bookings.map((b) => b.id === booking.id ? { ...b, rating } : b);
    setBookings(updated);
    if (selected && selected.id === booking.id) {
      setSelected({ ...selected, rating });
    }

    // Sync localStorage bookings
    const all = JSON.parse(localStorage.getItem("bookings") || "[]");
    localStorage.setItem("bookings", JSON.stringify(all.map((b) => b.id === booking.id ? { ...b, rating } : b)));

    // Update Provider's overall rating in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u) => {
      // Find provider by name or email
      if (u.role === "PROVIDER" && (u.email === booking.providerEmail || u.name === booking.providerName)) {
        const count = u.ratingCount || 0;
        const currentSum = (u.rating || 0) * count;
        const newCount = count + 1;
        const newRating = (currentSum + rating) / newCount;
        return { ...u, rating: Number(newRating.toFixed(1)), ratingCount: newCount };
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    flash("Thanks for rating the provider! ⭐");
  };

  function flash(msg) {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(""), 3000);
  }

  // ── Filtered list ──────────────────────────────────────────────────
  const filtered = bookings.filter((b) =>
    activeTab === "ALL" || b.status === activeTab
  );

  // ── Stats ──────────────────────────────────────────────────────────
  const stats = {
    total:     bookings.length,
    pending:   bookings.filter((b) => b.status === "PENDING").length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
  };

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div style={page}>
      {/* Header */}
      <div style={header}>
        <div>
          <p style={headerSub}>MODULE 4</p>
          <h1 style={headerTitle}>My Service Bookings</h1>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <NavBtn label="← Dashboard" onClick={() => navigate("/categories")} />
          <NavBtn label="+ New Booking" onClick={() => navigate("/categories")} primary />
        </div>
      </div>

      {/* Flash message */}
      {actionMsg && <div style={flashBox}>{actionMsg}</div>}

      {/* Stats */}
      <div style={statsRow}>
        {[
          { label: "Total",     value: stats.total,     color: "#38bdf8" },
          { label: "Pending",   value: stats.pending,   color: "#f59e0b" },
          { label: "Confirmed", value: stats.confirmed, color: "#38bdf8" },
          { label: "Completed", value: stats.completed, color: "#10b981" },
          { label: "Cancelled", value: stats.cancelled, color: "#ef4444" },
        ].map((s) => (
          <div key={s.label} style={statCard}>
            <span style={{ ...statNum, color: s.color }}>{s.value}</span>
            <span style={statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={tabBar}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ ...tab, ...(activeTab === t ? tabActive : {}) }}
          >
            {t === "ALL" ? "All" : statusMeta(t).icon + " " + statusMeta(t).label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState tab={activeTab} onBrowse={() => navigate("/categories")} />
      ) : (
        <div style={grid}>
          {filtered.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              onCancel={cancelBooking}
              onView={() => setSelected(b)}
              onRate={rateBooking}
            />
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <DetailModal
          booking={selected}
          onClose={() => setSelected(null)}
          onCancel={cancelBooking}
          onRate={rateBooking}
        />
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function BookingCard({ booking, onCancel, onView, onRate }) {
  const m = statusMeta(booking.status);
  return (
    <div style={card}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(56,189,248,0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Card header */}
      <div style={cardTop}>
        <div style={{ flex: 1 }}>
          <h3 style={cardTitle}>{booking.serviceName}</h3>
          <p style={cardSub}>🛠️ {booking.providerName}</p>
        </div>
        <span style={{ ...statusBadge, color: m.color, background: m.bg, border: `1px solid ${m.border}` }}>
          {m.icon} {m.label}
        </span>
      </div>

      <div style={divider} />

      {/* Details */}
      <div style={detGrid}>
        <Det icon="📅" label="Date"    value={formatDate(booking.serviceDate)} />
        <Det icon="⏰" label="Time"    value={booking.serviceTime || "—"} />
        <Det icon="📍" label="Address" value={booking.address || "—"} />
        <Det icon="💰" label="Amount"  value={`₹${booking.totalAmount || 0}`} highlight />
      </div>

      {/* Actions */}
      <div style={btnRow}>
        <Btn label="View Details" onClick={() => onView(booking)} color="#38bdf8" />
        {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
          <Btn label="Cancel" onClick={() => onCancel(booking)} color="#ef4444" />
        )}
      </div>

      {booking.status === "COMPLETED" && (
        <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
            {booking.rating ? "Your Rating" : "Rate Provider"}
          </p>
          <StarRating value={booking.rating || 0} onChange={val => onRate(booking, val)} readonly={!!booking.rating} />
        </div>
      )}
    </div>
  );
}

function DetailModal({ booking, onClose, onCancel, onRate }) {
  const m = statusMeta(booking.status);
  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ color: "#f1f5f9", fontSize: "20px", fontWeight: 800, margin: 0 }}>Booking Details</h2>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        <span style={{ ...statusBadge, color: m.color, background: m.bg, border: `1px solid ${m.border}`, marginBottom: "20px", display: "inline-block" }}>
          {m.icon} {m.label}
        </span>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {[
            ["🛎️ Service",      booking.serviceName],
            ["👷 Provider",      booking.providerName],
            ["📅 Service Date",  formatDate(booking.serviceDate)],
            ["⏰ Time",          booking.serviceTime || "—"],
            ["📍 Address",       booking.address || "—"],
            ["💰 Total",         `₹${booking.totalAmount || 0}`],
            ["📝 Notes",         booking.notes || "—"],
          ].map(([lbl, val]) => (
            <div key={lbl} style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: "10px" }}>
              <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>{lbl}</p>
              <p style={{ fontSize: "14px", color: "#cbd5e1", fontWeight: 600 }}>{val}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "24px", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {booking.status === "COMPLETED" && (
              <StarRating value={booking.rating || 0} onChange={val => onRate(booking, val)} readonly={!!booking.rating} />
            )}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
              <Btn label="Cancel Booking" onClick={() => onCancel(booking)} color="#ef4444" />
            )}
            <Btn label="Close" onClick={onClose} color="#94a3b8" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StarRating({ value, onChange, readonly }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readonly && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{
            cursor: readonly ? "default" : "pointer",
            fontSize: "20px", lineHeight: 1,
            color: star <= (hover || value) ? "#f59e0b" : "rgba(255,255,255,0.15)",
            transition: "color 0.2s"
          }}
        >
          ★
        </span>
      ))}
      {readonly && value > 0 && <span style={{ marginLeft: "6px", fontSize: "14px", color: "#f59e0b", fontWeight: 700 }}>{value.toFixed(1)}</span>}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ ...card, minHeight: "180px", animation: "pulse 1.5s ease-in-out infinite" }}>
          <div style={{ height: "16px", width: "60%", background: "rgba(255,255,255,0.08)", borderRadius: "8px", marginBottom: "12px" }} />
          <div style={{ height: "12px", width: "80%", background: "rgba(255,255,255,0.06)", borderRadius: "8px", marginBottom: "8px" }} />
          <div style={{ height: "12px", width: "40%", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }} />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ tab, onBrowse }) {
  return (
    <div style={emptyBox}>
      <div style={{ fontSize: "52px", marginBottom: "14px" }}>
        {tab === "CANCELLED" ? "🚫" : tab === "COMPLETED" ? "✅" : "📋"}
      </div>
      <h3 style={{ color: "#f1f5f9", fontSize: "18px", marginBottom: "8px" }}>
        {tab === "ALL" ? "No bookings yet" : `No ${tab.toLowerCase()} bookings`}
      </h3>
      <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
        {tab === "ALL" ? "Book a service to get started." : `You have no ${tab.toLowerCase()} bookings.`}
      </p>
      {tab === "ALL" && <Btn label="Browse Services" onClick={onBrowse} color="#38bdf8" />}
    </div>
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

function NavBtn({ label, onClick, primary }) {
  return (
    <button onClick={onClick}
      style={{ padding: "10px 18px", borderRadius: "10px", border: primary ? "none" : "1px solid rgba(255,255,255,0.1)", background: primary ? "linear-gradient(135deg,#38bdf8,#818cf8)" : "rgba(255,255,255,0.06)", color: primary ? "#fff" : "#94a3b8", fontWeight: 700, fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
    >{label}</button>
  );
}

function Btn({ label, onClick, color }) {
  return (
    <button onClick={onClick}
      style={{ padding: "9px 18px", borderRadius: "10px", border: `1px solid ${color}44`, background: `${color}18`, color, fontWeight: 700, fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={e => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.color = color; }}
    >{label}</button>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const page    = { minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1a1f3a 50%,#0f172a 100%)", padding: "40px 32px", fontFamily: "'Inter','Poppins',sans-serif" };
const header  = { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "32px" };
const headerSub   = { fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#38bdf8", marginBottom: "4px" };
const headerTitle = { fontSize: "clamp(22px,4vw,36px)", fontWeight: 800, background: "linear-gradient(90deg,#fff 30%,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 };
const flashBox    = { background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399", borderRadius: "12px", padding: "12px 18px", marginBottom: "20px", fontWeight: 600, fontSize: "14px" };
const statsRow    = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))", gap: "12px", marginBottom: "28px" };
const statCard    = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px 14px", display: "flex", flexDirection: "column", gap: "4px" };
const statNum     = { fontSize: "24px", fontWeight: 800 };
const statLabel   = { fontSize: "11px", color: "#94a3b8", fontWeight: 500 };
const tabBar      = { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" };
const tab         = { padding: "8px 18px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#94a3b8", fontWeight: 600, fontSize: "13px", cursor: "pointer", transition: "all 0.2s" };
const tabActive   = { background: "rgba(56,189,248,0.15)", border: "1px solid #38bdf8", color: "#38bdf8" };
const grid        = { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" };
const card        = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "22px", backdropFilter: "blur(16px)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", transition: "all 0.3s ease" };
const cardTop     = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "14px" };
const cardTitle   = { fontSize: "16px", fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" };
const cardSub     = { fontSize: "13px", color: "#94a3b8" };
const statusBadge = { padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, flexShrink: 0 };
const divider     = { height: "1px", background: "rgba(255,255,255,0.07)", margin: "0 0 14px" };
const detGrid     = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" };
const btnRow      = { display: "flex", gap: "8px", flexWrap: "wrap" };
const emptyBox    = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "60px 32px", textAlign: "center" };
const overlay     = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" };
const modal       = { background: "linear-gradient(135deg,#1e293b,#0f172a)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "24px", padding: "32px", width: "100%", maxWidth: "560px", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" };
const closeBtn    = { width: "34px", height: "34px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "#94a3b8", fontSize: "15px", cursor: "pointer" };
